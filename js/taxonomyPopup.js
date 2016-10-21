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
	console.log(hierarchylist);
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
	
    var newInput2 = new Input();
    newInput2.create("text",infoLabel, "Name","","",taxonomy.name, "");
    inputList['general_measures'].push(newInput2);
    var newInput3 = new Input();
    newInput3.create("text",infoLabel, "Rank","","",taxonomy.rank, "");
    inputList['general_measures'].push(newInput3);
    var newInput4 = new Input();
    newInput4.create("text",infoLabel, "Specimens","","",taxonomy.value , "");
    inputList['general_measures'].push(newInput4);
    var newInput5 = new Input();
    newInput5.create("number",infoLabel, "Information","","", taxonomy.information, "");
	inputList['general_measures'].push(newInput5);

	cleanTabs();
	
	if(taxonomy.characters)
	{
		var measuresGroupList = {};
		// getting information from all its measures and separating them according to their groups
		for(var i = 0; i < taxonomy.characters.length; i++)
		{
			if(measuresGroupList[taxonomy.characters[i].group])
			{
				measuresGroupList[taxonomy.characters[i].group].push(
				{
					name: taxonomy.characters[i].name, 
					type: taxonomy.characters[i].type,
					charId: taxonomy.characters[i].charId,
					charTypeId: taxonomy.characters[i].charTypeId,
					information: taxonomy.characters[i].information
				});
			}
			else
			{
				var list = [];
				measuresGroupList[taxonomy.characters[i].group] = list;
				measuresGroupList[taxonomy.characters[i].group].push(
				{
					name: taxonomy.characters[i].name, 
					value: taxonomy.characters[i].value, 
					type: taxonomy.characters[i].type,
					charId: taxonomy.characters[i].charId,
					charTypeId: taxonomy.characters[i].charTypeId,
					information: taxonomy.characters[i].information
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
	var editTaxonomyButton = document.getElementById("editSpecimenButton");
    editTaxonomyButton.style = "display:block;";
    editTaxonomyButton.onclick = function(){return editTaxonomyFields(taxonomy);};
    
    var removeTaxonomyButton = document.getElementById("removeSpecimenButton");
    removeTaxonomyButton.style = "display:block;";
    removeTaxonomyButton.onclick = function()
    {
        if (confirm("Do you really want to delete this Taxonomy? All it's children will be also removed from the database") == true) 
        {
            //removeSpecimen(specimen);
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
            newInputMeasures.createCharacter("text",div, measuresList[i].name, measuresList[i].charId, measuresList[i].charTypeId, "", measuresList[i].information);
        else
            newInputMeasures.createCharacter("number",div, measuresList[i].name, measuresList[i].charId, measuresList[i].charTypeId, "", measuresList[i].information);
            
        inputList[label].push(newInputMeasures);
    }
    

    measures_tab_content.appendChild(div);

}

function editTaxonomyFields(taxonomy)
{
	var submitButton = document.getElementById("submitButton");
    submitButton.style = "display:block;";
	
	for (var key in inputList) 
    {
        for( var i = 0; i < inputList[key].length; i++)
        {
            inputList[key][i].toggleTaxonomyEdition(true);
        }
    }
	
	submitButton.onclick = function()
    {
        submitButton.style = "display:none;";
		
        taxonomy.name = inputList['general_measures'][0].getValue();
        taxonomy.rank = inputList['general_measures'][1].getValue();
        //specimen.value = inputList['general_measures'][2].getValue();
        taxonomy.information = inputList['general_measures'][3].getValue();


        for (var key in inputList) 
        {

                for( var i = 0; i < inputList[key].length; i++)
                {
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
                }
            
        }
        console.log(taxonomy);
        //editSpecimen(specimen);
    };
}