
var inputList = {};

/*
 * Gets info from selected specimen and shows it in bootstrap's popup
 */
function makeSpecimenPopup(specimen)
{
    // creating title from specimen's name (currently its species)
	var txtLabel = document.getElementById("myModalLabel");
	txtLabel.className = "modal-title";
	txtLabel.innerHTML = "<h1>"+specimen.name+" ( "+ specimen.collection_id +" )</h1>";

    cleanSpecimenMeasuresFromInputList();
	
    // adding standard specimen information
    var infoLabel = document.getElementById("info_text");
	
    var newInput2 = new Input();
    newInput2.create("text",infoLabel, "Collection ID","","",specimen.collection_id, "");
    inputList['general_measures'].push(newInput2);
    var newInput3 = new Input();
    newInput3.create("text",infoLabel, "Collected by","","",specimen.collected_by, "");
    inputList['general_measures'].push(newInput3);
    var newInput4 = new Input();
    newInput4.create("text",infoLabel, "Data","","",specimen.collected_data , "");
    inputList['general_measures'].push(newInput4);
    var newInput5 = new Input();
    newInput5.create("number",infoLabel, "Latitude","","", specimen.latitude, "");
    inputList['general_measures'].push(newInput5);
    var newInput6 = new Input();
    newInput6.create("number",infoLabel, "Longitude","","", specimen.longitude, "");
    inputList['general_measures'].push(newInput6);
    var newInput7 = new Input();
    newInput7.create("text",infoLabel, "Information","","",specimen.information, "");
    inputList['general_measures'].push(newInput7);

    var measuresGroupList = {};
	var characterLst = allCharactersList.getList();
    // getting information from all its measures and separating them according to their groups
	//for(var i = 0; i < specimen.measures.length; i++)
	
	for(var charId_key in  specimen.measures) 
	{
        if(measuresGroupList[characterLst[charId_key].character_group_name])
        {
            measuresGroupList[characterLst[charId_key].character_group_name].push(
            {
				name: characterLst[charId_key].character_name,
				value: specimen.measures[charId_key],
				type: characterLst[charId_key].character_type_name,
				charId: characterLst[charId_key].character_id,
				charTypeId: characterLst[charId_key].character_group_id,
				information: characterLst[charId_key].information
            });
        }
        else
        {
            var list = [];
            measuresGroupList[characterLst[charId_key].character_group_name] = list;
            measuresGroupList[characterLst[charId_key].character_group_name].push(
            {
                name: characterLst[charId_key].character_name,
				value: specimen.measures[charId_key],
				type: characterLst[charId_key].character_type_name,
				charId: characterLst[charId_key].character_id,
				charTypeId: characterLst[charId_key].character_group_id,
				information: characterLst[charId_key].information
            });
        }      
	}
    
    // getting all characteristics inherited from species yet not populated on specimen, to be able to populate when edited

    cleanTabs();

    var i = 0;
    for (var key in measuresGroupList) 
    {
        var tab_id = key.replace(/\s+/g, '');
        addTab(tab_id,key,measuresGroupList[key]);
    }

	var editSpecimenButton = document.getElementById("editSpecimenButton");
	var removeSpecimenButton = document.getElementById("removeSpecimenButton");
    if(userLoggedIn)
	{
		editSpecimenButton.style = "display:block;";
		editSpecimenButton.onclick = function()
		{
			appendNotPopulatedMeasuresToTabs(measuresGroupList,specimen);
			editSpecimenFields(specimen);
		};

		removeSpecimenButton.style = "display:block;";
		removeSpecimenButton.onclick = function()
		{
			if (confirm("Do you really want to delete this specimen? This action can't be undone") == true) 
			{
				removeSpecimen(specimen);
				$('#basicModal').modal('hide');
			}
		};
	}
	else
	{
		editSpecimenButton.style = "display:none;";
		removeSpecimenButton.style = "display:none;";
	}
	var submitButton = document.getElementById("submitButton");
    submitButton.style = "display:none;";
    
    
	$('#basicModal').modal('show');
}

function addTab(id, label, measuresList )
{
    // creating tab list entry
    var measures_tab_list = document.getElementById("measures_tab_list");   
    var list = document.createElement('li');
    if(!measures_tab_list.firstChild)
        list.setAttribute('class',"active");
    var entry = document.createElement('a');
    entry.setAttribute('data-toggle', 'tab');
    entry.setAttribute('href', "#" + id);
    
    entry.innerHTML = label;

    list.appendChild(entry);
    measures_tab_list.appendChild(list);
    
    // creating content entry
    var measures_tab_content = document.getElementById("measures_tab_content");
    var div = document.createElement('div');
    if(!measures_tab_content.firstChild)
        div.setAttribute('class',"tab-pane fade in active");
    else
        div.setAttribute('class', "tab-pane fade");
    div.setAttribute('id', id);
    
    var br = document.createElement("br");
        div.appendChild(br);
    
    var list = [];
    inputList[label] = list;
    
    for( var i = 0; i < measuresList.length; i++)
    {
        var newInputMeasures = new Input();
        if(measuresList[i].type == 'string')
            newInputMeasures.create("text",div, measuresList[i].name, measuresList[i].charId, measuresList[i].charTypeId, measuresList[i].value, measuresList[i].information);
        else
            newInputMeasures.create("number",div, measuresList[i].name, measuresList[i].charId, measuresList[i].charTypeId, measuresList[i].value, measuresList[i].information);
            
        inputList[label].push(newInputMeasures);
    }
    

    measures_tab_content.appendChild(div);

}

