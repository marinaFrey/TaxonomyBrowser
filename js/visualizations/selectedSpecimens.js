/*
 * Class for the selected specimens visualization
 * creates dots each representing one specimen selected that matches the current filter
 */
function SelectedSpecimens()
{
    var width = $("#selected_view_svg").width(),
        height = $("#selected_view_svg").height() -10,
        padding = 6, // separation between nodes
        maxRadius = 12;

    var number_of_clusters; // number of distinct clusters
    var circle; // circles created
    var nodes; 
    var groups; // list with the name of each species shown
    var y;  // ordinal scale to position clusters
	var x;
	var rScale;
    var force;
    var ptr = this;
	var div;

	var context;
	var dataContainer;
    /*
     * initializes what is needed for the visualization
     */
    this.create = function()
    {
        // scale defining the position of each cluster
        y = d3.scale.ordinal()
            .rangePoints([0, height], 1);  
			
		rScale = d3.scale.linear();
			
        // creating force layout to simulate gravity
        force = d3.layout.force()
            .size([width, height])
            .gravity(0.2)
            .charge(-15);//(-7) 
			
		div = d3.select("body").append("div")   
			.attr("class", "tooltip")               
			.style("opacity", 0);
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
		var colors = [];
        

		
		
        
                
        
        
		var gravityValue = 0.2;
		var chargeValue = -15;
		
        // if there is no filter applied, all selection is used 
        if(filteredSelection[0] == "all")
        {   
			for(var i = 0; i < selection.length; i++)
			{
				if(selection[i].children && selection[i].children[0].measures)
				{
					colors[selection[i].name] = selection[i].color;
					groups.push(selection[i].name);
					number_of_clusters++;
				}
			}
			y.domain(d3.range(number_of_clusters))
			groups.sort(function(){return .5 - Math.random();});
			
			if(selection.length > 600)
			{
				gravityValue = 0.35;
				chargeValue = -6;
			}
			else
			{
				if(selection.length < 100)
				{
					if(selection.length < 25)
					{
						gravityValue = 0.01;
						chargeValue = -250;
					}
					else
						chargeValue = -130;
				}
				else
				{
					if(selection.length < 300)
						chargeValue = -50;
					else
					if(selection.length < 500)
					{
						//gravityValue = -0.01;
						chargeValue = -25;
					}
				}
			}
			var r = setRadius(selection.length);
            for(var i = 0; i < selection.length; i++)
            {
                if(selection[i].measures)
                {
                    var pos = groups.indexOf(selection[i].name);
                    // defining circle with species color
                    nodes.push(
                    {
                        radius: r,//setRadius(selection.length),
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
			//console.log(filteredSelection);
			for(var i = 0; i < filteredSelection.length; i++)
			{
				if(groups.map(function(e) { return e; }).indexOf(selection[filteredSelection[i]].name) == -1)
				{
					colors[selection[filteredSelection[i]].name] = selection[filteredSelection[i]].color;
					groups.push(selection[filteredSelection[i]].name);
					number_of_clusters++;
				}
			}
			
			y.domain(d3.range(number_of_clusters))
			groups.sort(function(){return .5 - Math.random();});
			
			if(filteredSelection.length > 600)
			{
				gravityValue = 0.35;
				chargeValue = -6;
			}
			else
			{
				if(filteredSelection.length < 100)
				{
					if(filteredSelection.length < 25)
					{
						gravityValue = 0.01;
						chargeValue = -250;
					}
					else
						chargeValue = -130;
				}
				else
				{
					if(filteredSelection.length < 300)
						chargeValue = -50;
					else
					if(filteredSelection.length < 500)
					{
						//gravityValue = -0.01;
						chargeValue = -25;
					}
				}
			}
			var r = setRadius(filteredSelection.length);
            // if there is filter applied, filteredSelection vector is used as index to access selected specimens in dataset
            for (var i = 0; i < filteredSelection.length; i++)
            {
                var pos = groups.indexOf(selection[filteredSelection[i]].name);
                // defining circle with species color
                nodes.push(
                {
                    radius: r,
                    color: selection[filteredSelection[i]].color, 
                    cx: width / 2,
                    cy:  y(pos), 
                    specimen: selection[filteredSelection[i]]
                });
            }
        }

		counting.updateInAnalysis();
		var speciesNumbersHTML = "";
		var totalNumber = 0;
		for(var i = 0; i < groups.length; i++)
        {
			var numberOfSelectedFromSpecies = counting.getNumberSelectedFromSpecies(groups[i])
			if(numberOfSelectedFromSpecies)
			{
				speciesNumbersHTML += "<b> <font color="+colors[groups[i]]+">"+groups[i]+":</b> "+numberOfSelectedFromSpecies+" </font><br>";
				totalNumber += numberOfSelectedFromSpecies;
			}
		}
		speciesNumbersHTML += "<b>Total:</b> "+totalNumber+"<br>";


		if(nodes.length > 600)
		{
			var zoom = d3.behavior.zoom();
			document.getElementById("selected_view_svg").style.display =  "none";
			document.getElementById("selected_view_canvas").style.display =  "block";

			force = d3.layout.force()
				.size([width, height]);
				
			context = canvas.node().getContext("2d");
			
			canvas
				.on("mousemove", function(d)
				{ 
					// showing tooltip with x, y and circle size values
					div
						.transition()        
						.duration(200)      
						.style("opacity", .9);
						
					div 
						.html(speciesNumbersHTML)  
						.style("left", (d3.event.pageX + 10) + "px")     
						.style("top", (d3.event.pageY - 60) + "px"); 
				})                  
				.on("mouseout", function(d)
				{ 
					div
						.transition()        
						.duration(500)      
						.style("opacity", 0);   
				});
			
			force
			  .nodes(nodes)
			  .gravity(gravityValue)
			  .charge(chargeValue)
			  //.links(graph.links)
			  .on("tick", ptr.tickCanvas)
			  .alpha(0.1)
			  .start();
			
			canvas
				.call(zoom.x(rScale).y(rScale).scaleExtent([1, 8]).on("zoom", ptr.tickCanvas))


		}
		else
		{
			document.getElementById("selected_view_svg").style.display =  "block";
			document.getElementById("selected_view_canvas").style.display =  "none";
			
			svg_selected_specimens//.append("clipPath")
				//.attr("id","circle-area")
				.append("rect")
				//.attr("x",0)
				//.attr("y",0)
				.attr("width", width )
				.attr("height", height )
				.attr("fill", "white")
				.on("mousemove", function(d)
				{ 
					// showing tooltip with x, y and circle size values
					div
						.transition()        
						.duration(200)      
						.style("opacity", .9);
						
					div 
						.html(speciesNumbersHTML)  
						.style("left", (d3.event.pageX + 10) + "px")     
						.style("top", (d3.event.pageY - 60) + "px"); 
				})                  
				.on("mouseout", function(d)
				{ 
					div
						.transition()        
						.duration(500)      
						.style("opacity", 0);   
				});;
			
				
			
			force
				.nodes(nodes)
				.size([width, height])
				.gravity(gravityValue)
				.charge(chargeValue)
				.on("tick", ptr.tick);
				
			// creating circle
			circle = svg_selected_specimens.selectAll("circle")
				.data(nodes)
				.enter().append("circle")
				.attr("r", function(d){ return d.radius; })
				.style("fill", function(d){ return d.color; })
				//.style("display", "none")
				.call(force.drag);
			
			var numberOfCircles = nodes.length;
			
			// changing duration of circle expansion depending on how many circles there is to create
			var orderingDuration = (numberOfCircles/20)*(numberOfCircles/10);
			
			var index = numberOfCircles/1.7;
			// transitioning circle size to create effect and
			// to make the circles position themselves more easily
			
			
			circle.transition()
				.duration(orderingDuration)
				.delay(function(d, i) { return 5; })
				.attrTween("r", function(d) 
				{
					var i = d3.interpolate(d.radius/10, d.radius);
					return function(t) { return d.radius = i(t); };
				})
				.each("end", function(e, i) 
				{
					index ++;
					if (index >= numberOfCircles) 
					{
						index = - numberOfCircles;
						console.log("hover");
						ptr.enableMouseEvents(true);
					}
				});
				
			//force.on("end", function(){ptr.enableMouseEvents(true);});
			force.start();
		}
    }

	
	this.enableMouseEvents = function(enable)
	{
		if(enable)
		{
			circle
				.on("click", function(d){ if (d3.event.defaultPrevented) return; makeSpecimenPopup(d.specimen);})
				.on("mouseover", function(d){ d3.select(this).style("stroke", "black");})                  
				.on("mouseout", function(d){ d3.select(this).style("stroke", "none");})
				.style("display", "block");
		}
	
	}
	
	this.tickCanvas = function() 
	{
		context.clearRect(0, 0, width, height + 20);

		force.alpha(0.05);
		
		nodes.forEach(function(d) 
		{
			context.beginPath();
			
			
			d.x = d.x + (d.cx-d.x)/500;
			d.y = d.y + (d.cy-d.y)/500;
			
			d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
			d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
			
			//context.moveTo(d.x, d.y);
			context.arc(d.x, d.y, (d.radius), 0, 2 * Math.PI);
			//
			//console.log(d.cx+','+d.cy)
			context.fillStyle = d.color;
			context.fill();
			context.closePath();
		});
		
	}
	
	
    /*
     * Updates circle's position according to force applied
     */
    this.tick = function(e)
    {
		force.alpha(0.05);
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
	

	function setRadius(total)
	{
		return (0.1 + 70/(1+Math.sqrt(total))); 		
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

