function Sunburst()
{
    var node;
	var databaseSize;
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

    var svg = d3.select("#viz").append("svg")//d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width) / 2)  + "," + (height / 2 + 10) + ")");
    
    var g;
    var partition = d3.layout.partition()
        .value(function(d) 
		{ 
            console.log(showByChildrenNumbers);
			//return size(1); 
            if(showByChildrenNumbers)
            {
                return 1; 
            }
            else
            {
                return 1/(d.parent.children.length);
            }
		});
	

    var size = d3.scale.linear()
        .domain([0,1500])
        .range([100, 200]);


    var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

    var color = d3.scale.category20c();
	var childrenColor = d3.scale.category10();
    
    this.create = function()
    {
        d3.json("full_data.json", function(error, root) 
        {
            node = root;
          g = svg.selectAll("g")
              .data(partition.nodes(root))
              .enter().append("g");

          var path = g.append("path")
			.filter(function (d){return d.children})
            .attr("d", arc)
            .attr("id", function(d) { return d.name.replace(' ', '_');})
            .style("fill", function(d) 
            {   
                d.path = this;
                d.startAngle = arc.startAngle()(d);
                d.endAngle = arc.endAngle()(d);
				//d.outerRadius = arc.outerRadius()(d);
                d.selected = false;
				if(!d.children[0].measures)
				{
					d.color = color(d.name);
					d.size = d.children.length;
				}
				else
				{
					d.color = childrenColor(d.name);
					d.size = 1;
				}
                //d.color = color((d.children ? d : d.parent).name);
                return d.color; 
            })
            .style("opacity",normalOpacity)
            .on("click", click);
            
			databaseSize = path[0].length;

             /*
          var text = g.append("text")
			//.filter(function (d){return d.children})
		    .attr("text-anchor", function(d) {return getAnchor(d, this);})
			.attr("transform", function(d) { return computeTextTransform(d, this); })
            //.attr("dy", function(d){ return getDY(this);})
            .style("opacity", function(d) 
			{
				return opacity(d)
			})
            .attr('depth', function(d){return d.depth})
            .attr('root', 0)
            .attr('id', function(d){ return 'Name_' +d.name.replace(' ', '_') + '_Depth-' + d.depth + '_Value-' + Math.round(d.value); })
            .text(function(d){return d.name;})
            ;*/
            
            /*
            for(var i = 0; i < text[0].length; i++)
            { 
                var fontSize = 12;
                text[0][i].style.fontSize = fontSize + "px";
                
                if(path[0][i].getTotalLength() < 155)
                {
                    text[0][i].style.opacity = 0;
                }
                else
                { 
                    while(text[0][i].getComputedTextLength()*2.5 > path[0][i].getTotalLength())
                    {
                
                        fontSize--;
                        text[0][i].style.fontSize = fontSize + "px";
                        
                    }
                }
            }*/
            
            var text = g.append("text")
                //.filter(function (d){return d.path.getTotalLength() > 100})
                .filter(function (d){return (d.children);})
                .filter(function (d){return (d.endAngle - d.startAngle > 10*Math.PI/180 );})
				.filter(function (d){return d.depth != 0})
                .attr("dy", function(d,i) 
                {   
                    if(d.endAngle - d.startAngle == Math.PI*2)
                    {
                        return 30;
                    }
                    if(d.endAngle == Math.PI*2) 
                    {
                        return -30;
                    }
                    return (d.endAngle > 90 * Math.PI/180 ? 30 : -30); 
                })
                .style("font-size",function(d) 
				{
					return "15px";
				})
                .style("opacity", function(d) 
                {
                    return opacity(d)
                })
                .attr('depth', function(d)
				{
					return d.depth
				})
                .attr('root', 0)
                .attr('id', function(d){ return 'Name_' +d.name.replace(' ', '_') + '_Depth-' + d.depth + '_Value-' + Math.round(d.value); })
                .append("textPath")
                .attr("startOffset", function(d,i) 
                {   //console.log(d.startAngle);
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
				.text(function(d){ return d.name/*+" ("+d.children.length+")"*/;})

                ;

            d3.selectAll('text')
              .on("click", click)
              .on("contextmenu", rightClick)
              .on("mouseover", doHover)
              .on("mouseout", unDoHover);
            
            d3.selectAll('path')
              .on("contextmenu", rightClick)
              .on("mouseover", doHover)
              .on("mouseout", unDoHover);
            //d3.select('body').append('img').attr('src', 'KEY.png');
            
            d3.selectAll("input").on("change", function change() 
            {        
                if(this.value === "count")
                    showByChildrenNumbers = false;
                else
                    showByChildrenNumbers = true;
                
                g = svg.selectAll("g")
                    .data(partition.nodes(root))
                    .enter().append("g");
                    
                path
                    //.data(partition.nodes(root))
                    .transition()
                    .duration(1000)
                    .attrTween("d", arcTweenData);
            });
          
          function click(d) 
          {
            // fade out all text elements
            setHover(false);
            d3.selectAll("svg g text tspan").remove();

            text.transition().style("opacity", 0);
            var arcText = [];
            var rootDepth = d3.select(this.parentNode).select("text").attr("depth");
			
            if (false) 
            {
              d3.select(this.parentNode).select("text").append('tspan').text(function(d){ 
                  return "Format: " + d.ClaimFormat;})
                .attr("class", "benefitFormat")
                .attr("dy", 20)
                .attr("x", 45);

              d3.select(this.parentNode).select("text").append('tspan').text(function(d){
                  return "Status: " + d.ClaimStatus;})
                .attr("class", "benefitStatus")
                .attr("dy", 20)
                .attr("x", 45);
              
              d3.select(this.parentNode).select("text").append('tspan').text(function(d){
                  return "Net Benefit: " + Number(d.size)})
                .attr("class", "benefitNet")
                .attr("dy", 20)
                .attr("x", 45);
            
              d3.select(this.parentNode).select("text").append('tspan').text(function(d){
                  return "Charged Amount: " + Number(d.ChargedAmount); })
                .attr("class", "benefitComponents")
                .attr("dy", 20)
                .attr("x", 55);
              
              d3.select(this.parentNode).select("text").append('tspan').text(function(d){
                  return "Discount Amount: " + Number(d.DiscountAmount); })
                .attr("class", "benefitDiscount")
                .attr("dy", 20)
                .attr("x", 55);
              
            }
            d3.select(".isCenter").classed('isCenter', false);
            d3.select(this.parentNode).select("text").attr('class', 'isCenter');
            var index = 0;
            path.transition()
              .duration(1000)
			  //.filter(function (d){return d.children})
              .attrTween("d", arcTween(d))
              .each("end", function(e, i) 
              {
                index ++;
                if (index == databaseSize) 
                { 
                  setHover(true);
                }
                  // check if the animated element's data e lies within the visible angle span given in d
                  if (e.x >= d.x && e.x < (d.x + d.dx)) 
                  {
					  
                    // get a selection of the associated text element
                    arcText = d3.select(this.parentNode).select("text");
                    // fade in the text element and recalculate positions
                    arcText.transition().duration(100)
                      .filter(function (d){return (d.endAngle - d.startAngle > 10*Math.PI/180 );})
                      .attr("text-anchor", function(d) 
                      { 
                        return getAnchor(d, this);
                      })
                      //.attr("transform", function() { return computeTextTransform(e, this); })
                      .attr("root", function(d) { return rootDepth; })
                      //.attr("dy", function(d){ return getDY(this);})
                      // .attr("x", function(d) { return y(d.y); })
                      .style("opacity", function(d) 
                      {
                        //return opacity(d)
						if(rootDepth > d.depth)
							return 0;
						return 1;
                      })
					  .attr("pointer-events", null);

                    /*
                    var fontSize = 12;
                    arcText[0][0].style.fontSize = fontSize + "px";
                    if(this.getTotalLength() < 155)
                    {
                        arcText.transition().style("opacity", 0);
                    }
                    else
                    {
                        while(arcText[0][0].getComputedTextLength()*3.2 > this.getTotalLength())
                        {
                            fontSize--;
                            arcText[0][0].style.fontSize = fontSize + "px";
                            
                        }
                    }*/
                    
                  }
				  else
				  {
						arcText = d3.select(this.parentNode).select("text");
						// fade in the text element and recalculate positions
						arcText
						.attr("root", function(d) { return rootDepth; })
						.attr("pointer-events", "none")
						.style("opacity", 0);
				  }
              });
            
			
            
            }
        });

    d3.select('svg').style("height", height + "px");
    }
	
    //make the last row invisible
    function opacity(d) 
    {
      return d.depth >= 4 && y(d.y) >= 280 ? 0 : 1;
    }

    /* selects node right clicked and all its children 
    painting it with full opacity and adding it to the selected list */
    function rightClick(d)
    {
        d3.event.preventDefault();
        if( d.selected == false)
        {      
            d3.select(this.parentNode.childNodes[0]).style("opacity", 1);
            selection.push(d);
            //console.log(d.children);
            if(d.children)
                setSelectionOnChildren(d);
			//console.log(selection);
            d.selected = true;
            
            //selectedViz.update(selection);
			updateShownVisualizationAndOptions();
        }
        else
        {
            d3.select(this.parentNode.childNodes[0]).style("opacity", normalOpacity);
            selection.splice(selection.indexOf(d),1);
            if(d.children)
                unsetSelectionOnChildren(d);
			
            d.selected = false;
            
            //selectedViz.update(selection);
			updateShownVisualizationAndOptions();
        }
    }
    
    // BEWARE recursive function
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
			else
			{
				//selection.push(d.children[i]);
			}
				
        }
    }
    
    // BEWARE recursive function
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
	}
    
      
    };

    function unDoHover(d) 
    {
      //d3.select(this.parentNode.childNodes[0]).transition().duration(200).attr("opacity", "1");
      
      // hiding tooltip
      d3.select("#tooltip").classed("hidden", true);
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
