function dotsVisualization()
{
	var h = 700;
	var w = $("#sel_viz").width();
	var circlePadding = 40;
	var borderBarPadding = 7;
	
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
                                //console.log("Y " + yScale(parseFloat(d.measures[j].value))+ " range "+ yScale.range() + " real "+ d.measures[j].value + " dominio " + yScale.domain());
                                d.yValue = parseFloat(d.measures[j].value);
								return yScale(parseFloat(d.measures[j].value));
                            }
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
                    }
                }
			})
			.attr("fill", function(d){return d.color;})
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
			.attr("transform", "translate(0," + ( h - circlePadding) + ")")
			.call(xAxis);
			
		svg_selected.append("g")
			.attr("class","y axis")
			.attr("transform", "translate(" + (circlePadding - 10) +",0)")
			.call(yAxis);
	}

}