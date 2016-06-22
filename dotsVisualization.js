function dotsVisualization()
{
	var h = 700;
	var w = $("#sel_viz").width();
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
	
	var circlePadding = 40;
	var borderBarPadding = 7;

	this.create = function()
    {
		svg_selected.selectAll("*").remove();
        document.getElementById("maps").style = "display:none;";
        document.getElementById("sel_viz").style = "display:block;";
        
		 var xScale = d3.scale.linear();
		xScale.domain([0,d3.max(dataset2, function(d){return d[0];})]);
		xScale.range([circlePadding,w - circlePadding]);
		
		var yScale = d3.scale.linear();
		yScale.domain([0,d3.max(dataset2, function(d){return d[1];})]);
		yScale.range([h - circlePadding,circlePadding]);
		
		var rScale = d3.scale.linear();
		rScale.domain([0,d3.max(dataset2, function(d){return d[1];})]);
		rScale.range([2,5]);
		
		var xAxis = d3.svg.axis();
		xAxis.scale(xScale);
		xAxis.orient("bottom")
		.ticks(5);
		
		var yAxis = d3.svg.axis();
		yAxis.scale(yScale);
		yAxis.orient("left")
		.ticks(5);
		
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
			.data(dataset2)
			.enter()
			.append("circle")
			.attr("cx", function(d){return xScale(d[0]);})
			.attr("cy", function(d){return yScale(d[1]);})
			.attr("r", function(d){return rScale(d[1]);})
			.attr("fill", function(d){return "rgb("+ ( d[1]*2 ) +"," + (100 ) + ","+ (d[0]*2) + ")";});;
			
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
			
		 
        console.log("dots created");
    }
    
    this.update = function(dataset)
    {
	}

}