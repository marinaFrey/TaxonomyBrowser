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
		.attr("d",path);

	  // Add blue foreground lines for focus.
	foreground = svg_selected.append("g")
		.attr("class", "foreground")
		.selectAll("path")
		.data(dataset)
		.enter().append("path")
		.attr("d", path)
        .style("stroke", function(d) {return d.specimen.color;})
        .on("click", function(d)
        {
           makeSpecimenPopup(d.specimen); 
        })
        ;
        
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
			foreground.attr("d",path)
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
				.attr("d",path)
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
        var v = d.values;
		var line_obj = line(dimensions.map(function(p) {return [position(p), y[p](v[dimensions.indexOf(p)])] }));
        //console.log(line_obj);
		return line_obj;
		//return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
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
            var v = d.values;
			return actives.every(function(p, i) 
			{
				return extents[i][0] <= v[dimensions.indexOf(p)] && v[dimensions.indexOf(p)] <= extents[i][1];
			}) ? null : "none";
		});
	}

}
