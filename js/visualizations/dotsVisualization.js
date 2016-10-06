/*
 * Class for the scatterplot visualization
 * creates scatterplot with x and y axis
 */
function dotsVisualization()
{
    var margin = {top: 30, right: 10, bottom: 10, left: 10};
    var h =  $("#sel_viz").height() + margin.top + margin.bottom ;
	var w = $("#sel_viz").width() - 40;
    var dataset;
	var circlePadding = 40;
	var borderBarPadding = 7;
    
    // div for creating tooltip
	var div;
    
    // scales and axis
	var xScale;
	var yScale;
	var rScale;
	var xAxis;
	var yAxis;
	
    /*
     * initializes what is needed for the scatterplot
     */
	this.create = function()
    {   
		div = d3.select("body").append("div")   
			.attr("class", "tooltip")               
			.style("opacity", 0);
    }
    
    /*
     * creates and updates the visualization
     */
    this.update = function()
    {
        svg_selected.selectAll("*").remove();

        //svg_selected
        //    .attr("transform", "translate( 0 ," + (margin.top*-1) + ")");
        
        var y = {};
        // gets variables that define the x and y axis and the size of each circle
        var dimensions = [comboX.getSelectedOption(),comboY.getSelectedOption(),comboSize.getSelectedOption()];
		
        // if there is filter applied, filteredSelection vector is used as index to access selected specimens in dataset
		if(filteredSelection[0] != "all")
        {
            dataset = [];
            // for showing a circle all 3 variables selected must exist
            // so it's made a check to confirm if the specimen has a value to all 3 before showing
            for (var i = 0; i < filteredSelection.length; i++)
            {
                if(selection[filteredSelection[i]].measures)
                {
                    values = [];
                    for(var j = 0; j < selection[filteredSelection[i]].measures.length; j++)
                    {
                        var measureName = selection[filteredSelection[i]].measures[j].name
                        // getting measure value if they exist for the specimen
                        for (var k = 0; k < dimensions.length; k++)
                        {
                            if(measureName == dimensions[k])
                            {
                                values[k] = selection[filteredSelection[i]].measures[j].value;
                            }
                        }                     
                    }
                    var accepted = true;
                    for (var k = 0; k < dimensions.length; k++)
                    {
                        if(!values[k])
                        {
                            // not accepted if any of the 3 values don't exist on this specimen
                            accepted = false;
                        }
                    }

                    if(accepted)
                    {
                        dataset.push({values: values, specimen: selection[filteredSelection[i]]});
                    }
                }
            }
        }
        else
        {
            // if there is no filter applied, all selection is used 
            dataset= [];
            // for showing a circle all 3 variables selected must exist
            // so it's made a check to confirm if the specimen has a value to all 3 before showing
            for (var i = 0; i < selection.length; i++)
            {
                if(selection[i].measures)
                {
                    values = [];
                    
                    for(var j = 0; j < selection[i].measures.length; j++)
                    {
                        var measureName = selection[i].measures[j].name
                        // getting measure value if they exist for the specimen
                        for (var k = 0; k < dimensions.length; k++)
                        {
                            if(measureName == dimensions[k])
                            {
                                values[k] = selection[i].measures[j].value;
                            }
                        }              
                        
                    }
                    
                    var accepted = true;
                    for (var k= 0; k < dimensions.length; k++)
                    {
                        if(!values[k])
                        {
                            // not accepted if any of the 3 values don't exist on this specimen
                            accepted = false;
                        }
                    }
                    if(accepted)
                    {
                        dataset.push({values: values, specimen: selection[i]});
                    }
                }
            }
        }
        
        if(dataset.length == 0)
        {
            document.images["nofiltersel"].style = "display:block;";
            document.getElementById("sel_viz").style = "display:none;";
            document.getElementById("maps").style = "display:none;";
            return;
        }
        else
        {
            document.images["nofiltersel"].style = "display:none;";
            document.images["nosel"].style = "display:none;";
            document.getElementById("sel_viz").style = "display:block;";
        }
        
        // if the user has chosen to make a dynamic axis, a fisheye scale is created for x and y
        if(makeDynamicAxis)
        {
            xScale = d3.fisheye.scale(d3.scale.linear).domain(d3.extent(dataset, function(p) {return parseFloat(p.values[0]); })).range([circlePadding,w - circlePadding]);
            yScale = d3.fisheye.scale(d3.scale.linear).domain(d3.extent(dataset, function(p) {return parseFloat(p.values[1]); })).range([h - circlePadding,circlePadding]);
        }
        else
        {
            // creating regular scales for x, y
            xScale = d3.scale.linear()
            .domain(d3.extent(dataset, function(p) {return parseFloat(p.values[0]); }))
            .range([circlePadding,w - circlePadding]);
    
            yScale = d3.scale.linear()
                .domain(d3.extent(dataset, function(p) {return parseFloat(p.values[1]); }))
                .range([h - circlePadding,circlePadding]);    
        }
        // creating the scale for the circles
        rScale = d3.scale.linear()
                .domain(d3.extent(dataset, function(p) {return parseFloat(p.values[2]); }));
            rScale.range([2,10]);

         
        // creating a white background behind visualization to capture mouse movement
        svg_selected.append("rect")
          .attr("class", "background")
          .attr("x",circlePadding - 10)
          //.attr("y",circlePadding)
          .attr("width", w - circlePadding)
          .attr("height", h - circlePadding)
          .style("fill","white")
          ;
          
        // creating axis for x 
        xAxis = d3.svg.axis();	
		xAxis.orient("bottom")
            .innerTickSize(-h)
            .outerTickSize(0)
            .tickPadding(10);
            //.ticks(10);
		xAxis.scale(xScale);
        
        // creating axis for y
        yAxis = d3.svg.axis();
		yAxis.orient("left")
            .innerTickSize(-w)
            .outerTickSize(0)
            .tickPadding(10);
            //.ticks(10);
		yAxis.scale(yScale);

        // clipping path not do show beyound visualization ( not sure if working )
		svg_selected.append("clipPath")
			.attr("id","chart-area")
			.append("rect")
			.attr("x",borderBarPadding)
			.attr("y",borderBarPadding)
			.attr("width", w - borderBarPadding*3)
			.attr("height", h - borderBarPadding*2);
		
        // creating dots
		var dot = svg_selected.append("g")
			.attr("id","circles")
			//.attr("clip-path", "url(#chart-area)")
			.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
            .call(position)  // sets x, y and circle size of the dot
			.attr("fill", function(d){return d.specimen.color;})
            .style("opacity",0.3)
			.on("mouseover", function(d) 
			{
                // make hovering circle completely visible
                d3.select(this).style("opacity", 1);
                
                // showing tooltip with x, y and circle size values
				div.transition()        
				.duration(200)      
				.style("opacity", .9);      
				div .html("<b>"+dimensions[0]+": </b>"+d.values[0]+" <br/>"+
								"<b>"+dimensions[1]+": </b>"+d.values[1]+" <br/>"+
								"<b>"+dimensions[2]+": </b>"+d.values[2]+" <br/>")  
				.style("left", (d3.event.pageX + 10) + "px")     
				.style("top", (d3.event.pageY - 60) + "px");    
			})                  
			.on("mouseout", function(d) 
			{     
                // hiding tooltip when out of hover
                d3.select(this).style("opacity", 0.3);
				div.transition()        
				.duration(500)      
				.style("opacity", 0);   
			})
			.on("click", function(d)
			{
                // showing specimen info when clicked
				makeSpecimenPopup(d.specimen);
			})		
			;
        
        // drawing axis x line
		svg_selected.append("g")
			.attr("class","x axis")
			.attr("transform", "translate(0," + ( h - circlePadding ) + ")")
			.call(xAxis);
         
        // drawing axis y line
		svg_selected.append("g")
			.attr("class","y axis")
			.attr("transform", "translate(" + (circlePadding - 10) +",0)")
			.call(yAxis);
			
        // drawing axis x name
		svg_selected.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "end")
			.style("font-size",function(d){return "15px";})
			.attr("x", w - 20)
			.attr("y", h - circlePadding - 10)
			.text(dimensions[0]);
			
        // drawing axis y name
		svg_selected.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.style("font-size",function(d){return "15px";})
			.attr("y", (circlePadding ) )
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.text(dimensions[1]);
        
        if(makeDynamicAxis)
        {
            // if on dynamic axis make mouse move distort axis
            svg_selected.on("mousemove", function() 
            {
                var mouse = d3.mouse(this);
                xScale.distortion(2.5).focus(mouse[0]);
                yScale.distortion(2.5).focus(mouse[1]);

                dot.call(position);
                svg_selected.select(".x.axis").call(xAxis);
                svg_selected.select(".y.axis").call(yAxis);
            });
        }
        
        /*
         * Positions the dots based on data.
         */
        function position(dot) 
        {
          dot 
              .transition().duration(1)
              .attr("cx", function(d) { return xScale(d.values[0]); })
              .attr("cy", function(d) { return yScale((d.values[1])); })
              .attr("r", function(d) { return rScale(d.values[2]); });
        }   
	}

}