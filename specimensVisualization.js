function specimensVisualization()
{
    var height = 300;
    var width = window.innerWidth;
    
    var svg_specimens;
    var xScale;
    var yScale;
    var rScale;
    
    this.create = function()
    {
        svg_specimens = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);
            //.append("g");
            
        xScale = d3.scale.ordinal();
        xScale.rangeRoundBands([0,width],0.05);

        yScale = d3.scale.linear();
        yScale.range([0,height]);
        
        rScale = d3.scale.linear();
        rScale.range([30,80]);
        
        console.log("specimens created");
    }
    
    this.update = function(dataset)
    {
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0,d3.max(dataset, function(d){return d.size;})]);
        rScale.domain([0,d3.max(dataset, function(d){return d.size;})]);
        
        svg_specimens.selectAll("*").remove();
        
        svg_specimens.selectAll("circle")
                .data(dataset)
                .enter()
                .append("circle")  
                .filter(function(d) { return !d.children;}) // only shows for leaves
                .attr("cx", function(d,i){return xScale(i);})
                .attr("cy", function(d){return 50;})
                .attr("r", function(d){return rScale(d.size);})
                .attr("fill", function(d){return d.color;});;
    
    }
}