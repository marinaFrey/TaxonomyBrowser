var node;
/*
 * Class for the sunburst visualization
 * 
 */
function Sunburst()
{
    //var node;
    var path;
    var text;
    var outside_polyline;
    var outside_text;
	var databaseSize;
    var showByChildrenNumbers = false;
    var this_pointer;
	var clickedList = [];
    var normalOpacity = 0.3;
    var width = $("#viz").width(),
        height = 700,
        radius = Math.min(width, height) / 2;
        
    //x is the rotation of the element, relative to the center of the circle, defined by the "transform" property
    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    //y is simple distance from the center 
    var y = d3.scale.linear()
        .range([0, radius]);

    var svg = d3.select("#viz").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width) / 2)  + "," + (height / 2 + 10) + ")");
    
    var g;
    var partition = d3.layout.partition()
        .value(function(d) 
		{ 
			//return 1; 
            if(showByChildrenNumbers)
            {
                return 1; 
            }
            else
            {
                return 1/(d.parent.children.length);
            }
		});

    var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

    var color = d3.scale.category20c();
	var childrenColor = d3.scale.category10();
    
    var radius = Math.min(width, height) / 2;
    var arc2 = d3.svg.arc()
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy));})
        .innerRadius(function(d) { return Math.max(0, y(d.y));});
    var outerArc = d3.svg.arc()
        .innerRadius(function(d) { return Math.max(0, y(d.y + d.dy));})
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy));});
    
	this.remove = function()
	{
		svg.selectAll("*").remove();
	}
	
    /*
     * creates sunburst
     */
    this.create = function()
    {
		
		
        this_pointer = this;
        d3.json("data/data2.json", function(error, root) 
        {
            // saving node root
            node = root;
            // creating g elements for each node on sunburst
            
            
            g = svg.selectAll("g")
                .data(partition.nodes(root))
                .enter().append("g");
            
            // creating path
            path = g.append("path")
                //.filter(function (d){return d.children})
                .filter(function (d){return d.rank})
                .attr("d", arc)
                .attr("id", function(d) 
				{ 
					var newName = d.name.replace(' ', '_');
					return newName.replace('.', '_');
				})
                .style("fill", function(d) 
                {   
                    d.path = this;
                    d.startAngle = arc.startAngle()(d);
                    d.endAngle = arc.endAngle()(d);
                    //d.outerRadius = arc.outerRadius()(d);
                    d.selected = false;
                    //if(!d.children[0].measures)
					
                    if(d.rank != "7")
                    {
                        d.color = color(d.name);
                        //d.size = d.children.length;
                    }
                    else
                    {
                        d.color = childrenColor(d.name);
                        //d.size = 1;
                    }
                    //d.color = color((d.children ? d : d.parent).name);
                    return d.color; 
                })
                .style("opacity",normalOpacity)
                .on("click", click)
                .each(stash)
                ;
			
			databaseSize = path[0].length;
            
            text = g.append("text")
                //.filter(function (d){return d.path.getTotalLength() > 100})
                //.filter(function (d){return (d.children);})
                .filter(function (d){return (d.rank);})
                //.filter(function (d){return (d.endAngle - d.startAngle > 10*Math.PI/180 );})
				.filter(function (d){return d.depth != 0})
                .attr("dy", function(d,i) 
                {   
                    if(d.endAngle - d.startAngle == Math.PI*2)
                    {
                        return 30;
                    }
                    if(d.endAngle == Math.PI*2) 
                    {
                        return 30; // era -30
                    }
                    return (d.endAngle > 90 * Math.PI/180 ? 30 : 30); 
                })
                .style("font-size",function(d) {return "15px";})
                .style("opacity", function(d) 
                {
					if(d.endAngle - d.startAngle < 19*Math.PI/180)
					{	
						return 0;
					}
					else
						return 1;
                })
                .attr('depth', function(d) {return d.depth})
                .attr('root', 0)
                .attr('id', function(d){ return 'Name_' +d.name.replace(' ', '_') + '_Depth-' + d.depth + '_Value-' + Math.round(d.value); })
                .append("textPath")
                .attr("startOffset", function(d,i) 
                {   
                    if(d.endAngle - d.startAngle == Math.PI*2)
                    {
                        
                        return "25%";
                    }
                    
                    if(d.endAngle == Math.PI*2)
                    {                    
                        return "25%";
                    }
                    
                    if(d.endAngle >= 270*Math.PI/180)
                    {
                        return "25%";
                    }
                    
                    return (d.endAngle >= 90 * Math.PI/180 ? "75%" : "25%");
                })
                .style("text-anchor", "middle")
                .attr("xlink:href",function(d){return "#" + d.path.id;})	
				.text(function(d){ return d.name;})
                
                ;
            
            /* OUTSIDE TEXT 

            var duration = 2000;  
            outside_text = g.append("text")//svg.select(".labels").selectAll("text")
                .filter(function (d){return d.children})
                .filter(function (d){return d.rank == "7";})
                .attr("dy", ".35em")
                //.style("opacity", 0)
                .text(function(d){ return d.name;})
                .each(function(d){ this._current = {name: d.name, y: d.y, dy: d.dy, endAngle: d.endAngle, startAngle: d.startAngle, padAngle: 0};});

            outside_text //= svg.select(".labels").selectAll("text")
                .transition().duration(duration)
                .style("opacity", function(d){ return 1;})
                .attrTween("transform", function(d) 
                {
                    var interpolate = d3.interpolate(this._current, this._current);
                    var _this = this;
                    return function(t) 
                    {
                        var d2 = interpolate(t);
                        _this._current = d2;
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate("+ pos +")";
                    };
                })
                .styleTween("text-anchor", function(d)
                {
                    var interpolate = d3.interpolate(this._current, d);
                    return function(t) 
                    {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start":"end";
                    };
                }); */
        
            /* ------- SLICE TO TEXT POLYLINES ------- 

            outside_polyline = g.append("polyline")//select(".lines").selectAll("polyline")
                .filter(function (d){return d.children})
                .filter(function (d){return d.rank == "7";})
                .style("opacity", 0)
                .each(function(d)
                {
                    this._current = {name: d.name, y: d.y, dy: d.dy, endAngle: d.endAngle, startAngle: d.startAngle, padAngle: 0};
                    this._old = this._current;
                    this.endA = d.endAngle;
                    this.object = d;
                   
                    
                });
                
            //console.log(outside_polyline);
            outside_polyline //= svg.select("g").selectAll("polyline")
                .transition().duration(duration)
                .style("opacity", function(d){ return 1;})
                .attrTween("points", function(d)
                {
                    //this._current = this._current;
                    
                    var interpolate = d3.interpolate(this._current,this._current);
                    var _this = this;
                    return function(t) 
                    {
                        var d2 = interpolate(t);
                        _this._current = d2;
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc2.centroid(d2), outerArc.centroid(d2), pos];
                    };			
                })
                .each("end",function(d)
                {
                    //console.log(this.endA);
                })
                ; */

            // events for texts
            d3.selectAll('text')
              .on("click", click)
              .on("contextmenu", rightClick)
              .on("mouseover", doHover)
              .on("mouseout", unDoHover);
            
            // events for paths
            d3.selectAll('path')
              .on("contextmenu", rightClick)
              .on("mouseover", doHover)
              .on("mouseout", unDoHover);

            this_pointer.togglePartition(showByChildrenNumbers);
        });
        
        d3.select('svg').style("height", height + "px");
        
    }
    
    /* 
     * Click function on path d
     */
    function click(d) 
    {
        // remove all mouse events
        setHover(false);
        d3.selectAll("svg g text tspan").remove();

        var arcText = [];
        var rootDepth = d3.select(this.parentNode).select("text").attr("depth");
        var clickedNode = d;
		
        /*if (marinaquer) 
        {
            d3.select(this.parentNode).select("text").append('tspan').text(function(d)
            {return "Format: " + d.ClaimFormat;})
                .attr("class", "benefitFormat")
                .attr("dy", 20)
                .attr("x", 45);             
        }*/
        d3.select(".isCenter").classed('isCenter', false);
        d3.select(this.parentNode).select("text").attr('class', 'isCenter');
        
        var index = 0;
        path.transition()
            .duration(1000)
            .attrTween("d", arcTween(d))
            .each("end", function(e, i) 
            {
                // when transition finished add back all mouse events
                index ++;
                if (index == databaseSize) 
                    setHover(true);

                // check if the animated element's data e lies within the visible angle span given in d
                if (e.x >= d.x && e.x < (d.x + d.dx)) 
                {
                    /*
                    // get a selection of the associated text element
                    arcText = d3.select(this.parentNode).select("text");

                    // fade in the text element and recalculate positions
                    arcText.transition().duration(100)
                        .filter(function (f){return (e.endAngle - e.startAngle > 10*Math.PI/180 );})
                        .attr("root", function(f) { return rootDepth;})
                        .style("opacity", function(f) 
                        {console.log(f);
                            if(rootDepth > e.depth)
                                return 0;
                            if(e.endAngle - e.startAngle < 10*Math.PI/180)
                                return 0;
                            else
                                return 1;
                        })
                        .attr("pointer-events", null);*/
                    text
                        .transition().delay(50)
                        .each("start", function(d) 
                        {
                            
                            d.endAngle = arc.endAngle()(d);   
                            d.startAngle = arc.startAngle()(d);
                            //if(d.endAngle - d.startAngle < 10*Math.PI/180)
                            if(d.endAngle - d.startAngle < 20*Math.PI/180)
                            {
                                d3.select(this.parentNode).style("opacity",function(e)
                                {
                                    e.endAngle = arc.endAngle()(e);   
                                    e.startAngle = arc.startAngle()(e);
                                    return 0;
                                });
                                
                               
                            }
                            else
                            {
                                d3.select(this.parentNode).style("opacity",function(e)
                                {   
                                    if(this.getAttribute("root") > e.depth)
                                        return 0;
                                    
                                    if(parseInt(clickedNode.rank) > parseInt(d.rank))
                                        return 0;
                                        
                                    e.endAngle = arc.endAngle()(e);   
                                    e.startAngle = arc.startAngle()(e);
                                    return 1;
                                });
                                
                                d3.select(this).transition().duration(1000)
                                .attr("startOffset", function(f,i) 
                                {   
                                    
                                    if(f.endAngle - f.startAngle == Math.PI*2)
                                    {
                                        return "25%";
                                    }
                                    if(f.endAngle == Math.PI*2) 
                                    {
                                        return "25%";
                                    }
                                    if(f.endAngle >= 270*Math.PI/180)
                                    {
                                        return "25%";
                                    }
                                    
                                    return (f.endAngle >= 90 * Math.PI/180 ? "70%" : "20%");
                                });
                                //console.log(this)
                            }
                        })
                        .attr("pointer-events", null);
                }
            });
            /*
        outside_polyline //= svg.select("g").selectAll("polyline")
            .transition().duration(2000)
            .style("opacity", function(d){ return 1;})
            .attrTween("points", function(d)
            {
                //this._current = this._current;
                var interpolate = d3.interpolate(this._current,this._current);
                var _this = this;
                return function(t) 
                {
                    var d2 = interpolate(t);
                    _this._current = d2;
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc2.centroid(d2), outerArc.centroid(d2), pos];
                };			
            });*/
    }
    
    this.togglePartition = function(type)
    {
        if(type)
        {
            showByChildrenNumbers = true;
        }
        else
        {
            showByChildrenNumbers = false;
        }
        
        g = svg.selectAll("g")
            .data(partition.nodes(node))
            .enter().append("g");
            
        path
            .transition()
            .duration(1000)
            .attrTween("d", arcTweenData);

        text
            .transition().delay(1000)
            .each("start", function(d) 
            {
				//console.log(d);
                //console.log(this.parentNode.getBBox().width);
				//console.log(d.endAngle - d.startAngle);
                d.endAngle = arc.endAngle()(d);   
                d.startAngle = arc.startAngle()(d);
				
                //if(d.endAngle - d.startAngle < 10*Math.PI/180)
                if(d.endAngle - d.startAngle < 20*Math.PI/180)
                {	
                    d3.select(this.parentNode).style("opacity",function(e)
                    {
                        e.endAngle = arc.endAngle()(e);   
                        e.startAngle = arc.startAngle()(e);
                        d3.select(this.parentNode).attr("pointer-events", "all");
                        return 0;
                    });
                    
                     if(d.endAngle - d.startAngle < 5*Math.PI/180)
                    {
                        console.log(this.parentNode);
                        d3.select(this.parentNode).attr("pointer-events", "none");
                    }
                    
                }
                else
                {
                    d3.select(this.parentNode).attr("pointer-events", "all");
                    
                    d3.select(this.parentNode).style("opacity",function(e)
                    {   
                        if(this.getAttribute("root") > e.depth)
                            return 0;
                        
                        e.endAngle = arc.endAngle()(e);   
                        e.startAngle = arc.startAngle()(e);
                        return 1;
                    });
                    
                    d3.select(this).transition().duration(1000)
                    .attr("startOffset", function(f,i) 
                    {   
                        
                        if(f.endAngle - f.startAngle == Math.PI*2)
                        {
                            return "25%";
                        }
                        if(f.endAngle == Math.PI*2) 
                        {
                            return "25%";
                        }
                        if(f.endAngle >= 270*Math.PI/180)
                        {
                            return "25%";
                        }
                        
                        return (f.endAngle >= 90 * Math.PI/180 ? "70%" : "20%");
                    });
                    //console.log(this)
                }
            })
            .attr("pointer-events", null);
            
        /*
        outside_polyline = g.append("polyline")//select(".lines").selectAll("polyline")
            .filter(function (d){return d.children})
            .filter(function (d){return d.rank == "7";})
            .style("opacity", 0)
            .each(function(d){this._current = {name: d.name, y: d.y, dy: d.dy, endAngle: d.endAngle, startAngle: d.startAngle, padAngle: 0};});
        
        outside_polyline //= svg.select("g").selectAll("polyline")
            .transition().duration(2000)
            .style("opacity", function(d){ return 1;})
            .each("start", function(d) 
            {
                this._old = {name: this.object.name, y: this.object.y, dy: this.object.dy, endAngle: this.object.endAngle, startAngle: this.object.startAngle, padAngle: 0};
            })
            .attrTween("points", function(d)
            {
                
                
                //this._current = this._current;
                //if(showByChildrenNumbers == false)
                {
                    //console.log(this._old);
                    //console.log(this._current);
                }
                
                //var interpolate = d3.interpolate(this._old,this._current);
                var interpolate = d3.interpolate(this._current,this._old);
                var tmp = this._old;
                this.old = this._current;
                this._current = tmp;
                var _this = this;
                return function(t) 
                {
                    var d2 = interpolate(t);
                    _this._current = d2;
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc2.centroid(d2), outerArc.centroid(d2), pos];
                };			
            });*/
    }
	

    function midAngle(d)
    {
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }
	
	
    
    /* 
     * Selects node right clicked and all its children 
     * painting it with full opacity and adding it to the selected list 
     */
    function rightClick(d)
    {
        d3.event.preventDefault();
		
        if( d.selected == false)
        {      
			clickedList.push({clickedNode:d, toSelect:true});
            d3.select(this.parentNode.childNodes[0]).style("opacity", 1);
            selection.push(d);
            if(d.children)
                setSelectionOnChildren(d);
            d.selected = true;
            //console.log(selection);
			updateShownVisualizationAndOptions();
        }
        else
        {
			clickedList.push({clickedNode:d, toSelect:false});
            d3.select(this.parentNode.childNodes[0]).style("opacity", normalOpacity);
            selection.splice(selection.indexOf(d),1);
            if(d.children)
                unsetSelectionOnChildren(d);		
            d.selected = false;
            
			updateShownVisualizationAndOptions();
        }
    }
    
    /* 
     * Adds node to selected list and applies same function to all its children
     * BEWARE recursive function
     */
    function setSelectionOnChildren(d)
    {   
        for( var i = 0; i < d.children.length; i++)
        {
            if(d.children[i].selected == false)
            {
                d3.select(d.children[i].path).style("opacity", 1);
				if(!d.children[i].children)
					d.children[i].color = d.color;
                d.children[i].selected = true;
				selection.push(d.children[i]);
            } 
            if(d.children[i].children)
                setSelectionOnChildren(d.children[i]);
				
        }
    }
    
    /* 
     * Removes node from selected list and applies same function to all its children
     * BEWARE recursive function
     */
    function unsetSelectionOnChildren(d)
    {
        for( var i = 0; i < d.children.length; i++)
        {
            if(d.children[i].selected == true)
            {
                d3.select(d.children[i].path).style("opacity", normalOpacity);
                selection.splice(selection.indexOf(d.children[i]),1);
                d.children[i].selected = false;
            }
            if(d.children[i].children)
                unsetSelectionOnChildren(d.children[i]);
        }
    }
    
    function setHover(set) 
    {
      if (!set) 
      {
        d3.selectAll('text')
          .on("mouseover", null)
          .on("mouseout", null);

        d3.selectAll('path')
          .on("mouseover", null)
          .on("mouseout", null); 
      }
      else 
      {
        d3.selectAll('text')
          .on("mouseover", doHover)
          .on("mouseout", unDoHover);

        d3.selectAll('path')
          .on("mouseover", doHover)
          .on("mouseout", unDoHover); 
      }
    }

    function doHover(d) 
    {
      //d3.select(this.parentNode.childNodes[0]).transition().duration(200).attr("opacity", "0.6");
        d3.select("#toolbar-options").classed("hidden", false);
        $('#'+d.path.parentNode.lastChild.id).toolbar({
            content: '#toolbar-options',
            name: d.name,
            position: 'top',
            style: 'default',
            adjustment: 50

        }); 
        
        $('#'+d.path.parentNode.lastChild.id).on('toolbarItemClick',
            function( event, buttonClicked ) 
            {

                if(buttonClicked.id == "tooltip_info")
                {
                    makeTaxonomyPopup(d);
                }
                if(buttonClicked.id == "tooltip_add")
                {
					if(d.rank == "7")
						makeAddSpecimenPopup(d);
					else
						makeAddTaxonomyPopup(d);
                }
                if(buttonClicked.id == "tooltip_trash")
                {
                }
              
            }
        );
      
        /*
        if((d.endAngle - d.startAngle < 10*Math.PI/180 ) || d.depth == 0)
        {
            // tooltip 
            var xPosition = d3.event.pageX;
            var yPosition = d3.event.pageY; 

            //Update the tooltip position and value
            d3.select("#tooltip")
              .style("left", xPosition + "px")
              .style("top", yPosition - 50 + "px")
              .select("#name")
              .text(d.name);

            d3.select("#tooltip").classed("hidden", false);
        }*/
    
      
    };

    function unDoHover(d) 
    {
      //d3.select(this.parentNode.childNodes[0]).transition().duration(200).attr("opacity", "1");
      
      // hiding tooltip
	  //console.log($('#'+d.path.parentNode.lastChild.id));
      d3.select("#toolbar-options").classed("hidden", true);
    };

    // Interpolate the scales!
    function arcTween(d) 
    {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
          yd = d3.interpolate(y.domain(), [d.y, 1]),
          yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function(d, i) {
        return i
            ? function(t) { return arc(d); }
            : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
      };
    }

    function getAnchor(d, e) 
    {
          var rotation = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
          if (!d.parent || d3.select(e).classed('isCenter')){
            return 'middle';
          }
          else if (rotation > 90 && rotation <= 270) {
            return 'end';
          }
          else {
            return 'start';
          }
    }

    function computeTextTransform(d, e) 
    {
        if (!d.parent || d3.select(e).classed('isCenter')){ return "rotate(0)"};
        var output;
        var rotation = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
        var translation = y(d.y) + 3;
        var extraRotate = '';
        if (rotation >= 90 && rotation <= 270) 
        { 
            extraRotate = -180;
        }
        // se o path eh bem longo dava um problema que eh resolvido com isso - not sure why

        if(d.path.getTotalLength() > 1000)
        {
            extraRotate = 0;
        }
        // multi line label
        if((d.name || "").split(" ").length > 1)
            insertLineBreaks(d,e);
            
        output = "rotate("+rotation+")"+"translate("+translation+")"+(extraRotate ? "rotate("+extraRotate+")" : "")

        return output;
    }
    
    function insertLineBreaks(d,e)
    {
        var words = d.name.split();

        
    }

    function getDY(e)
    {
      return (d3.select(e).classed('isCenter')) ? '4em' : '.35em'
    }
    
    // Setup for switching data: stash the old values for transition.
    function stash(d) 
    {
      d.x0 = d.x;
      d.dx0 = d.dx;
    }
    
    function arcTweenData(a, i) 
    {
        var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
        function tween(t) 
        {
            var b = oi(t);
            a.x0 = b.x;
            a.dx0 = b.dx;
            return arc(b);
        }
        if (i == 0) 
        {
            // If we are on the first arc, adjust the x domain to match the root node
            // at the current zoom level. (We only need to do this once.)
            var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
            return function(t) 
            {
                x.domain(xd(t));
                return tween(t);
            };
        } 
        else 
        {
            return tween;
        }
    }

}
