function matrixVisualization()
{
	
	
    var margin = {top: 30, right: 10, bottom: 10, left: 10};
    var h =  $("#matrix_viz").height(); //+ margin.top - margin.bottom ;
	var w = $("#matrix_viz").width() - 40;
    var dataset;
	var circlePadding = 40;
	var borderBarPadding = 7;
    
    // div for creating tooltip
	var div;

	
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
		//if(svg_matrix_viz)
			svg_matrix_viz.selectAll("*").remove();
		
		var characterLst = allCharactersList.getList();
		
		if(selection && characterLst)
		{
		
		
			var margin = {top: 100, right: 100, bottom: 100, left: 100},
				width = 700,
				height = 700;

				//svg_matrix_viz.style("margin-left", margin.left + "px");
				//svg_matrix_viz.style("margin-top", margin.top + "px");
				svg_matrix_viz
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom);
					
				var g = svg_matrix_viz	
					.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
			/*
			 svg_matrix_viz = d3.select("#matrix_viz").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.style("margin-left", margin.left + "px");*/
			  //.append("g")
				//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			svg_matrix_viz.selectAll("g").append("rect")
				.attr("class", "background")
				.attr("width", width)
				.attr("height", height);

			
			
			var dataset= [];
			var datasetColor=[];
			
			for (var i = 0; i < selection.length; i++)
            {
				if(selection[i].measures)
				{
					var list = [];
					var colorList=[];
					for(var charId_key in  characterLst) 
					{
						
						if(selection[i].measures[charId_key])
						{
							list.push(1);
							colorList.push(selection[i].color);
						}
						else
						{
							list.push(0);
							colorList.push("white");
						}
						
					}
					dataset.push(list);
					datasetColor.push(colorList);
				}
				
                
            }
			
			console.log(datasetColor);
			
			var numrows = dataset.length;
			var numcols = dataset[0].length;

			var matrix = new Array(numrows);
			for (var i = 0; i < numrows; i++) 
			{
				matrix[i] = new Array(numcols);
				for (var j = 0; j < numcols; j++) 
				{
					matrix[i][j] = Math.random()*2 - 1;
				}
			}
			
			var x = d3.scale.ordinal()
				.domain(d3.range(numcols))
				.rangeBands([0, width]);

			var y = d3.scale.ordinal()
				.domain(d3.range(numrows))
				.rangeBands([0, height]);

			var columnLabels = new Array(numrows);
			for (var i = 0; i < numcols; i++) 
			{
			  columnLabels[i] = "Column "+(i+1);
			}

			var colorMap = d3.scale.linear()
				.domain([-1, 0, 1])
				.range(["red", "white", "#9abcf4"]);    
				//.range(["red", "black", "green"]);
				//.range(["brown", "#ddd", "darkgreen"]);

			var row = svg_matrix_viz.selectAll("g").selectAll(".row")
				.data(dataset)
			  .enter().append("g")
				.attr("class", "row")
				.attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

			row.selectAll(".cell")
				.data(function(d) { return d; })
			  .enter().append("rect")
				.attr("class", "cell")
				.attr("x", function(d, i) { return x(i); })
				.attr("width", x.rangeBand())
				.attr("height", y.rangeBand())
				.style("stroke-width", 0);
				
			
			row.append("line")
				.attr("x2", width);
/*
			row.append("text")
				.attr("x", 0)
				.attr("y", y.rangeBand() / 2)
				.attr("dy", ".32em")
				.attr("text-anchor", "end")
				.text(function(d, i) { return "Row " + i; });

			var column = g.selectAll(".column")
				.data(columnLabels)
			  .enter().append("g")
				.attr("class", "column")
				.attr("transform", function(d, i) {  return "translate(" + x(i) + ")rotate(-90)"; });

			column.append("line")
				.attr("x1", -width);

			column.append("text")
				.attr("x", 6)
				.attr("y", y.rangeBand() / 2)
				.attr("dy", ".32em")
				.attr("text-anchor", "start")
				.text(function(d, i) { return d; });*/
			
			row.selectAll(".cell")
				.data(function(d, i) { return datasetColor[i]; })
				.style("fill", function(d){return d;});
				

		}
	}

}


