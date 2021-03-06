function numberOfSelectedViz()
{
    /*var w = $("#number_sel_viz").width(),
    h = $("#number_sel_viz").height();
    barPadding = 6; // separation between nodes
    var borderBarPadding = 7;*/
    
    var labels = [];
    var labels_analysis = [];
    var parent_div = document.getElementById("number_sel_viz");
    var analysis_div = document.getElementById("counting_text");
	var counter;
    
    this.update = function()
    {
        
        this.removeAll();
        if(filteredSelection[0] != "all")
        {
            counter = [];
            for (var i = 0; i < filteredSelection.length; i++)
            {
				if(!selection[filteredSelection[i]].rank)
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
                if(selection[i].rank && selection[i].rank == "7")
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
	
	this.getNumberSelectedFromSpecies = function(speciesName)
	{
		if(counter)
		{
			var index = counter.map(function(e) { return e.name; }).indexOf(speciesName);

			if(index != -1)
				return counter[index].size;
			else
				return null;
		}
		else
			return null;
	}

	
    this.removeAll = function()
    {
         for (var i = 0; i < labels.length; i++)
         {
            parent_div.removeChild(labels[i]);
         }
         labels = [];
    }
    
    this.updateInAnalysis = function()
    {
        
        this.removeAllInAnalysis();

        var total = 0;
        //console.log(filteredSelection);
        if(filteredSelection[0] != "all")
        {
            counter = [];
            for (var i = 0; i < filteredSelection.length; i++)
            {
				if(!selection[filteredSelection[i]].rank)
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
                
            }
            
            for (var i = 0; i < counter.length; i++)
            {
					var txtLabel = document.createElement("H0");
					txtLabel.innerHTML = "<b><font color="+counter[i].color+">   " + counter[i].name + ":  </b>"+ counter[i].size+ " selected specimen(s)</font><br>";
					total += counter[i].size;
					analysis_div.appendChild(txtLabel);
					labels_analysis.push(txtLabel);
					//dataset.push({name: selection[filteredSelection[i]].name, size: selection[filteredSelection[i]].children.length, color:selection[filteredSelection[i]].color});

            }
            
                
        }
        else
        {
            counter = [];
            for (var i = 0; i < selection.length; i++)
            {
				if(!selection[i].rank)
				{
					var index = counter.map(function(e) { return e.name; }).indexOf(selection[i].name);
					if(index !=-1)
					{
						counter[index].size += 1;
					}
					else
					{
						counter.push({color:selection[i].color, name:selection[i].name, size:1});
					}
				}
            }   
            
            for (var i = 0; i < counter.length; i++)
            {
                var txtLabel = document.createElement("H0");
                txtLabel.innerHTML = "<b><font color="+counter[i].color+">   " + counter[i].name + ":  </b>"+ counter[i].size+ " selected specimen(s)</font><br>";
                total += counter[i].size;
                analysis_div.appendChild(txtLabel);
                labels_analysis.push(txtLabel);
                //dataset.push({name: selection[filteredSelection[i]].name, size: selection[filteredSelection[i]].children.length, color:selection[filteredSelection[i]].color});
            }
            /*
                if(selection[i].characters)
                {
                    var txtLabel = document.createElement("H0");
                    txtLabel.innerHTML = "<b><font color="+selection[i].color+">   " + selection[i].name + ":  </b>"+ selection[i].children.length+ " selected specimen(s)</font><br>";
                    total += counter[i].size;
                    analysis_div.appendChild(txtLabel);
                    labels_analysis.push(txtLabel);
                    //dataset.push({name: selection[i].name, size: selection[i].children.length, color:selection[i].color});
                }*/
            
        }
        
        var totalLabel = document.createElement("H0");
        totalLabel.innerHTML = "<b> Total:  </b>"+ total + " <br>";
        analysis_div.appendChild(totalLabel);
        labels_analysis.push(totalLabel);
        
        return total;
        
    }
    
    this.removeAllInAnalysis = function()
    {
         for (var i = 0; i < labels_analysis.length; i++)
         {
            analysis_div.removeChild(labels_analysis[i]);
         }
         labels_analysis = [];
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