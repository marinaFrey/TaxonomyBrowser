function treemapVisualization()
{
	var defaults = 
	{
		margin: {top: 24, right: 0, bottom: 0, left: 0},
		rootname: "Chordata",
		format: ",d",
		title: "",
		width: 860,
		height: 800
	};
	var x,y;
	var node;
	var width;
	var height;
	
	this.create = function()
    {   
		div = d3.select("body").append("div")   
			.attr("class", "tooltip")               
			.style("opacity", 0);
    }
    
	this.update = function()
    {
		/*window.addEventListener('message', function(e) 
		{
			
			var opts = e.data.opts,
				data = e.data.data;

			return main(opts, data);
		});*/

		var parsedTreeData = parseTreeData(taxTreeData);

		main(parsedTreeData);

		function main(data) 
		{
			svg_treemap_viz.selectAll("*").remove();
			
			if(selection.length > 0)
			{
				//console.log(data);
				var color = d3.scale.category20c();
				
				node = data;
				
				var sizeScale = d3.scale.linear()
					//.domain(d3.extent(data, function(p) {return parseFloat(p.values[0]); }))
					.domain([1,1700])
					.range([100,500]);
				
				var root,
				  //opts = $.extend(true, {}, defaults, o),
				  opts =  defaults,
				  formatNumber = d3.format(opts.format),
				  rname = opts.rootname,
				  margin = opts.margin,
				  theight = 36 + 16;
				
				
				
				$('#treemap_viz').width(opts.width).height(opts.height);
				width = opts.width - margin.left - margin.right;
				height = opts.height - margin.top - margin.bottom - theight;
				
				 svg_treemap_viz
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.bottom + margin.top)
					.style("margin-left", -margin.left + "px")
					.style("margin.right", -margin.right + "px")
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
					.style("shape-rendering", "crispEdges");
				
				x = d3.scale.linear().range([0, width + margin.left + margin.right]);
				y = d3.scale.linear().range([0, height + margin.bottom + margin.top]);
				
				var treemap = d3.layout.treemap()
					.size([width, height])	
					.padding(8)
					.mode("dice")
					.sticky(true);
					
					
					treemap.nodes(data);
					
					treemap.value(function(d) 
					{ 
						
						if(!d.rank)
						{
							//console.log(d.parent);
							if(d.parent.selected)
							{
								
								if(d.parent.children.length < 15)
								{
									return 18;
								}
								else
								{
									if(d.parent.children.length > 300)
										return 0.5;
									else
										return 1;
								}
								
							}
							else
								return 0;
						}
						else
							return 0;
					});
					
					treemap.ratio(2.5);
					//.value(function (d) { return d.numberOfChildren;});
					
				var cells = svg_treemap_viz.selectAll(".cell")
					.data(treemap)
					.enter()
					.append("g")
					.filter(function (d) { return (d.children || (d.rank)  ) ;})
					.attr("class","cell")
					.on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });
					
				cells.append("rect")
					.attr("x", function (d) { return d.x;})
					.attr("y", function (d) { return d.y;})
					.attr("width", function (d) { return d.dx;})
					.attr("height", function (d) { return d.dy;})
					.style("fill", function (d) 
						{ 
							if(d.color)
							{
								return d.color;
							}
							else
							{
								return "grey";
							}
		
						})
					.attr("stroke", "#fff")
					/*.on("click", function(d)
					{
						zoom(d);
					})*/;
						
					cells.append("text")
						.attr("x", function (d) { return d.x + d.dx / 2; })
						.attr("y", function (d) { return d.y + d.dy / 2; })
						.attr("text-anchor", "middle")
						.text(function (d) { return d.name; })
						.style("opacity",function(d)
						{
							if(d.selected)
							{
								if(d.rank == "7" && d.children)
									return 1;
								else
									return 0;
							}
							else
								return 0;
						});
					
					//d3.select(window).on("click", function() { zoom(data); });
			}
		}

		function zoom(d) 
		{
			console.log(d);
			
			var kx = width / d.dx, ky = height / d.dy;
			x.domain([d.x, d.x + d.dx]);
			y.domain([d.y, d.y + d.dy]);

			var t = svg_treemap_viz.selectAll(".cell").transition()
				.duration(d3.event.altKey ? 7500 : 750)
				.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

			t.select("rect")
				.attr("width", function(d) { return kx * d.dx - 1; })
				.attr("height", function(d) { return ky * d.dy - 1; })

			t.select("text")
				.attr("x", function(d) { return kx * d.dx / 2; })
				.attr("y", function(d) { return ky * d.dy / 2; })
				.style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

			node = d;
			d3.event.stopPropagation();
		}
		
	}
			/*
			console.log(data);
		  var root,
			  //opts = $.extend(true, {}, defaults, o),
			  opts =  defaults,
			  formatNumber = d3.format(opts.format),
			  rname = opts.rootname,
			  margin = opts.margin,
			  theight = 36 + 16;

		  $('#treemap_viz').width(opts.width).height(opts.height);
		  var width = opts.width - margin.left - margin.right,
			  height = opts.height - margin.top - margin.bottom - theight,
			  transitioning;
		  
		  
		  
		  var x = d3.scale.linear()
			  .domain([0, width])
			  .range([0, width]);
		  
		  var y = d3.scale.linear()
			  .domain([0, height])
			  .range([0, height]);
		  
		  var treemap = d3.layout.treemap()
			  //.size([width,height])
			  //.paddingOuter(10)
			  .children(function(d, depth) { return depth ? null : d._children; })
			  .sort(function(a, b) { return a.value - b.value; })
			  .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
			  .round(false);
		  
		 svg_treemap_viz
			  .attr("width", width + margin.left + margin.right)
			  .attr("height", height + margin.bottom + margin.top)
			  .style("margin-left", -margin.left + "px")
			  .style("margin.right", -margin.right + "px")
			.append("g")
			  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			  .style("shape-rendering", "crispEdges");
		  
		  var grandparent = svg_treemap_viz.append("g")
			  .attr("class", "grandparent");
		  
		  grandparent.append("rect")
			  .attr("y", -margin.top)
			  .attr("width", width)
			  .attr("height", margin.top);
		  
		  grandparent.append("text")
			  .attr("x", 6)
			  .attr("y", 6 - margin.top)
			  .attr("dy", ".75em");
		
		
		
		  if (opts.title) 
		  {
			$("#treemap_viz").prepend("<p class='title'>" + opts.title + "</p>");
		  }
		  
		  if (data instanceof Array) 
		  {
			root = { key: rname, values: data };
		  } 
		  else 
		  {
			root = data;
		  }

		  
		  initialize(root);
		  //accumulate(root);
		  layout(root);
		  //console.log(root);
		  display(root);

		  if (window.parent !== window) 
		  {
			var myheight = document.documentElement.scrollHeight || document.body.scrollHeight;
			window.parent.postMessage({height: myheight}, '*');
		  }

		  function initialize(root) 
		  {
			root.x = root.y = 0;
			root.dx = width;
			root.dy = height;
			root.depth = 0;
		  }

		  // Aggregate the values for internal nodes. This is normally done by the
		  // treemap layout, but not here because of our custom implementation.
		  // We also take a snapshot of the original children (_children) to avoid
		  // the children being overwritten when when layout is computed.
		  function accumulate(d) 
		  {
			  //console.log(d.children);

				if(d.children)
				{
					return (d._children = d.children.length)
						? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
						: d.value;
				}
				else
					return 0;

		  }

		  // Compute the treemap layout recursively such that each group of siblings
		  // uses the same size (1×1) rather than the dimensions of the parent cell.
		  // This optimizes the layout for the current zoom state. Note that a wrapper
		  // object is created for the parent node for each group of siblings so that
		  // the parent’s dimensions are not discarded as we recurse. Since each group
		  // of sibling was laid out in 1×1, we must rescale to fit using absolute
		  // coordinates. This lets us use a viewport to zoom.
		  function layout(d) 
		  {
			if (d._children) 
			{
			  treemap.nodes({_children: d._children});
			  d.children.forEach(function(c) 
			  {
				c.x = d.x + c.x * d.dx;
				c.y = d.y + c.y * d.dy;
				c.dx *= d.dx;
				c.dy *= d.dy;
				c.parent = d;
				layout(c);
			  });
			}
		  }

		  function display(d) 
		  {
			  
			grandparent
				.datum(d.parent)
				.on("click", transition)
			  .select("text")
				.text(name(d));

			var g1 = svg_treemap_viz.insert("g", ".grandparent")
				.datum(d)
				.attr("class", "depth");

			var g = g1.selectAll("g")
				.data(d.children)
			  .enter().append("g");

			g.filter(function(d) { return d.children; })
				.classed("children", true)
				.on("click", transition);
				
			// console.log(g);
			
			var children = g.selectAll(".child")
				.data(function(d) { return d.children || [d]; })
				.enter().append("g");

			children.append("rect")
				.attr("class", "child")
				.call(rect)
				.append("title")
				.text(function(d) { console.log(d.value); return " (" + d.value + ")"; });
			children.append("text")
				.attr("class", "ctext")
				.text(function(d) { return d.key; })
				.call(text2);

			g.append("rect")
				.attr("class", "parent")
				.call(rect);

			var t = g.append("text")
				.attr("class", "ptext")
				.attr("dy", ".75em")

			t.append("tspan")
				.text(function(d) { return d.key; });
			t.append("tspan")
				.attr("dy", "1.0em")
				.text(function(d) { return formatNumber(d.value); });
			t.call(text);

			g.selectAll("rect")
				.style("fill", function(d) { return color(d.key); });

			function transition(d) 
			{
			  if (transitioning || !d) return;
			  transitioning = true;

			  var g2 = display(d),
				  t1 = g1.transition().duration(750),
				  t2 = g2.transition().duration(750);

			  // Update the domain only after entering new elements.
			  x.domain([d.x, d.x + d.dx]);
			  y.domain([d.y, d.y + d.dy]);

			  // Enable anti-aliasing during the transition.
			  svg_treemap_viz.style("shape-rendering", null);

			  // Draw child nodes on top of parent nodes.
			  svg_treemap_viz.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

			  // Fade-in entering text.
			  g2.selectAll("text").style("fill-opacity", 0);

			  // Transition to the new view.
			  t1.selectAll(".ptext").call(text).style("fill-opacity", 0);
			  t1.selectAll(".ctext").call(text2).style("fill-opacity", 0);
			  t2.selectAll(".ptext").call(text).style("fill-opacity", 1);
			  t2.selectAll(".ctext").call(text2).style("fill-opacity", 1);
			  t1.selectAll("rect").call(rect);
			  t2.selectAll("rect").call(rect);

			  // Remove the old node when the transition is finished.
			  t1.remove().each("end", function() 
			  {
				svg_treemap_viz.style("shape-rendering", "crispEdges");
				transitioning = false;
			  });
			}

			return g;
		  }

		  function text(text) 
		  {
			text.selectAll("tspan")
				.attr("x", function(d) { return x(d.x) + 6; })
			text.attr("x", function(d) { return x(d.x) + 6; })
				.attr("y", function(d) { return y(d.y) + 6; })
				.style("opacity", function(d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0; });
		  }

		  function text2(text) 
		  {
			text.attr("x", function(d) { return x(d.x + d.dx) - this.getComputedTextLength() - 6; })
				.attr("y", function(d) { return y(d.y + d.dy) - 6; })
				.style("opacity", function(d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0; });
		  }

		  function rect(rect) 
		  {
			rect.attr("x", function(d) { return x(d.x); })
				.attr("y", function(d) { return y(d.y); })
				.attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
				.attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
		  }

		  function name(d) 
		  {
			return d.parent
				? name(d.parent) + " / " + d.key + " (" + formatNumber(d.value) + ")"
				: d.key + " (" + formatNumber(d.value) + ")";
		  }
		}

		if (window.location.hash === "") 
		{
			d3.json("countries.json", function(err, res) 
			{
				if (!err) 
				{
					console.log(res);
					var data = d3.nest().key(function(d) { return d.region; }).key(function(d) { return d.subregion; }).entries(res);
					main({title: "World Population"}, {key: "World", values: data});
				}
			});
		}
	}*/
	
	function parseTreeData(data)
	{
		data.numberOfChildren = 0;
		if(data.children)
		{
			for(var i = 0; i < data.children.length; i++)
			{
				data.numberOfChildren += countNumberofChildren(data.children[i]);
				
				if(data.children[i].rank)
				{
					data.children[i] = parseTreeData(data.children[i]);
					//console.log(data.name + ": " + data.value + " rank: " + data.rank);
				}
				else
				{
					//console.log(data.children[i]);
					data.numberOfChildren = 0;
				}
			}
		}
		return data;

	}
	

	
	function countNumberofChildren(data)
	{
		var value = 0;
		if(data.children)
		{
			for(var i = 0; i < data.children.length; i++)
			{
				value += countNumberofChildren(data.children[i]);
			}
			return value;
		}
		else
		{
				return 1;

		}
	}

	
}