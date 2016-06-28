function dotsVisualization()
{
	var h = 700;
	var w = $("#sel_viz").width();
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
        
		xScale = d3.scale.linear();		
		
		
		yScale = d3.scale.linear();		
		
		
		rScale = d3.scale.linear();
		
		div = d3.select("body").append("div")   
			.attr("class", "tooltip")               
			.style("opacity", 0);
		
		xAxis = d3.svg.axis();	
		xAxis.orient("bottom")
		.ticks(10);
		
		yAxis = d3.svg.axis();
		yAxis.orient("left")
		.ticks(10);
	
    }
    
    this.update = function(dataset)
    {
		document.getElementById("maps").style = "display:none;";
        document.getElementById("sel_viz").style = "display:block;";
		svg_selected.selectAll("*").remove();
		
		var xName = comboX.getSelectedOption();
		var yName = comboY.getSelectedOption();
		var sizeName = comboSize.getSelectedOption();
		

		xScale.domain(d3.extent(dataset, function(d)
		{   
            if(!d.children)
            {
                if(d.measures)
                {
                    for(var j = 0; j < d.measures.length; j++)
                    {
                            if(d.measures[j].name == xName)
                            {
                                //console.log( "X " + parseFloat(d.measures[j].value));
                                return parseFloat(d.measures[j].value);
                            }
                    }
                }
                
            }
	
		}));
		xScale.range([circlePadding,w - circlePadding]);
        
		yScale.domain(d3.extent(dataset, function(d)
		{
				if(!d.children)
				{
					if(d.measures)
					{
						for(var j = 0; j < d.measures.length; j++)
						{
								if(d.measures[j].name == yName)
								{
									//console.log( "Y " + parseFloat(d.measures[j].value));
									return parseFloat(d.measures[j].value);
								}
						}
					}
					
				}
			
		}));
        yScale.range([h - circlePadding,circlePadding]);

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
		rScale.range([2,10]);
        
		xAxis.scale(xScale);
		yAxis.scale(yScale);
	
		
		svg_selected.append("clipPath")
			.attr("id","chart-area")
			.append("rect")
			.attr("x",borderBarPadding)
			.attr("y",borderBarPadding)
			.attr("width", w - borderBarPadding*3)
			.attr("height", h - borderBarPadding*2);
		
		svg_selected.append("g")
			.attr("id","circles")
			.attr("clip-path", "url(#chart-area)")
			.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.filter(function (d){return !d.children})
			.attr("cx", function(d)
			{
                if(d.measures)
                {
                    for(var j = 0; j < d.measures.length; j++)
                    {
                            if(d.measures[j].name == xName)
                            {
                                d.xValue = parseFloat(d.measures[j].value);
                                return xScale(parseFloat(d.measures[j].value));
                            }
							else
								d.xValue = null;
                    }
                }
				
			})
			.attr("cy", function(d)
			{
                if(d.measures)
                {
                    for(var j = 0; j < d.measures.length; j++)
                    {
                            if(d.measures[j].name == yName)
                            {
                                d.yValue = parseFloat(d.measures[j].value);
								return yScale(parseFloat(d.measures[j].value));
                            }
							else
								d.yValue = null;
                    }
                }
				
			})
			.attr("r", function(d)
			{
				if(d.measures)
                {
                    for(var j = 0; j < d.measures.length; j++)
                    {
                            if(d.measures[j].name == sizeName)
                            {
								d.rValue = parseFloat(d.measures[j].value);
                                return rScale(parseFloat(d.measures[j].value));
                            }
							else
								d.rValue = null;
                    }
                }
			})
			.attr("fill", function(d){return d.color;})
			.style("opacity", function(d) 
			{
				if((d.rValue && (d.yValue && d.xValue)))
				{
					return 1;
				}
				
				return 0;
			})
			.on("mouseover", function(d) 
			{      
				div.transition()        
				.duration(200)      
				.style("opacity", .9);      
				div .html("<b>"+xName+": </b>"+d.xValue+" <br/>"+
								"<b>"+yName+": </b>"+d.yValue+" <br/>"+
								"<b>"+sizeName+": </b>"+d.rValue+" <br/>")  
				.style("left", (d3.event.pageX + 10) + "px")     
				.style("top", (d3.event.pageY - 60) + "px");    
			})                  
			.on("mouseout", function(d) 
			{       
				div.transition()        
				.duration(500)      
				.style("opacity", 0);   
			})
			.on("click", function(d)
			{
				makeSpecimenPopup(d);
			});
			
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
			.attr("x", w - 20)
			.attr("y", h - circlePadding - 10)
			.text(xName);
			
		svg_selected.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr("y", (circlePadding ) )
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.text(yName);
	}

}