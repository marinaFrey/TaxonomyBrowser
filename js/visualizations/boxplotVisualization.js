function boxPlotVisualization()
{
	
	
    var margin = {top: 30, right: 10, bottom: 20, left: 10};
    //var h =  $("#sel_viz").height(); //+ margin.top - margin.bottom ;
	//var w = $("#sel_viz").width() - 40;
	var h =  600;//$("#sel_viz").height()- margin.top - margin.bottom ;
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
		//svg_selected.selectAll("*").remove();
		svg_selected.selectAll("*").remove();
		svg_selected
            .attr("transform", "translate(0,5)");

		var selectedMeasureName = comboY.getSelectedOption();
		var groupCounts = {};
		var globalCounts = [];
		var speciesInfo = [];
		var key = 0;
		var characterLst = allCharactersList.getList();
		
		// if there is filter applied, filteredSelection vector is used as index to access selected specimens in dataset
		if(filteredSelection[0] != "all")
        {
            // for showing a circle all 3 variables selected must exist
            // so it's made a check to confirm if the specimen has a value to all 3 before showing
            for (var i = 0; i < filteredSelection.length; i++)
            {
                if(selection[filteredSelection[i]].measures)
                {	

                    //for(var j = 0; j < selection[filteredSelection[i]].measures.length; j++)
					for(var charId_key in  selection[filteredSelection[i]].measures) 
                    {
						var measureName = characterLst[charId_key].character_name;
						
						if(measureName == selectedMeasureName)
						{
							if(!groupCounts[selection[filteredSelection[i]].parent.taxonomy_id])
							{
								groupCounts[selection[filteredSelection[i]].parent.taxonomy_id] = [];
								speciesInfo[selection[filteredSelection[i]].parent.taxonomy_id] = {name: selection[filteredSelection[i]].parent.name, color: selection[filteredSelection[i]].parent.color};
							}
							
							var entry = parseFloat(selection[filteredSelection[i]].measures[charId_key]);
							groupCounts[selection[filteredSelection[i]].parent.taxonomy_id].push(entry);
							globalCounts.push(entry);
						}  

                    }
                }
            }
        }
        else
        {
            // if there is no filter applied, all selection is used 
            // for showing a circle all 3 variables selected must exist
            // so it's made a check to confirm if the specimen has a value to all 3 before showing
            for (var i = 0; i < selection.length; i++)
            {
                if(selection[i].measures)
                {
					

                    //for(var j = 0; j < selection[i].measures.length; j++)
                    for(var charId_key in  selection[i].measures) 
                    {
						var measureName = characterLst[charId_key].character_name;
						
						if(measureName == selectedMeasureName)
						{
							if(!groupCounts[selection[i].parent.taxonomy_id])
							{
								groupCounts[selection[i].parent.taxonomy_id] = [];
								speciesInfo[selection[i].parent.taxonomy_id] = {name: selection[i].parent.name, color: selection[i].parent.color};
							}
							
							var entry = parseFloat(selection[i].measures[charId_key]);
							groupCounts[selection[i].parent.taxonomy_id].push(entry);
							globalCounts.push(entry);
						}
                        
                    }
                }
            }
        }

	  var barWidth = 30;

	  var margin = {top: 20, right: 10, bottom: 20, left: 10};

	  var width = w - margin.left - margin.right,
		  height = h - margin.top - margin.bottom;

	  var totalWidth = width + margin.left + margin.right;
	  var totalheight = height + margin.top + margin.bottom;

	  // Sort group counts so quantile methods work
	  for(var key in groupCounts) 
	  {
		var groupCount = groupCounts[key];
		groupCounts[key] = groupCount.sort(sortNumber);
	  }

	  // Prepare the data for the box plots
	  var boxPlotData = [];
	  for (var [key, groupCount] of Object.entries(groupCounts)) 
	  {

			var record = {};
			var localMin = d3.min(groupCount);
			var localMax = d3.max(groupCount);

			var count = 0;
			for(var i = 0; i < groupCount.length; ++i)
			{
				if(groupCount[i] == 0)
					count++;
			}
			
			record["key"] = key;
			record["counts"] = groupCount;
			record["counts_non_zeroed"] = groupCount.filter(function(val)
			{
				return val != 0;
			});
			record["quartile"] = boxQuartiles(groupCount);
			record["whiskers"] = [localMin, localMax];
			record["color"] = speciesInfo[key].color;
			record["zeros"] = count;
			record["nulls"] = counting.getNumberSelectedFromSpecies(speciesInfo[key].name) - groupCount.length;
			if(localMin != localMax)
				boxPlotData.push(record);
	  }
	
		
	  // Compute an ordinal xScale for the keys in boxPlotData
	  var xScale = d3.scale.ordinal()
		.domain(Object.keys(groupCounts))
		.rangeRoundBands([0, w]);
		//.padding([0.5]);

	  // Compute a global y scale based on the global counts
	  var min = d3.min(globalCounts);
	  var max = d3.max(globalCounts);
	  var yScale = d3.scale.linear()
		.domain([min, max])
		.range([h, 0]);
		
	  // Setup the svg and group we will draw the box plot in
	  /*svg_selected= d3.select("body").append("svg")
		.attr("width", totalWidth)
		.attr("height", totalheight)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/
		
		//svg_selected.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	  // Move the left axis over 25 pixels, and the top axis over 35 pixels
	  //var axisG = svg_selected.append("g").attr("transform", "translate(25,0)");
	 // var axisTopG = svg_selected.append("g").attr("transform", "translate(35,0)");
	  
	
	// creating axis for y
	var yAxis = d3.svg.axis();
	yAxis.orient("left")
		.innerTickSize(-w);
		//.outerTickSize(0);
		//.tickPadding(-10);
		//.ticks(10);
	yAxis.scale(yScale);

	  // Setup the group the box plot elements will render in
	  var g = svg_selected.append("g")
		.attr("transform", "translate(100,5)");
		

	  // Draw the box plot vertical lines
	  var verticalLines = g.selectAll(".verticalLines")
		.data(boxPlotData)
		.enter()
		.append("line")
		.attr("x1", function(datum) 
		{
			return xScale(datum.key) + barWidth/2;	
		})
		.attr("y1", function(datum) 
		{
			var whisker = datum.whiskers[0];
			return yScale(whisker);
		})
		.attr("x2", function(datum) 
		{
			return xScale(datum.key) + barWidth/2;
		})
		.attr("y2", function(datum) 
		{
			var whisker = datum.whiskers[1];
			return yScale(whisker);
		 })
		.attr("stroke", "#000")
		.attr("stroke-width", 1)
		.attr("fill", "none");

		
	  // Draw the boxes of the box plot, filled in white and on top of vertical lines
	  var rects = g.selectAll("rect")
		.data(boxPlotData)
		.enter()
		.append("rect")
		.attr("width", barWidth)
		.attr("height", function(datum) 
		{
			var quartiles = datum.quartile;
			//var rect_height = yScale(quartiles[2]) - yScale(quartiles[0]);
			var rect_height = yScale(quartiles[0]) - yScale(quartiles[2]);
			return rect_height;
		})
		.attr("x", function(datum) 
		{
			return xScale(datum.key);
		 })
		.attr("y", function(datum) 
		{
			return yScale(datum.quartile[2]) ;
		})
		.attr("fill", function(datum) 
		{
		  return datum.color;
		})
		.attr("stroke", "black")
		.attr("stroke-width", 1)
		.on("mouseover", function(d) 
			{
                // make hovering circle completely visible
                d3.select(this).style("opacity", 1);
                // showing tooltip with x, y and circle size values
				div.transition()        
				.duration(200)      
				.style("opacity", .9);      
				div .html("<b>"+speciesInfo[d.key].name+" </b><br/>"+
							"quartiles: "+ d.quartile[0] +", "+ d.quartile[1] +", "+ d.quartile[2] + "<br/>"+
							"standard deviation: "+ calculateStandardDeviation(d.counts) + "<br/>" +
							"<svg width= '200' height='200' id='pieChartDiv'></svg> <br/>"+
							"<svg  x='0' y='200' width= '150' height='50'><rect width='10' height='10' style='fill:rgb(100, 100, 100)' /> <text x='15' y='10' fill='black'>zero</text> "+
							"<rect y='18' width='10' height='10' style='fill:rgb(212, 212, 212)' /> <text x='15' y='28' fill='black'>null</text>"+
							"<rect y='36' width='10' height='10' style='fill:"+d.color+"' /> <text x='15' y='45' fill='black'>["+d3.min(d.counts_non_zeroed)+","+d.whiskers[1]+"]</text> </svg>")  
				.style("left", (d3.event.pageX + 10) + "px")     
				.style("top", (d3.event.pageY - 60) + "px");    
				
				createPieChartVisualization(d);
			})                  
		.on("mouseout", function(d) 
		{     
			div .html("");
			// hiding tooltip when out of hover
			div.style("opacity", 0.3);
			div.transition()        
			.duration(500)      
			.style("opacity", 0);   
		});

	
		
	  // Now render all the horizontal lines at once - the whiskers and the median
	  var horizontalLineConfigs = 
	  [
		// Top whisker
		{
		  x1: function(datum) { return xScale(datum.key) },
		  y1: function(datum) { return yScale(datum.whiskers[0]) },
		  x2: function(datum) { return xScale(datum.key) + barWidth },
		  y2: function(datum) { return yScale(datum.whiskers[0]) }
		},
		// Median line
		{
		  x1: function(datum) { return xScale(datum.key) },
		  y1: function(datum) { return yScale(datum.quartile[1]) },
		  x2: function(datum) { return xScale(datum.key) + barWidth },
		  y2: function(datum) { return yScale(datum.quartile[1]) }
		},
		// Bottom whisker
		{
		  x1: function(datum) { return xScale(datum.key) },
		  y1: function(datum) { return yScale(datum.whiskers[1]) },
		  x2: function(datum) { return xScale(datum.key) + barWidth },
		  y2: function(datum) { return yScale(datum.whiskers[1]) }
		}
	  ];

	  for(var i=0; i < horizontalLineConfigs.length; i++) 
	  {
		var lineConfig = horizontalLineConfigs[i];

		// Draw the whiskers at the min for this series
		var horizontalLine = g.selectAll(".whiskers")
		  .data(boxPlotData)
		  .enter()
		  .append("line")
		  .attr("x1", lineConfig.x1)
		  .attr("y1", lineConfig.y1)
		  .attr("x2", lineConfig.x2)
		  .attr("y2", lineConfig.y2)
		  .attr("stroke", "#000")
		  .attr("stroke-width", 1)
		  .attr("fill", "none");
	  }
	  
	  // drawing axis y line
		svg_selected.append("g")
			.attr("class","y axis")
			.attr("transform", "translate(" + 50 +",0)")
			.call(yAxis);
			
		// drawing axis y name
		svg_selected.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.style("font-size",function(d){return "18px";})
			.attr("y", 55 )
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.text(selectedMeasureName);


		function boxQuartiles(d) 
		{
		return [
			d3.quantile(d, .25),
			d3.quantile(d, .5),
			d3.quantile(d, .75)
		];
		}
		
	  // Perform a numeric sort on an array
	  function sortNumber(a,b) 
	  {
		return a - b;
	  }

		
	}
}

function createPieChartVisualization(data_source)
{
	var h = 200;
	var w = 200;
	

	//var pieChartSVG = d3.select("#pieChartDiv").append("svg")
	var pieChartSVG = d3.select("#pieChartDiv");
	
	pieChartSVG.selectAll("*").remove();
	
	var r = h/2;
	var aColor = [
		data_source.color,
		'rgb(100, 100, 100)',
		'rgb(212, 212, 212)'
	];
	
	var others = data_source.counts.length - data_source.zeros ;
	
	var data = [
		{"label": "other", "value":others },
		{"label":"zero", "value":data_source.zeros}, 
		{"label":"null", "value": data_source.nulls}
	];
	console.log(pieChartSVG);

	var vis = pieChartSVG
		.data([data])
		.append("svg:g")
		.attr("transform", "translate(" + r + "," + r + ")");

	var pie = d3.layout.pie().value(function(d){return d.value;});

	// Declare an arc generator function
	var arc = d3.svg.arc().outerRadius(r);

	// Select paths, use arc generator to draw
	var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
	arcs.append("svg:path")
		.attr("fill", function(d, i){return aColor[i];})
		.attr("d", function (d) {return arc(d);})
	;

	// Add the text
	arcs.append("svg:text")
		.attr("transform", function(d)
		{
			d.innerRadius = 60; /* Distance of label to the center*/
			d.outerRadius = r;
			return "translate(" + arc.centroid(d) + ")";
			})
		.attr("text-anchor", "middle")
		.text( function(d, i) 
		{
			if(data[i].value > 0)
				return data[i].value;
		})
	;
}

 function calculateStandardDeviation(list)
{
	var stdDeviation = 0;
	var sum = 0;
	var average = 0;
	
	for( var i = 0; i < list.length; i++)
	{
		sum += list[i];
	}
	
	average = sum/list.length;
	
	for( var i = 0; i < list.length; i++)
	{
		stdDeviation += Math.pow(list[i] - average,2);
	}
	
	if(list.length > 1)
	{
		var result = Math.sqrt((1/list.length) * stdDeviation);
		return parseFloat(result).toFixed(2);;
	}
	else
	{
		return "insufficient data";
	}
}

