function selectedVisualization()
{
    var height = 600;
    var width = 700;
    
    
    var xScale;
    var yScale;
    var rScale;
    
    this.create = function()
    {/*
        svg_selected = d3.select("#sel_viz").append("svg")//d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");*/
            
        xScale = d3.scale.ordinal();
        xScale.rangeRoundBands([0,width],0.05);

        yScale = d3.scale.linear();
        yScale.range([0,height]);
        
        rScale = d3.scale.linear();
        rScale.range([2,5]);
        
        console.log("created");
    }
    
    this.update = function(dataset)
    {
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0,d3.max(dataset)]);
        rScale.domain([0,d3.max(dataset, function(d){return d.size;})]);
        
        svg_selected.selectAll("*").remove();
        
        svg_selected.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")  
                .filter(function(d) { return !d.children;}) // only shows for leaves
                .attr("x",function(d,i){return xScale(i);})
                .attr("y",function(d){return 0;})//return height - yScale(d.size);})
                .attr("width",xScale.rangeBand())
                .attr("height",function(d){return d.size/20;})//yScale(d.size);})
                .attr("fill", function(d){return d.color;});;
    
    }
}