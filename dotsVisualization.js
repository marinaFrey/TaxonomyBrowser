function dotsVisualization()
{
	var h = 700;
	var w = $("#sel_viz").width() - 40;
	var circlePadding = 40;
	var borderBarPadding = 7;
	var div;
	var xScale;
	var yScale;
	var rScale;
	var xAxis;
	var yAxis;
	
	this.create = function()
    {
		svg_selected.selectAll("*").remove();
        document.getElementById("maps").style = "display:none;";
        document.getElementById("sel_viz").style = "display:block;";
        
		//xScale = d3.scale.linear();		
		//yScale = d3.scale.linear();		
		//rScale = d3.scale.linear();
		
		div = d3.select("body").append("div")   
			.attr("class", "tooltip")               
			.style("opacity", 0);

    }
    
    this.update = function(dataset)
    {
		document.getElementById("maps").style = "display:none;";
        document.getElementById("sel_viz").style = "display:block;";
		svg_selected.selectAll("*").remove();
		//var xName = comboX.getSelectedOption();
		//var yName = comboY.getSelectedOption();
		//var sizeName = comboSize.getSelectedOption();
        var y = {};
        var dimensions = [comboX.getSelectedOption(),comboY.getSelectedOption(),comboSize.getSelectedOption()];
		
		if(filteredSelection[0] != "all")
        {
            dataset = [];
            for (var i = 0; i < filteredSelection.length; i++)
            {
                if(selection[filteredSelection[i]].measures)
                {
                    values = [];
                    for(var j = 0; j < selection[filteredSelection[i]].measures.length; j++)
                    {
                        var measureName = selection[filteredSelection[i]].measures[j].name
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
            dataset= [];
            for (var i = 0; i < selection.length; i++)
            {
                if(selection[i].measures)
                {
                    values = [];
                    for(var j = 0; j < selection[i].measures.length; j++)
                    {
                        var measureName = selection[i].measures[j].name
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
        if(makeDynamicAxis)
        {
            xScale = d3.fisheye.scale(d3.scale.linear).domain(d3.extent(dataset, function(p) {return parseFloat(p.values[0]); })).range([circlePadding,w - circlePadding]);
            yScale = d3.fisheye.scale(d3.scale.linear).domain(d3.extent(dataset, function(p) {return parseFloat(p.values[1]); })).range([h - circlePadding,circlePadding]);
            rScale = d3.scale.linear().domain(d3.extent(dataset, function(p) {return parseFloat(p.values[2]); })).range([2, 10]);
        }
        else
        {
            xScale = d3.scale.linear()
            .domain(d3.extent(dataset, function(p) {return parseFloat(p.values[0]); }))
            .range([circlePadding,w - circlePadding]);
    
            yScale = d3.scale.linear()
                .domain(d3.extent(dataset, function(p) {return parseFloat(p.values[1]); }))
                .range([h - circlePadding,circlePadding]);

            rScale = d3.scale.linear()
                .domain(d3.extent(dataset, function(p) {return parseFloat(p.values[2]); }));
            rScale.range([2,10]);
        }


        svg_selected.append("rect")
          .attr("class", "background")
          .attr("x",circlePadding - 10)
          //.attr("y",circlePadding)
          .attr("width", w - circlePadding)
          .attr("height", h - circlePadding)
          .style("fill","white")
          ;
          
        
        
        xAxis = d3.svg.axis();	
		xAxis.orient("bottom")
        .innerTickSize(-h)
        .outerTickSize(0)
        .tickPadding(10);
		//.ticks(10);
		xAxis.scale(xScale);

        yAxis = d3.svg.axis();
		yAxis.orient("left")
        .innerTickSize(-w)
        .outerTickSize(0)
        .tickPadding(10);
		//.ticks(10);
		yAxis.scale(yScale);


		svg_selected.append("clipPath")
			.attr("id","chart-area")
			.append("rect")
			.attr("x",borderBarPadding)
			.attr("y",borderBarPadding)
			.attr("width", w - borderBarPadding*3)
			.attr("height", h - borderBarPadding*2);
		
		var dot = svg_selected.append("g")
			.attr("id","circles")
			.attr("clip-path", "url(#chart-area)")
			.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.filter(function (d){return !d.children})
			.attr("cx", function(d)
			{
                return  xScale(d.values[0]);
			})
			.attr("cy", function(d)
			{
                return  yScale(d.values[1]);
			})
			.attr("r", function(d)
			{
                return  rScale(d.values[2]);
			})
			.attr("fill", function(d){return d.specimen.color;})
            .style("opacity",0.3)
			.on("mouseover", function(d) 
			{
                d3.select(this).style("opacity", 1);
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
                d3.select(this).style("opacity", 0.3);
				div.transition()        
				.duration(500)      
				.style("opacity", 0);   
			})
			.on("click", function(d)
			{
				makeSpecimenPopup(d.specimen);
			})
			
			;
			
			/*
		svg2.selectAll("text")
			.data(dataset2)
			.enter()
			.append("text")
			.text(function(d){return d[0] + "," + d[1];})
			.attr("x",function(d){return xScale(d[0]);})
			.attr("y",function(d){return yScale(d[1]);})
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "red");*/
		

       
        
		svg_selected.append("g")
			.attr("class","x axis")
			.attr("transform", "translate(0," + ( h - circlePadding ) + ")")
			.call(xAxis);
            
		svg_selected.append("g")
			.attr("class","y axis")
			.attr("transform", "translate(" + (circlePadding - 10) +",0)")
			.call(yAxis);
			
		svg_selected.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "end")
			.style("font-size",function(d){return "15px";})
			.attr("x", w - 20)
			.attr("y", h - circlePadding - 10)
			.text(dimensions[0]);
			
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
        // Positions the dots based on data.
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