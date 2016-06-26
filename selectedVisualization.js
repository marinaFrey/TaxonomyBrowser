function selectedVisualization()
{
    var height = 700;
    var width = $("#selected_view").width();
    
    var xScale;
    var yScale;
    var rScale;
    
    var circle;
    var padding = 1.5; // separation between same-color circles
    var clusterPadding = 6; // separation between different-color circles
	var maxRadius = 250;
	var clusters = [];
	var data;
    var node;
    format = d3.format(",d");
    
    var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
    .padding(1.5);
    
    this.create = function()
    {
		
        xScale = d3.scale.linear();
        xScale.range([0,width]);

        yScale = d3.scale.linear();
        yScale.range([0,height]);
        
        rScale = d3.scale.linear();
        rScale.range([2,5]);

    }
    
    this.update = function(dataset)
    {

        svg_selected_specimens.selectAll("*").remove();
        
        var sizeName = comboSize.getSelectedOption();
        
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0,d3.max(dataset)]);
        //rScale.domain([0,d3.max(dataset, function(d){return d.size;})]);
        rScale.domain(d3.extent(dataset, function(d)
		{
				if(!d.children)
				{
					if(d.measures)
					{
						for(var j = 0; j < d.measures.length; j++)
						{
								if(d.measures[j].name == sizeName)
								{
									return parseFloat(d.measures[j].value);
								}
						}
					}
					
				}

		}));
 
        //svg_selected.attr("transform", "translate(" + ((width) / 2)  + "," + (height / 2 + 10) + ")");
        /*
        svg_selected.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")  
                .filter(function(d) { return !d.children;}) // only shows for leaves
                .attr("x",function(d,i){return xScale(i);})
                .attr("y",function(d){return 0;})//return height - yScale(d.size);})
                .attr("width",xScale.rangeBand())
                .attr("height",function(d){return d.size/20;})//yScale(d.size);})
                .attr("fill", function(d){return d.color;});;*/
         data = bubble.nodes(classes(dataset,sizeName));
		 
		var force = d3.layout.force()
			.nodes(data)
			.size([width, height])
			.gravity(.02)
			.charge(0)
			.on("tick", tick)
			.start();    
			
		node = svg_selected_specimens.selectAll("circle")
			.data(data)
			.enter().append("circle")
			.attr("class", "node")
			.attr("r", function(d) { return 200; })
			.style("fill", function (d) 
			{
				return d.color;
			})
			.call(force.drag);	
			

        /*
        node = svg_selected_specimens.selectAll(".node")
            .data(data)
           //.filter(function(d) { return !d.children; })
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
            
        circle = node.append("circle")
            .attr("r", function(d) { return d.r; })
            //.attr("cx", function(d){ return d.x; })
            //.attr("cy", function(d){ return d.y; })
            .style("fill", function(d) { return d.color })
			.call(force.drag);*/
			/*
			.on("click", function(d)
			{
				makeSpecimenPopup(dataset[d.id]);
			})
			.on("contextmenu", function(d)
			{
				d3.event.preventDefault();
				 if( dataset[d.id].selected == false)
				 {
					d3.select(this.parentNode.childNodes[0]).style("opacity", 1);
					//dataset[d.id].selected = true;
					selection.push(dataset[d.id]);
					
					updateShownVisualizationAndOptions();
				 }
				 else
				 {
					d3.select(this.parentNode.childNodes[0]).style("opacity", 0.3);
					//dataset[d.id].selected = false;
					selection.splice(selection.indexOf(dataset[d.id]),1);
					
					updateShownVisualizationAndOptions();
				 }
			});*/
            
    
    }
    
    function classes(root,measureName)
    {
        var classes = [];
		var k = 0;
		var d;

        for(var i = 0; i < root.length; i++)
        {
            if(root[i].children && root[i].children[0].measures) // se especime
            {
				
				/*
				 for(var j = 0; j < root[i].children.length; j++)
                {
					d = {color: root[i].children[j].color, className: root[i].children[j].name, cluster: k, value: 200};
					classes.push(d);
				}*/
				d = {color: root[i].color, className: root[i].name, cluster: k, radius: 200};
				classes.push(d);
				clusters[k] = d;
				k++;
				/*
                for(var j = 0; j < root[i].measures.length; j++)
                {
                        if(root[i].measures[j].name == measureName)
                        {
                            //console.log("X " +xScale(parseFloat(d.measures[j].value)));
                            classes.push({color: root[i].color, className: root[i].name, id: i, value: parseFloat(root[i].measures[j].value)});
                        }
                }*/
            }
        }
        //return {children: classes};
        return classes;

    }
	
    
    function tick(e) 
    {
        node
          .each(cluster(3 * e.alpha * e.alpha))
          .each(collide(.5))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }
    
	// Move d to be adjacent to the cluster node.
	function cluster(alpha) 
	{
		return function(d) 
		{
			var cluster = clusters[d[0].cluster];
			console.log(d);
			if (cluster === d) return;
			var x = d.x - cluster.x,
			y = d.y - cluster.y,
			l = Math.sqrt(x * x + y * y),
			r = d.radius + cluster.radius;
			if (l != r) 
			{
				l = (l - r) / l * alpha;
				d.x -= x *= l;
				d.y -= y *= l;
				cluster.x += x;
				cluster.y += y;
			}
		};
	}
    
    function collide(alpha) 
    {
        var quadtree = d3.geom.quadtree(data);
        return function(d) 
        {
            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) 
            {
                if (quad.point && (quad.point !== d)) 
                {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) 
                    {
                          l = (l - r) / l * alpha;
                          d.x -= x *= l;
                          d.y -= y *= l;
                          quad.point.x += x;
                          quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }

}