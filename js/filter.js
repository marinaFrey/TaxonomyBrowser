/*
 * Class for the filtering popup
 * creates filters dynamically, handling creation, edition and removal
 */
function FilterPopup()
{
	var infoLabel;
	var addButton;
	var measuresList;
    // options for filtering numeric variables
	var operationsListNumeric = [{name:"exists",isNum:false},
                                    {name:"doesn't exist",isNum:false},
                                    {name:"is",isNum:true},
                                    {name:"is not",isNum:true},
                                    {name:"is smaller than",isNum:true},
                                    {name:"is bigger than",isNum:true},
                                    {name:"is smaller or equal to",isNum:true},
                                    {name:"is bigger or equal to",isNum:true}];
    // options for filtering string variables
	var operationsListString = ["exists","doesn't exist","is", "is not"];
	var ptr = this;
	
    /*
     * Creates popup with only a button to add a filter and title
     */
	this.create = function()
	{
        // creating title
		var txtLabel = document.getElementById("filterModalLabel");
		txtLabel.className = "modal-title";
		txtLabel.innerHTML = "<h1> Filters </h1>";
		
		infoLabel = document.getElementById("filters_info");
		infoLabel.innerHTML = "";

        // creating add filter button
		addButton=document.createElement("img");
		addButton.setAttribute('src', 'images/add.png');
		addButton.style.width= '64px';
		addButton.style.width= '64px';
		document.getElementById("filters_add_button").appendChild(addButton);
		addButton.onclick = function()
		{
			ptr.addFilter();
		};
		
		
	}
    
	/*
     * Adding filter to popup and filter list
     */
	this.addFilter = function()
	{
        // creating input for the filter and delete icon
		var comboMeasure = new ComboBox();
        var comboOption = new ComboBox();
        var input = document.createElement("input");
        var oImg=document.createElement("img");
        var br = document.createElement("br");
        
        // populating combobox with all measures and additional information
		comboMeasure.createFilterCombo("comboMeasure", function(){});
		comboMeasure.updateOptions([{name:"Collection ID", isNum:false},
                                    {name:"Collected by", isNum:false},
                                    {name:"Data", isNum:false},
                                    {name:"Latitude", isNum:true},
                                    {name:"Longitude", isNum:false}
                                    ].concat(generateMeasuresList()));
        
        // handling combobox to select the filtering used
		comboOption.createFilterCombo("comboOption", function()
		{
            // if option does not need further input, hide text input
			if(comboOption.getSelectedOption() == "exists" || comboOption.getSelectedOption() == "doesn't exist")
				input.disabled = true;
			else
				input.disabled = false;
			
            // checks if option selected is only for numeric values and stores the answer for further use
            var indexInList = operationsListNumeric.map(function(e) { return e.name; }).indexOf(comboOption.getSelectedOption())
            if(operationsListNumeric[indexInList].isNum)
                comboOption.setNumericDataType(true);
            else
                comboOption.setNumericDataType(false);
		});
		comboOption.updateOptions(operationsListNumeric);

        input.type = "text";
		input.disabled = true;
		input.addEventListener("input", function()  // ou "change" se soh chama quando troca de contexto
		{
            // checks if input is not a number and warns user when filtering option is only for numeric values
			if(comboOption.isNumeric())
			{
				if(isNaN(parseFloat(input.value)))
				{
                    input.style.borderColor="red";
				}
				else
				{
                    input.style.borderColor="#ddd";
				}
			}
		});
        infoLabel.appendChild(input);
        
        // adding remove icon
		oImg.setAttribute('src', 'images/remove.png');
		oImg.style.width= '32px';
		oImg.style.width= '32px';
		oImg.onclick = function()
		{
			ptr.removeFilter(comboMeasure, comboOption, input, br, this);
		};
		infoLabel.appendChild(oImg);
		infoLabel.appendChild(br);
		
        // adding filter to filter list
		filters.push({comboMeasure: comboMeasure, comboOption: comboOption, input: input});
	}
	/*
     * Removes filter from list and interface
     */
	this.removeFilter = function(comboM, comboO, inputLine, br, rmvButton)
	{
		infoLabel.removeChild(rmvButton);
		comboM.remove("filters_info");
		comboO.remove("filters_info");
		infoLabel.removeChild(inputLine);
		infoLabel.removeChild(br);
		filters.splice(filters.map(function(e) {return e.comboMeasure; }).indexOf(comboM),1);
		
	}
	/*
     * Shows popup
     */
	this.show = function()
	{
		$('#filterModal').modal('show');
	}
}

/*
 * Function used when using remove filters button from the interface
 * Removes all filters from the visualizations but keeps the filtering list to be applied again
 */
