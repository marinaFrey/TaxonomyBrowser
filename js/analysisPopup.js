/*
 * Gets analysis from filtered results and shows it in bootstrap's popup
 */
function Analysis()
{
    var analysisList = [];
    var measureCombo;
    
    this.createPopup = function()
    {
        // creating title
        var txtLabel = document.getElementById("analysisModalLabel");
        txtLabel.className = "modal-title";
        txtLabel.innerHTML = "<h1> Analysis </h1>";

        var infoLabel = document.getElementById("analysis_text");
        var br = document.createElement("br");
        infoLabel.appendChild(br);
        
        measureCombo = new ComboBox();
        measureCombo.createAnalysisCombo(1,this.recalculateAnalysis);
        measureCombo.updateOptions(generateNumericMeasuresList());
        
        this.createAnalysis("Average: ", this.calculateAverage);
        this.createAnalysis("Standard Deviation: ", this.calculateAverage);

    }
    
    this.show = function()
    {
        $('#analysisModal').modal('show');
    }
    
    this.update = function()
    {
        measureCombo.updateOptions(generateNumericMeasuresList());
    }

    this.createAnalysis = function(name, analysisFunction)
    {
        txtLabel = document.createElement("H0");
        var t = document.createTextNode(name);
        txtLabel.appendChild(t);
        
        var infoLabel = document.getElementById("analysis_text");
        infoLabel.appendChild(txtLabel);
        //infoLabel.innerHTML = info_text;
        
        var input = document.createElement("input");
        input.type = "text";
        infoLabel.appendChild(input);
        
        var br = document.createElement("br");
        infoLabel.appendChild(br);
        
        analysisList.push({name: name, analysisFunction: analysisFunction, output: input});
        console.log(analysisList);
        //var combo = new ComboBox();
        //combo.createAnalysisCombo(1,analysisFunction);
    }

    this.recalculateAnalysis = function()
    {
        selectedMeasure = measureCombo.getSelectedOption();
        
        for (var i = 0; i < analysisList.length; i++)
        {
            analysisList[i].analysisFunction;
        }
    }

    this.calculateAverage = function()
    {
        console.log("HELLO GUYS");
    }
}
