/*
 * Class for the filtering popup
 * creates filters dynamically, handling creation, edition and removal
 */
function FilterPopup()
{
	var infoLabel;
	var addButton;
	var measuresList;
	var toBeDeletedList;
    // options for filtering numeric variables
	var operationsListNumeric = [{name:"exists",isNum:false},
                                    {name:"doesn't exist",isNum:false},
                                    {name:"is",isNum:true},
                                    {name:"is not",isNum:true},
                                    {name:"is smaller than",isNum:true},
                                    {name:"is greater than",isNum:true},
                                    {name:"is smaller or equal to",isNum:true},
                                    {name:"is greater or equal to",isNum:true}];
    // options for filtering string variables
	var operationsListString = [{name:"exists",isNum:false},
                                {name:"doesn't exist",isNum:false},{name:"is",isNum:true}, 
                                {name:"is not",isNum:true}];
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
		var main_div = document.createElement('div');
		var space_div = document.createElement('div');
		space_div.setAttribute('class',"col-sm-1");
		space_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(space_div);
		var measure_div = document.createElement('div');
		measure_div.setAttribute('class',"col-sm-4");
		main_div.appendChild(measure_div);
		var option_div = document.createElement('div');
		option_div.setAttribute('class',"col-sm-3");
		option_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(option_div);
		var label_div = document.createElement('div');
		label_div.setAttribute('class',"col-sm-3");
		label_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(label_div);
		var rmv_div = document.createElement('div');
		rmv_div.setAttribute('class',"col-sm-1");
		main_div.appendChild(rmv_div);
		infoLabel.appendChild(main_div);
		
        // creating input for the filter and delete icon
		var comboMeasure = new ComboBox();
        var comboOption = new ComboBox();
        var input = document.createElement("input");
        var oImg=document.createElement("img");
        var br = document.createElement("br");
        var check = document.createElement("img");
		
		check.setAttribute('src', 'images/checked.png');
		check.style.width= '32px';
		check.style.width= '32px';
		check.style.opacity = 0;
		space_div.appendChild(check);
		
        // populating combobox with all measures and additional information
		comboMeasure.createFilterCombo("comboMeasure", measure_div, function()
        {
			check.hasBeenApplied = false;
			check.style.opacity = 0;
			if(comboMeasure.getGroupName() == ACCESS_OPTION_NAME)
			{
				comboOption.changeStyle("opacity:0;");

			}
			else
			{
				comboOption.changeStyle("opacity:1;");
				if(comboMeasure.isNumeric())
					comboOption.updateOptions(operationsListNumeric);
				else
					 comboOption.updateOptions(operationsListString);
			}
        });
		
		
		initialOptList = createStandardOptionsList();
		comboMeasure.updateOptions(initialOptList.concat(generateMeasuresList()));
        
        // handling combobox to select the filtering used
		comboOption.createFilterCombo("comboOption", option_div, function()
		{
            // if option does not need further input, hide text input
			if(comboOption.getSelectedOption() == "exists" || comboOption.getSelectedOption() == "doesn't exist")
				input.disabled = true;
			else
				input.disabled = false;
			
            // checks if option selected is only for numeric values and stores the answer for further use
            /*
            var indexInList = operationsListNumeric.map(function(e) { return e.name; }).indexOf(comboOption.getSelectedOption())
            if(operationsListNumeric[indexInList].isNum)
                comboOption.setNumericDataType(true);
            else
                comboOption.setNumericDataType(false);*/
		});
		comboOption.updateOptions(operationsListNumeric);

        input.type = "text";
		input.disabled = true;
		input.size = 25;
		input.addEventListener("input", function()  // ou "change" se soh chama quando troca de contexto
		{
            // checks if input is not a number and warns user when filtering option is only for numeric values
			if(comboMeasure.isNumeric())
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
            else
            {
                input.style.borderColor="#ddd";
            }
		});
        label_div.appendChild(input);
        
        // adding remove icon
		oImg.setAttribute('src', 'images/remove.png');
		oImg.style.width= '32px';
		oImg.style.width= '32px';
		oImg.onclick = function()
		{
			ptr.removeFilter(comboMeasure, comboOption, input, br, check, this);
		};
		rmv_div.appendChild(oImg);
		main_div.appendChild(br);
		
        comboMeasure.makeClick();
        
        // adding filter to filter list
		filters.push({check: check, comboMeasure: comboMeasure, comboOption: comboOption, input: input, br:br, rmvButton:oImg});
	}
	/*
     * Removes filter from list and interface
     */
	this.removeFilter = function(comboM, comboO, inputLine, br, check, rmvButton)
	{

		comboM.setOpacity(0);
		comboO.setOpacity(0);	
		inputLine.style.opacity = 0;
		rmvButton.style.opacity = 0;
		check.style.opacity = 0;
		inputLine.toBeDeleted = true;
		
		/*
		var comboMeasureParentDiv = comboM.getParentDiv();
		while (comboMeasureParentDiv.hasChildNodes()) 
		{
			comboMeasureParentDiv.removeChild(comboMeasureParentDiv.lastChild);
		}
		comboMeasureParentDiv.remove();
		
		var comboOptionParentDiv = comboO.getParentDiv();
		while (comboOptionParentDiv.hasChildNodes()) 
		{
			comboOptionParentDiv.removeChild(comboOptionParentDiv.lastChild);
		}
		comboOptionParentDiv.remove();
		
		var comboLabelParentDiv = inputLine.parentNode;
		while (comboLabelParentDiv.hasChildNodes()) 
		{
			comboLabelParentDiv.removeChild(comboLabelParentDiv.lastChild);
		}
		comboLabelParentDiv.remove();
		
		var comboRmvButtonParentDiv = rmvButton.parentNode;
		while (comboRmvButtonParentDiv.hasChildNodes()) 
		{
			comboRmvButtonParentDiv.removeChild(comboRmvButtonParentDiv.lastChild);
		}
		comboRmvButtonParentDiv.remove();
		
		var comboBrParentDiv = br.parentNode;
		while (comboBrParentDiv.hasChildNodes()) 
		{
			comboBrParentDiv.removeChild(comboBrParentDiv.lastChild);
		}
		comboBrParentDiv.remove();*/
	
		
		//filters.splice(filters.map(function(e) {return e.comboMeasure; }).indexOf(comboM),1);
		//applyFilters();
		//$('#filterModal').modal('show');
	}
	/*
     * Shows popup
     */
	this.show = function()
	{
		for (var i = 0; i < filters.length; i++)
		{
			if(filters[i].comboMeasure.getGroupName() != "ACCESS")
			{
				filters[i].comboOption.setOpacity(1);
				filters[i].input.style.opacity = 1;
			}

			filters[i].comboMeasure.setOpacity(1);
			filters[i].rmvButton.style.opacity = 1;
			filters[i].input.toBeDeleted = false;
			
			if(filters[i].check.hasBeenApplied)
				filters[i].check.style.opacity = 1;
			else
				filters[i].check.style.opacity = 0;
		}
		
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
        
        var newOptionsList = createStandardOptionsList().concat(generateMeasuresList());
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
	for (var i =  filters.length-1; i >= 0; i--)
	{
		if(filters[i].input.toBeDeleted)
		{
			var comboMeasureParentDiv = filters[i].comboMeasure.getParentDiv();
			while (comboMeasureParentDiv.hasChildNodes()) 
			{
				comboMeasureParentDiv.removeChild(comboMeasureParentDiv.lastChild);
			}
			comboMeasureParentDiv.remove();
			
			var comboOptionParentDiv = filters[i].comboOption.getParentDiv();
			while (comboOptionParentDiv.hasChildNodes()) 
			{
				comboOptionParentDiv.removeChild(comboOptionParentDiv.lastChild);
			}
			comboOptionParentDiv.remove();
			
			var comboLabelParentDiv = filters[i].input.parentNode;
			while (comboLabelParentDiv.hasChildNodes()) 
			{
				comboLabelParentDiv.removeChild(comboLabelParentDiv.lastChild);
			}
			comboLabelParentDiv.remove();
			
			var comboRmvButtonParentDiv = filters[i].rmvButton.parentNode;
			while (comboRmvButtonParentDiv.hasChildNodes()) 
			{
				comboRmvButtonParentDiv.removeChild(comboRmvButtonParentDiv.lastChild);
			}
			comboRmvButtonParentDiv.remove();
			
			var comboBrParentDiv = filters[i].br.parentNode;
			while (comboBrParentDiv.hasChildNodes()) 
			{
				comboBrParentDiv.removeChild(comboBrParentDiv.lastChild);
			}
			comboBrParentDiv.remove();
			
			filters.splice(filters.map(function(e) {return e.comboMeasure; }).indexOf(filters[i].comboMeasure),1);
			
			//filters.splice(i,1);
		}
		else
		{
			filters[i].check.style.opacity = 1;
			filters[i].check.hasBeenApplied = true;
		}
	}
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
				
				if(filters[k].comboMeasure.getGroupName() == ACCESS_OPTION_NAME)
				{	
					switch(measure)
					{
						case "private (you and administrators)":
							if(!selection[i].user_name || selection[i].group_name)
							{
								accept = false;
							}
						break;
						case "public (everyone)":
							if(selection[i].user_name)
								accept = false;
						break;
						default:
							if(!selection[i].group_name || measure != selection[i].group_name)
								accept = false;
						break;
					}
				}
				else
				{
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
										//console.log("is");
										//for(var j = 0; j < selection[i].measures.length; j++)
										for(var charId_key in  selection[i].measures) 
										{	
											//console.log(filters[k].comboOption.isNumeric());
											if(filters[k].comboMeasure.isNumeric())
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
											if(filters[k].comboMeasure.isNumeric())
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
						case "is greater than":
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
						case "is greater or equal to":
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
			}
            if(accept == true && !selection[i].rank)
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

function createStandardOptionsList()
{
	var initialOptList = [];
	var specimenOptList = [{name:"Collection ID", group: "SPECIMEN INFO", isNum:false},
								{name:"Collected by", group: "SPECIMEN INFO", isNum:false},
								{name:"Data", group: "SPECIMEN INFO", isNum:false},
								{name:"Latitude", group: "SPECIMEN INFO", isNum:true},
								{name:"Longitude", group: "SPECIMEN INFO", isNum:true}
								];
	if(userLoggedIn)
		initialOptList = initialOptList.concat(userLoggedIn.getUserGroupsAsOptionList());
		
	initialOptList = initialOptList.concat(specimenOptList);
	
	return initialOptList;
}