function removeFilters()
{
    //updateShownVisualizationAndOptions();
    filteredSelection = [];
    filteredSelection.push("all");
    selectedSpecimenViz.update();
    //selectedNumber.update();
    
    if(selection.length == 0)
    {
        document.images["nosel"].style = "display:block;";
        document.getElementById("sel_viz").style = "display:none;";
        document.getElementById("maps").style = "display:none;";
    }
    else
    {
        document.images["nofiltersel"].style = "display:none;";
        document.images["nosel"].style = "display:none;";
        
        var newOptionsList = [{name:"Collection ID", isNum:false},
                                {name:"Collected by", isNum:false},
                                {name:"Data", isNum:false},
                                {name:"Latitude", isNum:true},
                                {name:"Longitude", isNum:false}
                             ].concat(generateMeasuresList());
        updateFilterOptions(newOptionsList);

        
        switch(active_visualization)
        {
            case SELECTED_VIZ:
                showBars();
            break;
            
            case SCATTERPLOT_VIZ:		
            break;
            
            case COORD_PARAL_VIZ:
                showParallelCoord();          
            break;
            
            case DOTS_VIZ:
                showDots();
            break;
            
            case MAPS_VIZ:
                showMap();
            break;
        }
    }
}

/*
 * Applies all created filters on the selected specimens
 * Remaining specimens should be consistent to ALL filters applied
 */
