function selectedVisualization()
{
    var height = 600;
    var width = 700;
    
    var xScale;
    var yScale;
    var rScale;
    
    var node;
    var diameter = 600,
    format = d3.format(",d");
    
    var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);
    
    this.create = function()
    {/*
        svg_selected = d3.select("#sel_viz").append("svg")//d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");*/
        document.getElementById("maps").style = "display:none;";
        document.getElementById("sel_viz").style = "display:block;";
        
        xScale = d3.scale.linear();
        xScale.range([0,width]);

        yScale = d3.scale.linear();
        yScale.range([0,height]);
        
        rScale = d3.scale.linear();
        rScale.range([2,5]);

    }
    
    this.update = function(dataset)
    {
        document.getElementById("maps").style = "display:none;";
        document.getElementById("sel_viz").style = "display:block;";
        
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0,d3.max(dataset)]);
        rScale.domain([0,d3.max(dataset, function(d){return d.size;})]);
        
        svg_selected.selectAll("*").remove();
        
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
         
            
        
        node = svg_selected.selectAll(".node")
            .data(bubble.nodes(classes(dataset))
            .filter(function(d) { return !d.children; }))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
            
        node.append("circle")
            .attr("r", function(d) { return d.r; })
            //.attr("cx", function(d){ return d.x; })
            //.attr("cy", function(d){ return d.y; })
            .style("fill", function(d) { return d.color });
            

        /*
        node.append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.className.substring(0, d.r / 3); });*/
    
    }
    
    function classes(root) 
    {
        var classes = [];

        for(var i = 0; i < root.length; i++)
        {
            if(!root[i].rank)
                classes.push({color: root[i].color, className: root[i].name, value: 20});
        }
        return {children: classes};

        
        /*
        function recurse(name, node) 
        {
            if (node.children) 
            {
                node.children.forEach(function(child) 
                { 
                    recurse(node.name, child); 
                });
            }
            else 
                classes.push({packageName: name, className: node.name, value: 200});
        }

            recurse(null, root);
            return {children: classes};*/
    }
    

}