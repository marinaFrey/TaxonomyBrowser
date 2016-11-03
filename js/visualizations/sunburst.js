var node;
/*
 * Class for the sunburst visualization
 * 
 */
function Sunburst()
{
    //var node;
	var transitionDuration = 1000;
	var rootDepth = 0;
	var rootNode;
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
    var x = d3.scale.linear().range([0, 2 * Math.PI]);

    //y is simple distance from the center 
    var y = d3.scale.linear().range([0, radius]);

    var svg = d3.select("#viz").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width) / 2)  + "," + (height / 2 + 10) + ")");
    
    var g;
    var partition = d3.layout.partition()
        .value(function(d) 
		{ 
            if(showByChildrenNumbers)
                return 1; 
            else
                return 1/(d.parent.children.length);
		});

    var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
		
	var textArc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y + d.dy/2 - 1/10000)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy/2 + 1/10000)); });

    var color = d3.scale.category20c();
	var childrenColor = d3.scale.category10();
    var colorTypes = {0:'blue',1:'pink',2:'purple',3:'orange',4:'green',5:'red'};
	var TaxonsColorsList = 
			{
				0: ['#C6DBEF','#9ECAE1','#6BAED6', '#3182BD'], 
				1: ['#FDD098','#FDAE6B','#FD8D3C','#E6550D'], 
				2: ['#C7E9C0','#A1D99B','#74C476','#31A354'], 
				3:['#DADAEB','#BCBDDC','#9E9AC8','#756BB1'], 
				4:['#EBDAE3','#DCBCCD','#C89AAD','#B16B84']
			};
	
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
			rootNode = root;
            // creating g elements for each node on sunburst

            g = svg.selectAll("g")
                .data(partition.nodes(root))
                .enter().append("g");
            
            defineColoring(node, 0,0);
            
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
                .each(function(d)
                {
                    d.path = this;
                    d.startAngle = arc.startAngle()(d);
                    d.endAngle = arc.endAngle()(d);
                    //d.outerRadius = arc.outerRadius()(d);
                    d.selected = false;
                })
                
                .style("fill", function(d) 
                {   /*
                    if(d.rank != "7")
                    {
                        //d.color = color(d.name);
                        d.color = randomColor({hue:'blue'});
                        //d.size = d.children.length;
                    }
                    else
                    {
                        //d.color = childrenColor(d.name);
                        d.color = randomColor();
                        //d.size = 1;
                    }*/
                    
                    if(d.rank == "7")
                    {
                        //d.color = randomColor();
						d.color = childrenColor(d.name);
                    }
                    return d.color; 
                })
                .style("opacity",normalOpacity)
                .each(stash)
                ;
				
			
            textPath = g.append("path")
                .filter(function (d){return d.rank})
                .attr("d", textArc)
				.attr("id", function(d) 
				{ 
					var newName = "textPath"+d.name.replace(' ', '_');
					return newName.replace('.', '_');
				})
				.each(function(d){ d.textArcPath = this})
                .style("opacity",0);
			
			databaseSize = path[0].length;
            
            text = g.append("text")
                .filter(function (d){return (d.rank);})
                .attr("dy", function(d) 
                {   return 0;
                    if(d.endAngle - d.startAngle == Math.PI*2)
                    {
                        return 15;
                    }
                    if(d.endAngle == Math.PI*2) 
                    {
                        return 15; // era -30
                    }
                    return (d.endAngle > 90 * Math.PI/180 ? 15 : 15); 
                })
                .style("font-size",function(d) {return "14px";})
                .attr('depth', function(d) {return d.depth})
                .attr('root', 0)
                .attr('id', function(d)
				{ 
					var n = d.name.replace(' ', '_');
					var n = d.name.replace('.', '_');
					return 'Name_' + n + '_Depth-' + d.depth; 
				})
                .append("textPath")
				.each(createTooltip)
                .attr("startOffset", textOffset)
                .style("text-anchor", "middle")
                .attr("xlink:href",function(d){return "#" + d.textArcPath.id;})	
				.text(function(d){ return d.name;})
                ;

            
			//console.log(text);
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

            setInteraction(true);

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
		setInteraction(false);

        
		rootDepth = d.depth;
		var clickedNode = d;
		rootNode = d;

		unsetShownOnChildren(node);
		setShownOnChildren(rootNode);
		
        var index = 0;
        path.transition().delay(100)
            .duration(transitionDuration)
            .attrTween("d", arcTween(d))
			.style("opacity",pathOpacity)
            .each("end", function(e, i) 
            {
                index ++;
                if (index == databaseSize) 
				{
					setInteraction(true);
				}
			});	

		textPath.transition()
            .duration(transitionDuration)
            .attrTween("d", textArcTween(d));	

		text
			.transition().delay(transitionDuration)
			.each("start", filterTexts)
			.attr("pointer-events", null);
                
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
            showByChildrenNumbers = true;
        else
            showByChildrenNumbers = false;

		unsetShownOnChildren(node);
		setShownOnChildren(rootNode);
		
        g = svg.selectAll("g")
            .data(partition.nodes(node))
            .enter().append("g");
			
		path.transition()
			.filter(function(d){return d.show == true;})
			.duration(transitionDuration)
			.style("opacity",pathOpacity)
            .attrTween("d", arcTweenData);  

			
		textPath.transition()
            .duration(transitionDuration)
            .attr("pointer-events", null)
			.attr("startOffset", textOffset)
            .attrTween("d", textArcTween(rootNode))
		
		text
			.transition().delay(transitionDuration).duration(transitionDuration)
			.each("start", filterTexts)
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

	function setInteraction(set)
	{
		if (!set) 
		{
			// events for texts
            d3.selectAll('text')
				.on("click", null)
				.on("contextmenu", null)
				.on("mouseover", null)
				.on("mouseout", null);
            
            // events for paths
            d3.selectAll('path')
				.on("click", null)
				.on("contextmenu", null)
				.on("mouseover", null)
				.on("mouseout", null);		
		}
		else 
		{
			// events for texts
            d3.selectAll('text')
				.on("click", click)
				.on("contextmenu", rightClick);
            
            // events for paths
            d3.selectAll('path')
				.on("click", click)
				.on("contextmenu", rightClick);
		}
	}

	// Interpolate the scales!
    function arcTween(d) 
    {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
          yd = d3.interpolate(y.domain(), [d.y, 1]),
          yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function(d, i) {
        if(i)
		{
            return function(t) { return arc(d); }
		}
		else
		{	
			return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
		}
	  };
    }
	
	function textArcTween(d) 
    {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
          yd = d3.interpolate(y.domain(), [d.y, 1]),
          yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function(d, i) {
        return i
            ? function(t) { return textArc(d); }
            : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return textArc(d); };
      };
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
	
	function filterTexts(d) 
	{
		d.endAngle = arc.endAngle()(d);   
		d.startAngle = arc.startAngle()(d);
		/*
		console.log(d.name)
		console.log(this.getComputedTextLength());
		console.log(d.textArcPath.getTotalLength());*/
		
		//if(d.endAngle - d.startAngle < 10*Math.PI/180)
		//if(d.endAngle - d.startAngle < 20*Math.PI/180 || d.depth == 0)
			//e.endAngle = arc.endAngle()(e);   
			//e.startAngle = arc.startAngle()(e);
		/*
		if(d.show)
		{
			d3.select(this.parentNode).style("display","block");
		}
		else
		{	console.log(d);
			d3.select(this.parentNode).style("display","none");
		}*/
		if(d.endAngle - d.startAngle < 1*Math.PI/180 || d.show == false || d.depth == 0 || d.depth < rootDepth || this.getComputedTextLength() > (d.textArcPath.getTotalLength())/2)
		{
			if(d.depth != 0)
			{
				d3.select(this.parentNode).style("display","none");
				d3.select(this.parentNode).style("opacity", 0)
			}
		}
		else
		{	
			d3.select(this.parentNode)
				.style("opacity", 0);
				
			d3.select(this.parentNode)
				.transition().duration(transitionDuration)
				.style("display","block")
				.style("opacity",1);
				
			d3.select(this).transition().duration(transitionDuration)
			.attr("startOffset", textOffset);
		}
	}
	function textOffset(f) 
	{
		if(f.endAngle - f.startAngle == Math.PI*2)
		{
			return "25%";
		}
		if(((f.startAngle + f.endAngle)/2 < 270*Math.PI/180) && ((f.startAngle + f.endAngle)/2 > 90*Math.PI/180))
			return "75%"
		else
			return "25%"
		/* if(f.endAngle - f.startAngle == Math.PI*2)
		{
			return "25%";
		}
		if((f.startAngle + f.endAngle)/2 == Math.PI*2) 
		{
			return "25%";
		}
		if(f.endAngle >= 270*Math.PI/180)
		{
			return "25%";
		}
		return (f.endAngle >= 90 * Math.PI/180 ? "75%" : "25%"); */
	}
	
	function pathOpacity(d)
	{
		if(d == rootNode.parent)
		{
				return normalOpacity
		}
		if(d.show)
		{
			if(d.selected)
				return 1;
			else
				return normalOpacity;
		}
		else
		{
			return 0;
		}
	}
	
	/* CREATE TOOLTIP */
	
	function createTooltip(d)
	{
		$('#'+d.path.parentNode.lastChild.id).toolbar({
		//$('div[data-toolbar="user-options"]').toolbar({
			content: '#toolbar-options',
			name: d.name,
			position: 'top',
			style: 'default',
			adjustment: 40 //era 50

		}); 
		
		
		$('#'+d.path.parentNode.lastChild.id).on('toolbarItemClick',
		//$('div[data-toolbar="user-options"]').on('toolbarItemClick',
			function( event, buttonClicked ) 
			{

				if(buttonClicked.id == "tooltip_info")
				{
					makeTaxonomyPopup(d);
				}
				if(buttonClicked.id == "tooltip_add")
				{
					if(userLoggedIn)
					{
						if(d.rank == "7")
						{
							makeAddSpecimenPopup(d);
						}
						else
						{
							if(userLoggedIn.getRole() == "1")
								makeAddTaxonomyPopup(d);
							else
								alert("You must be an Administrator to add new taxons to the database.");
						}
					}
					else
					{
						alert("You must be logged in to add new information to the database.");
					}
				}
				if(buttonClicked.id == "tooltip_edit")
				{
					
					if(userLoggedIn)
					{
						if(userLoggedIn.getRole() == "1")
						{
							makeTaxonomyPopup(d);
							editTaxonomyFields(d);
						}
						else
							alert("You must be an Administrator to edit taxons from the database.");
						
					}
					else
					{
						alert("You must be logged in to edit information from the database.");
					}
				
				}
			  
			}
		);
	}
	
	/* HELPER FUNCTIONS */
	
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
	
	
	function defineColoring(d, colorGroup, colorTone)
    {
		colorTone = (colorTone +1)% 4;
		console.log(colorGroup);
		console.log(colorTone);
		console.log(TaxonsColorsList[colorGroup]);
		d.color = TaxonsColorsList[colorGroup][colorTone];//randomColor({hue:colorTypes[j]});
        if(d.children)
        {
            for( var i = 0; i < d.children.length; i++)
            {       if(d.children[i].rank && d.children[i].rank != "7")
                    {
                        defineColoring(d.children[i], colorGroup,colorTone);
                        colorGroup = (colorGroup + /*getRandomInt(1,4)*/+1) % 5;
						//colorGroup = (colorGroup +1) % 5;
                    }
            }
        }
    }
	
	function setShownOnChildren(d)
    {   
		d.show = true;
		//console.log(d);
		if(d.children)
		    for( var i = 0; i < d.children.length; i++)
				if(d.children[i].rank)
					setShownOnChildren(d.children[i]);
    }
	
	function unsetShownOnChildren(d)
    {   
		d.show = false;
		if(d.children)
		    for( var i = 0; i < d.children.length; i++)
				if(d.children[i].rank)
					unsetShownOnChildren(d.children[i]);
    }
	
	// Setup for switching data: stash the old values for transition.
    function stash(d) 
    {
      d.x0 = d.x;
      d.dx0 = d.dx;
    }
	
	function midAngle(d)
    {
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }
    
    function getRandomInt(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
