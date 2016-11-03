/*
 * Gets analysis from filtered results and shows it in bootstrap's popup
 */
function Analysis()
{
    var analysisList = [];
    var counting;
    var measureCombo;
    var populationSize = null;
    var average = null;
    var sum = null;
    var zeroValues = null;
    
    this.createPopup = function()
    {
        // creating title
        var txtLabel = document.getElementById("analysisModalLabel");
        txtLabel.className = "modal-title";
        txtLabel.innerHTML = "<h1> Selected Specimens </h1>";

        var title = document.createElement("H2");
        title.innerHTML = "Counting<br>"; 
        document.getElementById("counting_title").appendChild(title);
        
        counting = new numberOfSelectedViz();
        
        var title = document.createElement("H2");
        title.innerHTML = "Selected Variable Analysis<br>"; 
        document.getElementById("analysis_title").appendChild(title);
        
        var infoLabel = document.getElementById("analysis_text");

        //var br = document.createElement("br");
        //infoLabel.appendChild(br);
        
        measureCombo = new ComboBox();
        measureCombo.createAnalysisCombo(1,this.recalculateAnalysis);
        measureCombo.updateOptions(generateNumericMeasuresList());
        
        
        this.createAnalysis("Number of specimens with this measure populated: ", this.calculatePopulation); 
        this.createAnalysis("Number of specimens with this measure's value equal to zero: ", this.calculateZeroValuesNumber); 
        this.createAnalysis("Average: ", this.calculateAverage);
        this.createAnalysis("Standard Deviation: ", this.calculateStandardDeviation);

    }
    
    this.show = function()
    {
        this.update();
        $('#analysisModal').modal('show');
    }
    
    this.update = function()
    {
        counting.updateInAnalysis();
        measureCombo.updateOptions(generateNumericMeasuresList());
        this.recalculateAnalysis();
    }

    this.createAnalysis = function(name, analysisFunction)
    {
        var infoLabel = document.getElementById("analysis_text");
    
        var txtLabel = document.createElement("H0");
        txtLabel.innerHTML = "<b>" + name + "</b>";
        infoLabel.appendChild(txtLabel);

        var resultLabel = document.createElement("H0");
        resultLabel.innerHTML = "none";
        infoLabel.appendChild(resultLabel);
        
        var br = document.createElement("br");
        infoLabel.appendChild(br);
        
        analysisList.push({name: name, analysisFunction: analysisFunction, output: resultLabel});
        //console.log(analysisList);
    }

    this.recalculateAnalysis = function()
    {
        selectedMeasure = measureCombo.getSelectedOption();
        
        for (var i = 0; i < analysisList.length; i++)
        {
            analysisList[i].analysisFunction(i);
        }
    }

    this.calculatePopulation = function(listIndex)
    {
        sum = 0;
        zeroValues = 0;
        var meaningfulPopulation = 0;
        var accepted;
        var characterLst = allCharactersList.getList();
		
        if(filteredSelection[0] != "all")
        {
            //console.log(filteredSelection);
            for (var i = 0; i < filteredSelection.length; i++)
            {
                if(selection[filteredSelection[i]].measures)
                {
                    accepted = false;
                    //for(var j = 0; j < selection[filteredSelection[i]].measures.length; j++)
					for(var charId_key in  selection[filteredSelection[i]].measures) 
                    {
                        var measureName = characterLst[charId_key].character_name;
                        // getting measure value if they exist for the specimen

                        if(measureName == selectedMeasure)
                        {
                            sum += parseInt(selection[filteredSelection[i]].measures[charId_key]);
                            accepted = true;
                            
                            if(selection[filteredSelection[i]].measures[charId_key] == '0')
                                zeroValues++;
                        }
                                          
                    }

                    if(accepted)
                    {
                        meaningfulPopulation++;
                    }
                }
            }
        }
        else
        {
            for (var i = 0; i < selection.length; i++)
            {
                if(selection[i].measures)
                {
                    accepted = false;
                    //for(var j = 0; j < selection[i].measures.length; j++)
					for(var charId_key in  selection[i].measures) 
                    {
                        var measureName = characterLst[charId_key].character_name;
                        // getting measure value if they exist for the specimen

                        if(measureName == selectedMeasure)
                        {
                            sum += parseInt(selection[i].measures[charId_key]);
                            accepted = true;
                            
                            if(selection[i].measures[charId_key] == '0')
                                zeroValues++;
                        }
                                          
                    }

                    if(accepted)
                    {
                        meaningfulPopulation++;
                    }
                }
            }
        }
        
        populationSize = meaningfulPopulation;
        
        if(populationSize > 0)
        {
            analysisList[listIndex].output.innerHTML = populationSize;
        }
        else
        {
            analysisList[listIndex].output.innerHTML = "none";
        }
    }
    
    this.calculateZeroValuesNumber = function(listIndex)
    {
        if(zeroValues > 0)
        {
            analysisList[listIndex].output.innerHTML = zeroValues;
        }
        else
        {
            analysisList[listIndex].output.innerHTML = "none";
        }
    }
    
    this.calculateAverage = function(listIndex)
    {   
        if(populationSize > 0)
        {
            average = sum / populationSize;
            analysisList[listIndex].output.innerHTML = average;
        }
        else
        {
            analysisList[listIndex].output.innerHTML = "insufficient data available for calculations";
        }
        
        

    }
    
    this.calculateStandardDeviation = function(listIndex)
    {
		var characterLst = allCharactersList.getList();
        if(average != null && populationSize != null)
        {
            var sum = 0;
            
            if(filteredSelection[0] != "all")
            {
                console.log(filteredSelection);
                for (var i = 0; i < filteredSelection.length; i++)
                {
                    if(selection[filteredSelection[i]].measures)
                    {
                        accepted = false;
                        //for(var j = 0; j < selection[filteredSelection[i]].measures.length; j++)
                        for(var charId_key in  selection[filteredSelection[i]].measures) 
						{
                            var measureName = characterLst[charId_key].character_name;
                            // getting measure value if they exist for the specimen

                            if(measureName == selectedMeasure)
                            {
                                sum += Math.pow(parseInt(selection[filteredSelection[i]].measures[charId_key]) - average,2);
                            }
                                              
                        }

                    }
                }
            }
            else
            {
                for (var i = 0; i < selection.length; i++)
                {
                    if(selection[i].measures)
                    {
                        accepted = false;
                        //for(var j = 0; j < selection[i].measures.length; j++)
                        for(var charId_key in  selection[i].measures) 
						{
                            var measureName = characterLst[charId_key].character_name;
                            // getting measure value if they exist for the specimen

                            if(measureName == selectedMeasure)
                            {
                                sum += Math.pow(parseInt(selection[i].measures[charId_key]) - average,2);
                            }
                                              
                        }

                    }
                }
            }
            
            var result = Math.sqrt((1/populationSize) * sum);
            analysisList[listIndex].output.innerHTML = result;
            
        }
        else
        {
            analysisList[listIndex].output.innerHTML = "insufficient data available for calculations";
        }
    }
}
