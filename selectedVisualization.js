function selectedVisualization()
{
    var height = 600;
    var width = 700;
    
    var xScale;
    var yScale;
    var rScale;
    
    var circle;
    var padding = 1.5; // separation between same-color circles
    var clusterPadding = 6; // separation between different-color circles
    var node;
    var diameter = 600,
    format = d3.format(",d");
    
    var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);
    
    this.create = function()
    {/*
        svg_selected = d3.select("#sel_viz").append("svg")//d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");*/
        document.getElementById("maps").style = "display:none;";
        document.getElementById("sel_viz").style = "display:block;";
        svg_selected.selectAll("*").remove();
        
        xScale = d3.scale.linear();
        xScale.range([0,width]);

        yScale = d3.scale.linear();
        yScale.range([0,height]);
        
        rScale = d3.scale.linear();
        rScale.range([2,5]);

    }
    
    this.update = function(dataset)
    {
        document.getElementById("maps").style = "display:none;";
        document.getElementById("sel_viz").style = "display:block;";
        svg_selected.selectAll("*").remove();
        
        var sizeName = comboSize.getSelectedOption();
        
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0,d3.max(dataset)]);
        //rScale.domain([0,d3.max(dataset, function(d){return d.size;})]);
        rScale.domain(d3.extent(dataset, function(d)
		{
				if(!d.children)
				{
					if(d.measures)
					{
						for(var j = 0; j < d.measures.length; j++)
						{
								if(d.measures[j].name == sizeName)
								{
									return parseFloat(d.measures[j].value);
								}
						}
					}
					
				}

		}));
        
        
        
        //svg_selected.attr("transform", "translate(" + ((width) / 2)  + "," + (height / 2 + 10) + ")");
        /*
        svg_selected.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")  
                .filter(function(d) { return !d.children;}) // only shows for leaves
                .attr("x",function(d,i){return xScale(i);})
                .attr("y",function(d){return 0;})//return height - yScale(d.size);})
                .attr("width",xScale.rangeBand())
                .attr("height",function(d){return d.size/20;})//yScale(d.size);})
                .attr("fill", function(d){return d.color;});;*/
         
            
        
        node = svg_selected.selectAll(".node")
            .data(bubble.nodes(classes(dataset,sizeName))
            .filter(function(d) { return !d.children; }))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
            
        circle = node.append("circle")
            .attr("r", function(d) { return d.r; })
            //.attr("cx", function(d){ return d.x; })
            //.attr("cy", function(d){ return d.y; })
            .style("fill", function(d) { return d.color });
            
        var force = d3.layout.force()
            .nodes(svg_selected.selectAll(".node"))
            .size([width, height])
            .gravity(0)
            .charge(0)
            .on("tick", tick)
            .start();
        /*
        node.append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.className.substring(0, d.r / 3); });*/
    
    }
    
    function classes(root,measureName)
    {
        var classes = [];

        for(var i = 0; i < root.length; i++)
        {
            if(!root[i].rank && root[i].measures)
            {

                for(var j = 0; j < root[i].measures.length; j++)
                {
                        if(root[i].measures[j].name == measureName)
                        {
                            //console.log("X " +xScale(parseFloat(d.measures[j].value)));
                            classes.push({color: root[i].color, className: root[i].name, value: parseFloat(root[i].measures[j].value)});
                        }
                }
            }
        }
        return {children: classes};

        
        /*
        function recurse(name, node) 
        {
            if (node.children) 
            {
                node.children.forEach(function(child) 
                { 
                    recurse(node.name, child); 
                });
            }
            else 
                classes.push({packageName: name, className: node.name, value: 200});
        }

            recurse(null, root);
            return {children: classes};*/
    }
    
    function tick(e) 
    {
        circle
          .each(cluster(10 * e.alpha * e.alpha))
          .each(collide(.5))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }
    
        // Move d to be adjacent to the cluster node.
        function cluster(alpha) 
        {
            return function(d) 
            {
                var cluster = clusters[d.cluster];
                if (cluster === d) return;
                var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + cluster.radius;
                if (l != r) 
                {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    cluster.x += x;
                    cluster.y += y;
                }
            };
        }
    
    function collide(alpha) 
    {
        var quadtree = d3.geom.quadtree(nodes);
        return function(d) 
        {
            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) 
            {
                if (quad.point && (quad.point !== d)) 
                {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) 
                    {
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

}