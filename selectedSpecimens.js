function selectedSpecimens()
{
var width = $("#selected_view").width(),
    height = 700,
    padding = 6, // separation between nodes
    maxRadius = 12;

//var n = 700; // total number of nodes
var m= 0;//m = 6; // number of distinct clusters
var nodes = [];

for(var i = 0; i < selection.length; i++)
{
	if(selection[i].children && selection[i].children[0].measures)
	{
		m++;
	}
}
var y = d3.scale.ordinal()
    .domain(d3.range(m))
    .rangePoints([0, height], 1);
	
for(var i = 0; i < selection.length; i++)
{
	if(selection[i].measures)
	{
		var pos = Math.floor(Math.random() * m);
		nodes.push({radius: 5,color: selection[i].color, cx: width / 2,cy: y(pos)});
	}
	
}


svg_selected_specimens.selectAll("*").remove();

var color = d3.scale.category10()
    .domain(d3.range(m));
	

/*
var nodes = d3.range(n).map(function() 
{
	var i = Math.floor(Math.random() * m);
	return {
		radius: 5,//Math.sqrt(v) * maxRadius,
		color: color(i),
		cx: width / 2,
		cy: x(i)
	};
});*/



var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .charge(-7)
    .on("tick", tick)
    .start();

var circle = svg_selected_specimens.selectAll("circle")
	.data(nodes)
	.enter().append("circle")
	.attr("r", function(d) { return d.radius; })
	.style("fill", function(d) { return d.color; })
	.call(force.drag);
	

function tick(e) 
{
  circle
      .each(gravity(.2 * e.alpha))
      .each(collide(.5))
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// Move nodes toward cluster focus.
function gravity(alpha) 
{
  return function(d) 
  {
    d.y += (d.cy - d.y) * alpha;
    d.x += (d.cx - d.x) * alpha;
  };
}

// Resolve collisions between nodes.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

function update() 
{

    // Update the nodes…
    node = svg.selectAll("circle.node")
        .data(nodes);

    // Enter any new nodes.
    node.enter().append("circle")
        .attr("class", "node")
        .attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
        return d.y;
    })
        .attr("r", function (d) {
        return d.radius;
    })
        .style("fill", "steelblue")
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();

    // Restart the force layout.
    force.start();
}

}