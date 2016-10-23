function makeAddTaxonomyPopup(parent_taxonomy)
{

    // creating title from taxonomy's name
	var txtLabel = document.getElementById("myModalLabel");
	txtLabel.className = "modal-title";
	txtLabel.innerHTML = "<h1> Add Taxonomy </h1>";

    cleanSpecimenMeasuresFromInputList();
    
	var hierarchylist = [];
	var taxonomicalHierarchy = parent_taxonomy;
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
    newInput2.create("text",infoLabel, "Name","","","", "");
	newInput2.toggleEdition(true);
    inputList['general_measures'].push(newInput2);
    var newInput3 = new Input();
    newInput3.createCombo("text",infoLabel, "Rank","","",  allRanksList.getRankListAsOptions(), "");
	newInput3.toggleEdition(true);
    inputList['general_measures'].push(newInput3);
    var newInput5 = new Input();
    newInput5.create("text",infoLabel, "Information","","", "", "");
	newInput5.toggleEdition(true);
	inputList['general_measures'].push(newInput5);

	cleanTabs();
	
	
	var measuresGroupList = {};
	var characterLst = allCharactersList.getList();
	// getting information from all its measures and separating them according to their groups
	//for(var i = 0; i < characterLst.length; i++)
	for(var charId_key in  characterLst) 
	{	
		if(measuresGroupList[characterLst[charId_key].character_group_name])
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
	
	//console.log(measuresGroupList);
	
	var i = 0;
	for (var key in measuresGroupList) 
	{
		var tab_id = key.replace(/\s+/g, '');
		addCharactersTab(tab_id,key,measuresGroupList[key]);
	}

	var submitButton = document.getElementById("submitButton");
    submitButton.style = "display:block;";
	submitButton.onclick = function(){addTaxonomyFields(parent_taxonomy)};
	
	allowCharactersSelection();
	
	var editTaxonomyButton = document.getElementById("editSpecimenButton");
    editTaxonomyButton.style = "display:none;";

    var removeTaxonomyButton = document.getElementById("removeSpecimenButton");
    removeTaxonomyButton.style = "display:none;";
	
    $('#basicModal').modal('show');
}

function addTaxonomyFields(parent_taxonomy)
{
	var ranklist = allRanksList.getList();

	var taxonomy = {};
	taxonomy.name = inputList['general_measures'][0].getValue();
	taxonomy.rank = allRanksList.getIndexByRankname(inputList['general_measures'][1].getValue());
	//specimen.value = inputList['general_measures'][2].getValue();
	taxonomy.information = inputList['general_measures'][2].getValue();
	taxonomy.characters = [];

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
	console.log(taxonomy);
	addTaxonomy(taxonomy, parent_taxonomy);
	//$('#basicModal').modal('hide');
	makeAddSpecimenPopup(taxonomy);
    
}