function applyFilters()
{
    // cleans current filtered selection
    filteredSelection = [];
    var characterLst = allCharactersList.getList();
	
    for (var i = 0; i < selection.length; i++)
    {
        //if(selection[i].measures)
        {
            // if this variable is false the specimen will be rejected and not added to the filtered list
            var accept = true;
            for (var k = 0; k < filters.length && accept; k++)
            {
                // gets filter from filters list
                var measure = filters[k].comboMeasure.getSelectedOption();
                var option = filters[k].comboOption.getSelectedOption();
                var value = filters[k].input.value;

                // tests if filter is true depending on selected filter and measure
                switch(option)
                {
                    case "exists":
                    
						switch(measure)
						{
							case "Collection ID":
								if(selection[i].collection_id == "") 
								{
									accept = false;
								}  
							break;
							
							case "Collected by":
							
								if(selection[i].collected_by == "") 
								{
									accept = false;
								}  
							
							break;
							
							case "Data":
							
								if(selection[i].collected_data == "") 
								{
									accept = false;
								}  
								
							break;
							
							case "Latitude":
							
								if(selection[i].latitude == "") 
								{
									accept = false;
								}  
							
							break;
							
							case "Longitude":
							
								if(selection[i].longitude == "") 
								{
									accept = false;
								}  
							
							break;
							
                            // default are all measures
							default:
                                if(selection[i].measures)
                                {
                                    var exists = false;
                                    // gets measure that needs filtering
                                    //for(var j = 0; j < selection[i].measures.length; j++)
									for(var charId_key in  selection[i].measures) 
                                    {
                                        if(characterLst[charId_key].character_name == measure) 
                                        {
                                            exists = true;
                                        }  
                                    }
                                    if(exists == false)
                                        accept = false;
                                }
							break;
						}
                        
                    break;
                    case "doesn't exist":
						switch(measure)
						{
							case "Collection ID":
								if(selection[i].collection_id != "") 
								{
									accept = false;
								}  
							break;
							
							case "Collected by":
							
								if(selection[i].collected_by != "") 
								{
									accept = false;
								}  
							
							break;
							
							case "Data":
							
								if(selection[i].collected_data != "") 
								{
									accept = false;
								}  
								
							break;
							
							case "Latitude":
							
								if(selection[i].latitude != "") 
								{
									accept = false;
								}  
							
							break;
							
							case "Longitude":
							
								if(selection[i].longitude != "") 
								{
									accept = false;
								}  
							
							break;
							// default are all measures
							default:
								if(selection[i].measures)
                                {
                                    var exists = false;
                                    //for(var j = 0; j < selection[i].measures.length; j++)
									for(var charId_key in  selection[i].measures) 
                                    {
                                        if(characterLst[charId_key].character_name == measure) 
                                        {
                                            exists = true;
                                        }  
                                    }
                                    if(exists == true)
                                        accept = false;
								}
							break;
						}
 
                    break;
                    case "is":
					
						switch(measure)
						{
							case "Collection ID":
								if(selection[i].collection_id != value) 
								{
									accept = false;
								}  
							break;
							
							case "Collected by":
							
								if(selection[i].collected_by !=  value) 
								{
									accept = false;
								}  
							
							break;
							
							case "Data":
							
								if(selection[i].collected_data !=  value) 
								{
									accept = false;
								}  
								
							break;
							
							case "Latitude":
							
								if(selection[i].latitude !=  value) 
								{
									accept = false;
								}  
							
							break;
							
							case "Longitude":
							
								if(selection[i].longitude !=  value)  
								{
									accept = false;
								}  
							
							break;
							// default are all measures
							default:
								if(selection[i].measures)
                                {
                                    var exists = false;
                                    //for(var j = 0; j < selection[i].measures.length; j++)
                                    for(var charId_key in  selection[i].measures) 
									{
                                        if(filters[k].comboOption.isNumeric())
                                        {
                                            if((characterLst[charId_key].character_name == measure) && (parseFloat(selection[i].measures[charId_key]) == parseFloat(value))) 
                                            {
                                                exists = true;
                                            }  
                                        }
                                        else
                                        {
                                            if((characterLst[charId_key].character_name == measure) && (selection[i].measures[charId_key] == value)) 
                                            {
                                                exists = true;
                                            }  
                                        }
                                        
                                    }
                                    if(exists == false)
                                        accept = false;
                                }
							break;
						}
                        
                    break;
                    
                    case "is not":
						switch(measure)
						{
							case "Collection ID":
								if(selection[i].collection_id == value) 
								{
									accept = false;
								}  
							break;
							
							case "Collected by":
							
								if(selection[i].collected_by ==  value) 
								{
									accept = false;
								}  
							
							break;
							
							case "Data":
							
								if(selection[i].collected_data ==  value) 
								{
									accept = false;
								}  
								
							break;
							
							case "Latitude":
							
								if(selection[i].latitude ==  value) 
								{
									accept = false;
								}  
							
							break;
							
							case "Longitude":
							
								if(selection[i].longitude ==  value)  
								{
									accept = false;
								}  
							
							break;
							// default are all measures
							default:
								
                                if(selection[i].measures)
                                {
                                    var exists = false;
                                    //for(var j = 0; j < selection[i].measures.length; j++)
                                    for(var charId_key in  selection[i].measures)
									{
                                        if(filters[k].comboOption.isNumeric())
                                        {
                                        console.log("numeric");
                                            if((characterLst[charId_key].character_name == measure) && (parseFloat(selection[i].measures[charId_key]) == parseFloat(value))) 
                                            {
                                            
                                                exists = true;
                                            }  
                                        }
                                        else
                                        {
                                            if((characterLst[charId_key].character_name == measure) && (selection[i].measures[charId_key] == value)) 
                                            {
                                                exists = true;
                                            }  
                                        }
                                        
                                    }
                                    if(exists == true)
                                        accept = false;
                                }
							break;
						}
                        
                    
                    break;
                    // has to be numeric
                    case "is smaller than":
                        if(selection[i].measures)
                        {
                            var exists = false;
                            //for(var j = 0; j < selection[i].measures.length; j++)
                            for(var charId_key in  selection[i].measures)
							{
                                if((characterLst[charId_key].character_name == measure) && (parseFloat(selection[i].measures[charId_key]) < parseFloat(value))) 
                                {
                                    exists = true;
                                }         
                            }
                            if(exists == false)
                                accept = false;
                        }
                    break;
                    // has to be numeric
                    case "is bigger than":
                        if(selection[i].measures)
                        {
                            var exists = false;
                            //for(var j = 0; j < selection[i].measures.length; j++)
							for(var charId_key in  selection[i].measures)
                            {
                                if((characterLst[charId_key].character_name == measure) && (parseFloat(selection[i].measures[charId_key]) > parseFloat(value))) 
                                {
                                    exists = true;
                                }         
                            }
                            if(exists == false)
                                accept = false;
                        }
                        
                    break;
                    // has to be numeric
                    case "is smaller or equal to":
                        if(selection[i].measures)
                        {
                            var exists = false;
                            //for(var j = 0; j < selection[i].measures.length; j++)
                            for(var charId_key in  selection[i].measures)
							{
                                if((characterLst[charId_key].character_name == measure) && (parseFloat(selection[i].measures[charId_key]) <= parseFloat(value))) 
                                {
                                    exists = true;
                                }         
                            }
                            if(exists == false)
                                accept = false;
                        }
                    break;
                    // has to be numeric
                    case "is bigger or equal to":
                        if(selection[i].measures)
                        {
                            var exists = false;
                            //for(var j = 0; j < selection[i].measures.length; j++)
                            for(var charId_key in  selection[i].measures)
							{
                                if((characterLst[charId_key].character_name == measure) && (parseFloat(selection[i].measures[charId_key]) >= parseFloat(value))) 
                                {
                                    exists = true;
                                }         
                            }
                            if(exists == false)
                                accept = false;
                        }
                    break;
                }
                
            }
            if(accept == true)
            {
                // adds index of specimen in the "selected" list as entry to "filteredSelection" list
                // this new list will be used as index to the original, saving memory and keeping both lists
                filteredSelection.push(i);
            }
        }
    }
    
    // update currently showing visualizations with new filter
	updateFromFiltering();
    $('#filterModal').modal('hide');
}

/*
 * When changed selection on sunburst updates measure options on all filtering comboboxes
 * mantaining previous selection
 */
function updateFilterOptions(newOptions)
{
	for (var i = 0; i < filters.length; i++)
	{
		filters[i].comboMeasure.updateOptions(newOptions);
	}
}

