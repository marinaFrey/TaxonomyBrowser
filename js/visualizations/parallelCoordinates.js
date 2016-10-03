/*
 * Class for the parallel coordinates visualization
 * dynamically creates axis 
 */
function ParallelCoordinates()
{   
	var margin = {top: 30, right: 10, bottom: 10, left: 10},
		width = $("#sel_viz").width()  - margin.left - margin.right,
		height = $("#sel_viz").height() /*- margin.top - margin.bottom*/;
    //var height =  $("#sel_viz").height() ;
	//var width = $("#sel_viz").width() - 40;

	var x,
		y,
		dragging = {},
        ptr = this;

	var line,
		axis,
        dimensions,
		background,
		foreground;

    /*
     * initializes what is needed for the visualization
     */
    this.create = function()
    {
        x = d3.scale.ordinal().rangePoints([0, width], 1);
        line = d3.svg.line();
        axis = d3.svg.axis().orient("left");
    }
    
    /*
     * creates and updates the visualization
     */
    this.update = function()
    {
        svg_selected.selectAll("*").remove();
        svg_selected
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        dimensions = multipleCombos.getSelectedOptions();
        var values = [];
        var dataset = [];
        y = {};
        
        if(filteredSelection[0] != "all")
        {
            // if there is filter applied, filteredSelection vector is used as index to access selected specimens in dataset
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
            // if there is no filter applied, all selection is used 
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
        
        // setting the x domain as the number of variables used
        x.domain(dimensions);
        
        // setting a y scale for each variable
        for (var i = 0; i < dimensions.length; i++)
        {
            y[dimensions[i]] = d3.scale.linear()
                .domain(d3.extent(dataset, function(p) { return parseFloat(p.values[i]); }))
                .range([height, 0]);
        }
        
        // Add grey background lines for context.
        background = svg_selected.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(dataset)
            .enter().append("path")
            .attr("d",ptr.path);

        // Add colored foreground lines for focus.
        foreground = svg_selected.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(dataset)
            .enter().append("path")
            .attr("d", ptr.path)
            .style("opacity", function(d) {return .4;})
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
                    foreground.attr("d",ptr.path)
                    dimensions.sort(function(a, b) { return ptr.position(a) - ptr.position(b); });
                    x.domain(dimensions);
                    g.attr("transform", function(d) { return "translate(" + ptr.position(d) + ")"; })
                })
                .on("dragend", function(d) 
                {
                    delete dragging[d];
                    ptr.transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                    ptr.transition(foreground).attr("d", ptr.path);
                    background
                        .attr("d",ptr.path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                })
            );


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
                d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", ptr.brushstart).on("brush", ptr.brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    }

	/*
     * positions axis selection
     */
    this.position = function(d) 
	{
		var v = dragging[d];
		return v == null ? x(d) : v;
	}
    
    /*
     * transitions axis selection when dragging
     */
    this.transition = function(g) 
	{
		return g.transition().duration(500);
	}

    /*
     * Returns the path for a given data point.
     */
    this.path = function(d) 
	{
        var v = d.values;
		var line_obj = line(dimensions.map(function(p) {return [ptr.position(p), y[p](v[dimensions.indexOf(p)])] }));
		return line_obj;
	}
    
    /*
     * initiates selection on axis
     */
    this.brushstart = function() 
	{
		d3.event.sourceEvent.stopPropagation();
	}

    /*
     * Handles a brush event, toggling the display of foreground lines.
     */
    this.brush = function()
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
