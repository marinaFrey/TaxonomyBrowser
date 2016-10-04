/*
 * Gets analysis from filtered results and shows it in bootstrap's popup
 */
function Analysis()
{
    var analysisList = [];
    var counting;
    var measureCombo;
    var populationSize = 0;
    
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
        
        this.createAnalysis("Average: ", this.calculateAverage);
        this.createAnalysis("Standard Deviation: ", this.calculateAverage);

    }
    
    this.show = function()
    {
        this.recalculateAnalysis();
        $('#analysisModal').modal('show');
    }
    
    this.update = function()
    {
        populationSize = counting.updateInAnalysis();
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
        console.log(analysisList);
    }

    this.recalculateAnalysis = function()
    {
        selectedMeasure = measureCombo.getSelectedOption();
        
        for (var i = 0; i < analysisList.length; i++)
        {
            analysisList[i].analysisFunction();
        }
    }

    this.calculateAverage = function()
    {
        var sum = 0;
        var meaningfulPopulation = 0;
        var accepted;
        console.log("HELLO GUYS");
        
        if(filteredSelection[0] != "all")
        {
            console.log(filteredSelection);
            for (var i = 0; i < filteredSelection.length; i++)
            {
                if(selection[filteredSelection[i]].measures)
                {
                    accepted = false;
                    for(var j = 0; j < selection[filteredSelection[i]].measures.length; j++)
                    {
                        var measureName = selection[filteredSelection[i]].measures[j].name
                        // getting measure value if they exist for the specimen

                        if(measureName == selectedMeasure)
                        {
                            sum += selection[filteredSelection[i]].measures[j].value;
                            accepted = true;
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
            console.log("SEM SELECAO");
            for (var i = 0; i < selection.length; i++)
            {
                if(selection[i].measures)
                {
                    accepted = false;
                    for(var j = 0; j < selection[i].measures.length; j++)
                    {
                        var measureName = selection[i].measures[j].name
                        // getting measure value if they exist for the specimen

                        if(measureName == selectedMeasure)
                        {
                            console.log("JSDASJDOSAJODJSAODJ");
                            sum += selection[i].measures[j].value;
                            accepted = true;
                        }
                                          
                    }

                    if(accepted)
                    {
                        meaningfulPopulation++;
                    }
                }
            }
        }
        
        console.log(sum);
        console.log(meaningfulPopulation);
        

    }
}
