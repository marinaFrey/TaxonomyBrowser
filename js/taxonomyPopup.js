var RANK_SPECIES = "7";

function makeTaxonomyPopup(taxonomy)
{
    console.log(taxonomy);
    
    // creating title from taxonomy's name
	var txtLabel = document.getElementById("myModalLabel");
	txtLabel.className = "modal-title";
	txtLabel.innerHTML = "<h1>"+taxonomy.name+" </h1>";

    cleanSpecimenMeasuresFromInputList();
    
	var hierarchylist = [];
	var taxonomicalHierarchy = taxonomy;
	while(taxonomicalHierarchy)
	{
		hierarchylist.push(taxonomicalHierarchy.name);
		taxonomicalHierarchy = taxonomicalHierarchy.parent;
	}

	var hierarchylistString = "<h4>";
	for(var i = hierarchylist.length-1; i >= 0; i--)
	{
		hierarchylistString += hierarchylist[i];
		if(i != 0)
			hierarchylistString += " -> ";
		else
			hierarchylistString += " <\h4><br>"
	}
	
    // adding standard specimen information
    var infoLabel = document.getElementById("info_text");
    infoLabel.innerHTML = hierarchylistString;
	
	var ranklist = allRanksList.getList();
	
    var newInput2 = new Input();
    newInput2.create("text",infoLabel, "Name","","",taxonomy.name, "");
    inputList['general_measures'].push(newInput2);
    var newInput3 = new Input();
    newInput3.create("text",infoLabel, "Rank","","",ranklist[taxonomy.rank], "");
    inputList['general_measures'].push(newInput3);
    var newInput4 = new Input();
    newInput4.create("text",infoLabel, "Specimens","","",taxonomy.value , "");
    inputList['general_measures'].push(newInput4);
    var newInput5 = new Input();
    newInput5.create("text",infoLabel, "Information","","", taxonomy.information, "");
	inputList['general_measures'].push(newInput5);

	cleanTabs();
	
	var characterLst = allCharactersList.getList();
	if(taxonomy.characters)
	{
		var measuresGroupList = {};
		// getting information from all its measures and separating them according to their groups
		for(var i = 0; i < taxonomy.characters.length; i++)
		{
			if(measuresGroupList[characterLst[taxonomy.characters[i]].character_group_name])
			{
				measuresGroupList[characterLst[taxonomy.characters[i]].character_group_name].push(
				{
					name: characterLst[taxonomy.characters[i]].character_name, 
					type: characterLst[taxonomy.characters[i]].character_type_name,
					charId: characterLst[taxonomy.characters[i]].character_id,
					charTypeId: characterLst[taxonomy.characters[i]].character_group_id,
					information: characterLst[taxonomy.characters[i]].information,
					selected: true
				});
			}
			else
			{
				var list = [];
				measuresGroupList[characterLst[taxonomy.characters[i]].character_group_name] = list;
				measuresGroupList[characterLst[taxonomy.characters[i]].character_group_name].push(
				{
					name: characterLst[taxonomy.characters[i]].character_name, 
					type: characterLst[taxonomy.characters[i]].character_type_name,
					charId: characterLst[taxonomy.characters[i]].character_id,
					charTypeId: characterLst[taxonomy.characters[i]].character_group_id,
					information: characterLst[taxonomy.characters[i]].information,
					selected: true
				});
			}        
		}
		
		
		for(var charId_key in  characterLst) 
		{	
			if(measuresGroupList[characterLst[charId_key].character_group_name])
			{
				if(measuresGroupList[characterLst[charId_key].character_group_name].map(function(e) { return e.charId; }).indexOf(charId_key) == -1)
				{
					
					measuresGroupList[characterLst[charId_key].character_group_name].push(
					{
						name: characterLst[charId_key].character_name, 
						type: characterLst[charId_key].character_type_name,
						charId: characterLst[charId_key].character_id,
						charTypeId: characterLst[charId_key].character_group_id,
						information: characterLst[charId_key].information,
						selected: false
					});
				}
			}
			else
			{
				var list = [];
				measuresGroupList[characterLst[charId_key].character_group_name] = list;
				measuresGroupList[characterLst[charId_key].character_group_name].push(
				{
					name: characterLst[charId_key].character_name, 
					type: characterLst[charId_key].character_type_name,
					charId: characterLst[charId_key].character_id,
					charTypeId: characterLst[charId_key].character_group_id,
					information: characterLst[charId_key].information,
					selected: false
				});
			}        
		}

		var i = 0;
		for (var key in measuresGroupList) 
		{
			var tab_id = key.replace(/\s+/g, '');
			addCharactersTab(tab_id,key,measuresGroupList[key]);
		}
	
	}
	
	var submitButton = document.getElementById("submitButton");
    submitButton.style = "display:none;";
	
	var editTaxonomyButton = document.getElementById("editSpecimenButton");
    editTaxonomyButton.style = "display:block;";
    editTaxonomyButton.onclick = function(){return editTaxonomyFields(taxonomy);};
    
    var removeTaxonomyButton = document.getElementById("removeSpecimenButton");
    removeTaxonomyButton.style = "display:block;";
    removeTaxonomyButton.onclick = function()
    {
        if (confirm("Do you really want to delete this Taxonomy? All it's children will be also removed from the database") == true) 
        {
            removeTaxonomy(taxonomy);
            $('#basicModal').modal('hide');
        }
    };
	
    $('#basicModal').modal('show');
}

