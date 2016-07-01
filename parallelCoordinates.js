function ParallelCoordinates()
{
	var margin = {top: 30, right: 10, bottom: 10, left: 10},
		width = $("#sel_viz").width()  - margin.left - margin.right,
		height = 730 - margin.top - margin.bottom;

	var x = d3.scale.ordinal().rangePoints([0, width], 1),
		y = {},
		dragging = {};

	var line = d3.svg.line(),
		axis = d3.svg.axis().orient("left"),
		background,
		foreground;

	svg_selected.selectAll("*").remove();
    document.getElementById("maps").style = "display:none;";
    document.getElementById("sel_viz").style = "display:block;";
	
	svg_selected
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
	var dimensions = multipleCombos.getSelectedOptions();
	var values = [];
    var dataset = [];
	
    if(filteredSelection[0] != "all")
    {
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
	
	x.domain(dimensions);
	
	for (var i = 0; i < dimensions.length; i++)
	{
		y[dimensions[i]] = d3.scale.linear()
			.domain(d3.extent(dataset, function(p) { return parseFloat(p.values[i]); }))
			.range([height, 0]);
        /*
		y[dimensions[i]].brush = d3.svg.brush()
			.y(y[i])
			.on("brush", brush);*/
	}
	  // Add grey background lines for context.
	background = svg_selected.append("g")
		.attr("class", "background")
		.selectAll("path")
		.data(dataset)
		.enter().append("path")
		.attr("d", function(d)
		{
			path(d.values);
		});

	  // Add blue foreground lines for focus.
	foreground = svg_selected.append("g")
		.attr("class", "foreground")
		.selectAll("path")
		.data(dataset)
		.enter().append("path")
		.attr("d", function(d)
		{
			path(d.values);
		});

	  // Add a group element for each dimension.
	var g = svg_selected.selectAll(".dimension")
		.data(dimensions)
		.enter().append("g")
		.attr("class", "dimension")
		.attr("transform", function(d) { return "translate(" + x(d) + ")"; })
		.call(d3.behavior.drag()
		.origin(function(d) { return {x: x(d)}; })
		.on("dragstart", function(d) 
		{
			dragging[d] = x(d);
			background.attr("visibility", "hidden");
		})
		.on("drag", function(d) 
		{
			dragging[d] = Math.min(width, Math.max(0, d3.event.x));
			foreground.attr("d", function(d)
			{
				path(d.values);
			})
			dimensions.sort(function(a, b) { return position(a) - position(b); });
			x.domain(dimensions);
			g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
		})
		.on("dragend", function(d) 
		{
			delete dragging[d];
			transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
			transition(foreground).attr("d", path);
			background
				.attr("d", function(d)
				{
					path(d.values);
				})
				.transition()
				.delay(500)
				.duration(0)
				.attr("visibility", null);
		}));

	  // Add an axis and title.
	g.append("g")
		.attr("class", "axis")
		.each(function(d) { d3.select(this).call(axis.scale(y[d])); })
		.append("text")
		.style("text-anchor", "middle")
		.attr("y", -9)
		.text(function(d) { return d; });

	  // Add and store a brush for each axis.
	g.append("g")
		.attr("class", "brush")
		.each(function(d) 
		{
			d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
		})
		.selectAll("rect")
		.attr("x", -8)
		.attr("width", 16);

     /*
	d3.csv("iris.csv", function(error, cars) 
	{

		  // Extract the list of dimensions and create a scale for each.
		  x.domain(dimensions = d3.keys(cars[0]).filter(function(d) 
		  {
			return d != "name" && (y[d] = d3.scale.linear()
				.domain(d3.extent(cars, function(p) { return +p[d]; }))
				.range([height, 0]));
		  }));
		
		  // Add grey background lines for context.
		background = svg_selected.append("g")
			.attr("class", "background")
			.selectAll("path")
			.data(cars)
			.enter().append("path")
			.attr("d", path);

		  // Add blue foreground lines for focus.
		foreground = svg_selected.append("g")
			.attr("class", "foreground")
			.selectAll("path")
			.data(cars)
			.enter().append("path")
			.attr("d", path);

		  // Add a group element for each dimension.
		var g = svg_selected.selectAll(".dimension")
			.data(dimensions)
			.enter().append("g")
			.attr("class", "dimension")
			.attr("transform", function(d) { return "translate(" + x(d) + ")"; })
			.call(d3.behavior.drag()
			.origin(function(d) { return {x: x(d)}; })
			.on("dragstart", function(d) 
			{
				dragging[d] = x(d);
				background.attr("visibility", "hidden");
			})
			.on("drag", function(d) 
			{
				dragging[d] = Math.min(width, Math.max(0, d3.event.x));
				foreground.attr("d", path);
				dimensions.sort(function(a, b) { return position(a) - position(b); });
				x.domain(dimensions);
				g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
			})
			.on("dragend", function(d) 
			{
				delete dragging[d];
				transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
				transition(foreground).attr("d", path);
				background
					.attr("d", path)
					.transition()
					.delay(500)
					.duration(0)
					.attr("visibility", null);
			}));

		  // Add an axis and title.
		g.append("g")
			.attr("class", "axis")
			.each(function(d) { d3.select(this).call(axis.scale(y[d])); })
			.append("text")
			.style("text-anchor", "middle")
			.attr("y", -9)
			.text(function(d) { return d; });

		  // Add and store a brush for each axis.
		g.append("g")
			.attr("class", "brush")
			.each(function(d) 
			{
				d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
			})
			.selectAll("rect")
			.attr("x", -8)
			.attr("width", 16);
	});*/

	function position(d) 
	{
		var v = dragging[d];
		return v == null ? x(d) : v;
	}

	function transition(g) 
	{
		return g.transition().duration(500);
	}

	// Returns the path for a given data point.
	function path(d) 
	{
		
		//return line(dimensions.map(function(p) {return [position(p), y[p](d[dimensions.indexOf(p)])]; }));
		return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
	}

	function brushstart() 
	{
		d3.event.sourceEvent.stopPropagation();
	}

	// Handles a brush event, toggling the display of foreground lines.
	function brush() 
	{
		var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
		extents = actives.map(function(p) { return y[p].brush.extent(); });
		foreground.style("display", function(d) 
		{
			return actives.every(function(p, i) 
			{
				return extents[i][0] <= d[p] && d[p] <= extents[i][1];
			}) ? null : "none";
		});
	}

}

/*
function ParallelCoordinates()
{
	var species = ["setosa", "versicolor", "virginica"],
		traits = ["sepal length", "petal length", "sepal width", "petal width"];

	var m = [80, 160, 200, 160],
		w = $("#sel_viz").width() - m[1] - m[3],
		h = 700 - m[0] - m[2];

	var x = d3.scale.ordinal().domain(traits).rangePoints([0, w]),
		y = {};

	var line = d3.svg.line(),
		axis = d3.svg.axis().orient("left"),
		foreground;
		
	svg_selected.selectAll("*").remove();

	svg_selected.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	d3.csv("iris.csv", function(flowers) 
	{

	  // Create a scale and brush for each trait.
	  traits.forEach(function(d) 
	  {
		// Coerce values to numbers.
		flowers.forEach(function(p) { p[d] = +p[d]; });

		y[d] = d3.scale.linear()
			.domain(d3.extent(flowers, function(p) { return p[d]; }))
			.range([h, 0]);

		y[d].brush = d3.svg.brush()
			.y(y[d])
			.on("brush", brush);
	 });

	 
	  // Add a legend.
	  var legend = svg_selected.selectAll("g.legend")
		  .data(species)
		.enter().append("svg:g")
		  .attr("class", "legend")
		  .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 584) + ")"; });

	  legend.append("svg:line")
		  .attr("class", String)
		  .attr("x2", 8);

	  legend.append("svg:text")
		  .attr("x", 12)
		  .attr("dy", ".31em")
		  .text(function(d) { return "Iris " + d; });

	  // Add foreground lines.
	  foreground = svg_selected.append("svg:g")
		  .attr("class", "foreground")
		.selectAll("path")
		  .data(flowers)
		.enter().append("svg:path")
		  .attr("d", path)
		  .attr("class", function(d) { return d.species; });

	  // Add a group element for each trait.
	  var g = svg_selected.selectAll(".trait")
		  .data(traits)
		.enter().append("svg:g")
		  .attr("class", "trait")
		  .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
		  .call(d3.behavior.drag()
		  .origin(function(d) { return {x: x(d)}; })
		  .on("dragstart", dragstart)
		  .on("drag", drag)
		  .on("dragend", dragend));

	  // Add an axis and title.
	  g.append("svg:g")
		  .attr("class", "axis")
		  .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
		.append("svg:text")
		  .attr("text-anchor", "middle")
		  .attr("y", -9)
		  .text(String);

	  // Add a brush for each axis.
	  g.append("svg:g")
		  .attr("class", "brush")
		  .each(function(d) { d3.select(this).call(y[d].brush); })
		.selectAll("rect")
		  .attr("x", -8)
		  .attr("width", 16);

	  function dragstart(d) 
	  {
		i = traits.indexOf(d);
	  }

	  function drag(d) 
	  {
		x.range()[i] = d3.event.x;
		traits.sort(function(a, b) { return x(a) - x(b); });
		g.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
		foreground.attr("d", path);
	  }

	  function dragend(d) 
	  {
		x.domain(traits).rangePoints([0, w]);
		var t = d3.transition().duration(500);
		t.selectAll(".trait").attr("transform", function(d) { return "translate(" + x(d) + ")"; });
		t.selectAll(".foreground path").attr("d", path);
	  }
	  
	});

	// Returns the path for a given data point.
	function path(d) 
	{
	  return line(traits.map(function(p) { return [x(p), y[p](d[p])]; }));
	}

	// Handles a brush event, toggling the display of foreground lines.
	function brush() 
	{
	  var actives = traits.filter(function(p) { return !y[p].brush.empty(); }),
		  extents = actives.map(function(p) { return y[p].brush.extent(); });
	  foreground.classed("fade", function(d) 
	  {
		return !actives.every(function(p, i) 
		{
		  return extents[i][0] <= d[p] && d[p] <= extents[i][1];
		});
	  });
	}
}*/