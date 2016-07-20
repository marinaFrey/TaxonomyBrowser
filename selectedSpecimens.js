/*
 * Class for the selected specimens visualization
 * creates dots each representing one specimen selected that matches the current filter
 */
function SelectedSpecimens()
{
    var width = $("#selected_view").width(),
        height = $("#selected_view").height() -10,
        padding = 6, // separation between nodes
        maxRadius = 12;

    var number_of_clusters; // number of distinct clusters
    var circle; // circles created
    var nodes; 
    var groups; // list with the name of each species shown
    var y;  // ordinal scale to position clusters
    var force;
    var ptr = this;

    /*
     * initializes what is needed for the visualization
     */
    this.create = function()
    {
        // scale defining the position of each cluster
        y = d3.scale.ordinal()
            .rangePoints([0, height], 1);  

        // creating force layout to simulate gravity
        force = d3.layout.force()
            .size([width, height])
            .gravity(0.2)
            .charge(-15);//(-7) 
    }
    
    /*
     * creates and updates the visualization
     */
    this.update = function()
    {
        svg_selected_specimens.selectAll("*").remove();
        
        // checking how many different species are being shown to get number of clusters needed
        number_of_clusters = 0;
        nodes = [];
        groups = [];
        for(var i = 0; i < selection.length; i++)
        {
            if(selection[i].children && selection[i].children[0].measures)
            {
                groups.push(selection[i].name);
                number_of_clusters++;
            }
        }

        y.domain(d3.range(number_of_clusters))
                
        groups.sort(function(){return .5 - Math.random();});
        
        // if there is no filter applied, all selection is used 
        if(filteredSelection[0] == "all")
        {   
            for(var i = 0; i < selection.length; i++)
            {
                if(selection[i].measures)
                {
                    var pos = groups.indexOf(selection[i].name);
                    // defining circle with species color
                    nodes.push(
                    {
                        radius: 5,//setRadius(selection.length),
                        color: selection[i].color, 
                        cx: width / 2,
                        cy:  y(pos), 
                        specimen: selection[i]
                    });
                }
                
            }
        }
        else
        {
            // if there is filter applied, filteredSelection vector is used as index to access selected specimens in dataset
            for (var i = 0; i < filteredSelection.length; i++)
            {
                var pos = groups.indexOf(selection[filteredSelection[i]].name);
                // defining circle with species color
                nodes.push(
                {
                    radius: 5,//setRadius(filteredSelection.length),
                    color: selection[filteredSelection[i]].color, 
                    cx: width / 2,
                    cy:  y(pos), 
                    specimen: selection[filteredSelection[i]]
                });
            }
        }

        force
            .nodes(nodes)
            .on("tick", ptr.tick)
            .start();
            
        // creating circle
        circle = svg_selected_specimens.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", function(d){ return d.radius; })
            .style("fill", function(d){ return d.color; })
            .on("click", function(d){ makeSpecimenPopup(d.specimen);})
            .on("mouseover", function(d){ d3.select(this).style("stroke", "black");})                  
            .on("mouseout", function(d){ d3.select(this).style("stroke", "none");})
            .call(force.drag);
          
        // changing duration of circle expansion depending on how many circles there is to create
        var orderingDuration = (nodes.length/20)*(nodes.length/10);
        
        // transitioning circle size to create effect and
        // to make the circles position themselves more easily
        circle.transition()
            .duration(orderingDuration)
            .delay(function(d, i) { return 5; })
            .attrTween("r", function(d) 
            {
                var i = d3.interpolate(d.radius/10, d.radius);
                return function(t) { return d.radius = i(t); };
            });
    
    }

    /*
     * Updates circle's position according to force applied
     */
    this.tick = function(e)
    {
        circle
            .each(ptr.gravity(.2 * e.alpha))
            .each(ptr.collide(0.5))
            .attr("cx", function(d) { return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(d.radius, Math.min(height - d.radius, d.y)); });
    }

    /*
     * Move nodes toward cluster focus
     */
    this.gravity = function(alpha)
    {
        return function(d) 
        {
            d.y += (d.cy - d.y) * alpha;
            d.x += (d.cx - d.x) * alpha;
        };
    }
    
    /*
     * Resolve collisions between nodes
     */
    this.collide = function(alpha)
    {
        var quadtree = d3.geom.quadtree(nodes);
        return function(d) 
        {
            var r = d.radius + maxRadius + padding,
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
                        r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
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


    /*
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
    }*/
}