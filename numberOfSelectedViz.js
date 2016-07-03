function numberOfSelectedViz()
{
    /*var w = $("#number_sel_viz").width(),
    h = $("#number_sel_viz").height();
    barPadding = 6; // separation between nodes
    var borderBarPadding = 7;*/
    
    var labels = [];
    var parent_div = document.getElementById("number_sel_viz");
    
    this.update = function()
    {
        
        this.removeAll();
        if(filteredSelection[0] != "all")
        {
            var counter = [];
            for (var i = 0; i < filteredSelection.length; i++)
            {
                var index = counter.map(function(e) { return e.name; }).indexOf(selection[filteredSelection[i]].name);
                if(index !=-1)
                {
                    counter[index].size += 1;
                }
                else
                {
                    counter.push({color:selection[filteredSelection[i]].color, name:selection[filteredSelection[i]].name, size:1});
                }
                
            }
            
            for (var i = 0; i < counter.length; i++)
            {
                var txtLabel = document.createElement("H0");
                txtLabel.innerHTML = "<b><font color="+counter[i].color+">   " + counter[i].name + ":  </b>"+ counter[i].size+ " espécime(s) selecionados</font><br>";
                parent_div.appendChild(txtLabel);
                labels.push(txtLabel);
                //dataset.push({name: selection[filteredSelection[i]].name, size: selection[filteredSelection[i]].children.length, color:selection[filteredSelection[i]].color});
            }
            
                
        }
        else
        {
            for (var i = 0; i < selection.length; i++)
            {
                if(selection[i].characters)
                {
                    var txtLabel = document.createElement("H0");
                    txtLabel.innerHTML = "<b><font color="+selection[i].color+">   " + selection[i].name + ":  </b>"+ selection[i].children.length+ " espécime(s) selecionados</font><br>";
                    parent_div.appendChild(txtLabel);
                    labels.push(txtLabel);
                    //dataset.push({name: selection[i].name, size: selection[i].children.length, color:selection[i].color});
                }
            }
        }
    }

    this.removeAll = function()
    {
         for (var i = 0; i < labels.length; i++)
         {
            parent_div.removeChild(labels[i]);
         }
         labels = [];
    }
    
    
    /*
    console.log(dataset);
    var xScale = d3.scale.ordinal();
    xScale.domain(d3.range(dataset.length));
    xScale.rangeRoundBands([0,w],0.05);
    
    var yScale = d3.scale.linear();
    yScale.domain([0,d3.max(dataset,function(d)
    {
            return d.size;     
    })]);
    yScale.range([0,h]);
   
    svg_selected_specimens_number.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")               
        .attr("x",function(d,i){return xScale(i);})
        .attr("y",function(d){return h - yScale(d.size);})
        .attr("width",xScale.rangeBand())
        .attr("height",function(d){return yScale(d.size);})
        .attr("fill", function(d){return d.color});;
    
    svg_selected_specimens_number.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d){return d.size;})
        .attr("text-anchor","middle")
        .attr("x",function(d,i){return xScale(i) + ((w) / dataset.length - barPadding) / 2;})
        .attr("y",function(d){return h - yScale(d.size)+14;})
        .attr("font-family", "Lucida Console")
        .attr("font-size", "11px")
        .attr("fill", "black");*/

}