function addCharactersTab(id, label, measuresList )
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
            newInputMeasures.createCharacter("text",div, measuresList[i].name, measuresList[i].charId, measuresList[i].charTypeId, "", measuresList[i].information,measuresList[i].selected);
        else
            newInputMeasures.createCharacter("number",div, measuresList[i].name, measuresList[i].charId, measuresList[i].charTypeId, "", measuresList[i].information, measuresList[i].selected);
            
        inputList[label].push(newInputMeasures);
    }
    

    measures_tab_content.appendChild(div);

}

function editTaxonomyFields(taxonomy)
{
	var submitButton = document.getElementById("submitButton");
    submitButton.style = "display:block;";
	
	allowCharactersSelection();
	
	submitButton.onclick = function()
    {
        submitButton.style = "display:none;";
		
        taxonomy.name = inputList['general_measures'][0].getValue();
		inputList['general_measures'][0].toggleEdition(false);
        taxonomy.rank =allRanksList.getIndexByRankname(inputList['general_measures'][1].getValue());
        //specimen.value = inputList['general_measures'][2].getValue();
        taxonomy.information = inputList['general_measures'][3].getValue();
		inputList['general_measures'][3].toggleEdition(false);


        for (var key in inputList) 
        {

			for( var i = 0; i < inputList[key].length; i++)
			{
				if(inputList[key][i].getIfChecked())
				{
					if(taxonomy.characters.indexOf(inputList[key][i].getcharacterID()) == -1)
						taxonomy.characters.push(inputList[key][i].getcharacterID());
				}
				else
				{
					if(taxonomy.characters.indexOf(inputList[key][i].getcharacterID()) != -1)
					{
						taxonomy.characters.splice(taxonomy.characters.indexOf(inputList[key][i].getcharacterID()),1);
					}
				}
				inputList[key][i].toggleTaxonomyEdition(false);
				/*
				var index = taxonomy.characters.map(function(e) { return e.name; }).indexOf(inputList[key][i].getLabelName());
				if(index >= 0)
				{
					// update character
					taxonomy.characters[index].name = inputList[key][i].getValue();
					taxonomy.characters[index].type = inputList[key][i].getType();
					taxonomy.characters[index].information = inputList[key][i].getInformation();
					
				}
				else
				{
					if(inputList[key][i].getValue() != "" && key != 'general_measures')
					{
						// add character
						taxonomy.characters.push(
						{
							name: inputList[key][i].getValue(), 
							type: inputList[key][i].getType(),
							charId: inputList[key][i].getchararacterID(),
							charTypeId: inputList[key][i].getcharacterGroupID(),
							information: inputList[key][i].getInformation()
						});
					}
					else
					{
					
					}
				}
				inputList[key][i].toggleTaxonomyEdition(false);
				*/
			}
            
        }
        console.log(allCharactersList.getList());
        console.log(taxonomy);
        editTaxonomy(taxonomy);
    };
}

function allowCharactersSelection()
{
	for (var key in inputList) 
    {
        for( var i = 0; i < inputList[key].length; i++)
        {
            inputList[key][i].toggleTaxonomyEdition(true);

			if(key == 'general_measures' && 
				(inputList[key][i].getLabelName() == "Name" || inputList[key][i].getLabelName() == "Information"))
				inputList[key][i].toggleEdition(true);
        }
    }
}