function cleanTabs()
{
    var measures_tab_list = document.getElementById("measures_tab_list");
    var measures_tab_content = document.getElementById("measures_tab_content");

    while (measures_tab_list.firstChild) 
    {
        measures_tab_list.removeChild(measures_tab_list.firstChild);
    }
    while (measures_tab_content.firstChild) 
    {
        measures_tab_content.removeChild(measures_tab_content.firstChild);
    }
    
}

function cleanSpecimenMeasuresFromInputList()
{
     // removing all inputs from previous selected specimen
    if(inputList['general_measures'])
    {
        for( var i = 0; i < inputList['general_measures'].length; i++)
        {
            inputList['general_measures'][i].remove();
        }
        inputList['general_measures'] = [];
    }
    else
    {
        var list2 = [];
        inputList['general_measures'] = list2;
    }

}

function editSpecimenFields(specimen)
{
    var submitButton = document.getElementById("submitButton");
    submitButton.style = "display:block;";
	
	
    
    for (var key in inputList) 
    {
        for( var i = 0; i < inputList[key].length; i++)
        {
            inputList[key][i].toggleEdition(true);
        }
    }

    submitButton.onclick = function()
    {
        submitButton.style = "display:none;";
        
        specimen.collection_id = inputList['general_measures'][0].getValue();
        specimen.collected_by = inputList['general_measures'][1].getValue();
        specimen.collected_data = inputList['general_measures'][2].getValue();
        specimen.latitude = inputList['general_measures'][3].getValue();
        specimen.longitude = inputList['general_measures'][4].getValue();
        specimen.information = inputList['general_measures'][5].getValue();
		
        for (var key in inputList) 
        {

                for( var i = 0; i < inputList[key].length; i++)
                {
                    if(inputList[key][i].getcharacterID() in specimen.measures)
                    {
                        specimen.measures[inputList[key][i].getcharacterID()] = inputList[key][i].getValue();
                    }
                    else
                    {
                        if(inputList[key][i].getValue() != "" && key != 'general_measures')
                        {
							specimen.measures[inputList[key][i].getcharacterID()] = inputList[key][i].getValue();
                        }

                    }
                    inputList[key][i].toggleEdition(false);
                }
            
        }
        editSpecimen(specimen);
    };
    
}

function appendNotPopulatedMeasuresToTabs(measuresGroupList, specimen)
{
	var characterLst = allCharactersList.getList();
	var fullCharacterList = specimen.parent.characters;
	var inheritedCharacterList = specimen.parent.inheritedCharacters;
	
	for(var i = 0; i < inheritedCharacterList.length; i++)
	{
		if(measuresGroupList[characterLst[inheritedCharacterList[i]].character_group_name])
		{
			if(!( characterLst[inheritedCharacterList[i]].character_id in specimen.measures))
            {
				measuresGroupList[characterLst[inheritedCharacterList[i]].character_group_name].push(
				{
					name: characterLst[inheritedCharacterList[i]].character_name, 
					value: "",
					type: characterLst[inheritedCharacterList[i]].character_type_name,
					charId: characterLst[inheritedCharacterList[i]].character_id,
					charTypeId: characterLst[inheritedCharacterList[i]].character_group_id,
					information: characterLst[inheritedCharacterList[i]].information
				});
			}
		}
		else
		{
			var list = [];
			measuresGroupList[characterLst[inheritedCharacterList[i]].character_group_name] = list;
			measuresGroupList[characterLst[inheritedCharacterList[i]].character_group_name].push(
			{
				name: characterLst[inheritedCharacterList[i]].character_name, 
				value: "",
				type: characterLst[inheritedCharacterList[i]].character_type_name,
				charId: characterLst[inheritedCharacterList[i]].character_id,
				charTypeId: characterLst[inheritedCharacterList[i]].character_group_id,
				information: characterLst[inheritedCharacterList[i]].information
			});
		}        
	}
	
	for(var i = 0; i < fullCharacterList.length; i++)
	{
		if(measuresGroupList[characterLst[fullCharacterList[i]].character_group_name])
		{
			if(!( characterLst[fullCharacterList[i]].character_id in specimen.measures))
            {
				measuresGroupList[characterLst[fullCharacterList[i]].character_group_name].push(
				{
					name: characterLst[fullCharacterList[i]].character_name, 
					value: "",
					type: characterLst[fullCharacterList[i]].character_type_name,
					charId: characterLst[fullCharacterList[i]].character_id,
					charTypeId: characterLst[fullCharacterList[i]].character_group_id,
					information: characterLst[fullCharacterList[i]].information
				});
			}
		}
		else
		{
			var list = [];
			measuresGroupList[characterLst[fullCharacterList[i]].character_group_name] = list;
			measuresGroupList[characterLst[fullCharacterList[i]].character_group_name].push(
			{
				name: characterLst[fullCharacterList[i]].character_name, 
				value: "",
				type: characterLst[fullCharacterList[i]].character_type_name,
				charId: characterLst[fullCharacterList[i]].character_id,
				charTypeId: characterLst[fullCharacterList[i]].character_group_id,
				information: characterLst[fullCharacterList[i]].information
			});
		}        
	}
	
    cleanTabs();

    var i = 0;
    for (var key in measuresGroupList) 
    {
        var tab_id = key.replace(/\s+/g, '');
        addTab(tab_id,key,measuresGroupList[key]);
    }

}



