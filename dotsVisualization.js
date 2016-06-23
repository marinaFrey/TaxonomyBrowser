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
	
	 //Dynamic, random dataset
	 // TEMPORARY UNTIL DATA AVAILABLE
	var dataset2 = [];
	var numDataPoints = 20;
	var xRange = Math.random() * 1000;
	var yRange = Math.random() * 1000;
	for (var i = 0; i < numDataPoints; i++) {
		var newNumber1 = Math.round(Math.random() * xRange);
		var newNumber2 = Math.round(Math.random() * yRange);
		dataset2.push([newNumber1, newNumber2]);
	}
	

	this.create = function()
    {
		svg_selected.selectAll("*").remove();
        document.getElementById("maps").style = "display:none;";
        document.getElementById("sel_viz").style = "display:block;";
        
		xScale = d3.scale.linear();		
		xScale.range([circlePadding,w - circlePadding]);
		
		yScale = d3.scale.linear();		
		yScale.range([h - circlePadding,circlePadding]);
		
		rScale = d3.scale.linear();
		rScale.range([2,5]);
		
		xAxis = d3.svg.axis();	
		xAxis.orient("bottom")
		.ticks(5);
		
		yAxis = d3.svg.axis();
		yAxis.orient("left")
		.ticks(5);
	
    }
    
    this.update = function(dataset)
    {
		document.getElementById("maps").style = "display:none;";
        document.getElementById("sel_viz").style = "display:block;";
		svg_selected.selectAll("*").remove();
		
		var xName = comboX.getSelectedOption();
		var yName = comboY.getSelectedOption();
		var sizeName = comboSize.getSelectedOption();
		var measureIDx;
		var measureIDy;
		var measureIDsize;
		
		xScale.domain([0,d3.max(dataset, function(d)
		{
			if(d.rank = "7" && d.children)
			{
				if(d.children)
				{
					if(d.children[0].measures)
					{
						for(var j = 0; j < d.children[0].measures.length; j++)
						{
								if(d.children[0].measures[j].name == xName)
								{
									measureIDx = j;	
									return parseFloat(d.children[0].measures[j].value);
								}
						}
					}
					
				}

			}
		})]);
		
		
		yScale.domain([0,d3.max(dataset, function(d)
		{
			if(d.rank = "7" && d.children)
			{
				if(d.children)
				{
					if(d.children[0].measures)
					{
						for(var j = 0; j < d.children[0].measures.length; j++)
						{
								if(d.children[0].measures[j].name == yName)
								{
									measureIDy = j;	
									return parseFloat(d.children[0].measures[j].value);
								}
						}
					}
					
				}

			}
		})]);
		rScale.domain([0,d3.max(dataset, function(d)
		{
			if(d.rank = "7" && d.children)
			{
				if(d.children)
				{
					if(d.children[0].measures)
					{
						for(var j = 0; j < d.children[0].measures.length; j++)
						{
								if(d.children[0].measures[j].name == sizeName)
								{
									measureIDsize = j;	
									return parseFloat(d.children[0].measures[j].value);
								}
						}
					}
					
				}

			}
		})]);
		
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
				return xScale(parseFloat(d.measures[measureIDx].value));
			})
			.attr("cy", function(d)
			{
				return yScale(parseFloat(d.measures[measureIDy].value));
			})
			.attr("r", function(d)
			{
				return rScale(parseFloat(d.measures[measureIDsize].value));
			})
			.attr("fill", function(d){return d.color;});
			
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