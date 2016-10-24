

function makeAddSpecimenPopup(species)
{
    var txtLabel = document.getElementById("myModalLabel");
	txtLabel.className = "modal-title";
	txtLabel.innerHTML = "<h1> Add Specimen </h1>";
    
    var submitButton = document.getElementById("submitButton");
    submitButton.style = "display:block;";
    
    console.log(node);
    var list = [];
    getTaxNames(species.parent, list);
    
    inputList = [];
    
    var infoLabel = document.getElementById("info_text");
    infoLabel.innerHTML = "select new specimen's taxonomy: <br>";
	
	var hierarchylist = [];
	var taxonomicalHierarchy = species.parent;
	while(taxonomicalHierarchy)
	{
		hierarchylist.push(taxonomicalHierarchy.name);
		taxonomicalHierarchy = taxonomicalHierarchy.parent;
	}

	var hierarchylistString = "";
	for(var i = hierarchylist.length-1; i >= 0; i--)
	{
		hierarchylistString += hierarchylist[i];

		hierarchylistString += " -> ";

	}
	
	var t = document.createTextNode(hierarchylistString);
	var span = document.createElement('span');
	span.style.fontSize = "20px";
	span.appendChild(t);
	infoLabel.appendChild(span);
	//infoLabel.innerHTML += hierarchylistString;
	//infoLabel.style = "float:left;";
    for( var i = 0; i < list.length; i++)
    {
        if(list[i])
        {
            var combo = new ComboBox();
            combo.createTaxonomyCombo(i,infoLabel,changingSelectedTaxonomy, list[i]);
            combo.updateOptions(list[i]);
			combo.setSelectedOption(list[i].map(function(f){return f.name;}).indexOf(species.name));
            combo.makeClick();
            
        }
    }
    var br = document.createElement("br");
    infoLabel.appendChild(br);
    var br2 = document.createElement("br");
    infoLabel.appendChild(br2);
    
    cleanSpecimenMeasuresFromInputList();
    
    // adding standard specimen information
    var newInput2 = new Input();
    newInput2.create("text",infoLabel, "Collection ID","","","", "");
    newInput2.toggleEdition(true);
    inputList['general_measures'].push(newInput2);
    var newInput3 = new Input();
    newInput3.create("text",infoLabel, "Collected by","","","", "");
    newInput3.toggleEdition(true);
    inputList['general_measures'].push(newInput3);
    var newInput4 = new Input();
    newInput4.create("text",infoLabel, "Data","","","" , "");
    newInput4.toggleEdition(true);
    inputList['general_measures'].push(newInput4);
    var newInput5 = new Input();
    newInput5.create("number",infoLabel, "Latitude","","", "", "");
    newInput5.toggleEdition(true);
    inputList['general_measures'].push(newInput5);
    var newInput6 = new Input();
    newInput6.create("number",infoLabel, "Longitude","","","", "");
    newInput6.toggleEdition(true);
    inputList['general_measures'].push(newInput6);
    var newInput7 = new Input();
    newInput7.create("text",infoLabel, "Information","","","", "");
    newInput7.toggleEdition(true);
    inputList['general_measures'].push(newInput7);
    
    
    var editSpecimenButton = document.getElementById("editSpecimenButton");
    editSpecimenButton.style = "display:none;";
    
    var removeSpecimenButton = document.getElementById("removeSpecimenButton");
    removeSpecimenButton.style = "display:none;";
    
    $('#basicModal').modal('show');
}

function getTaxNames(d, list)
{
    for( var i = 0; i < d.children.length; i++)
    {
        if(!list[d.rank])
            list[d.rank] = [];
            
        list[d.rank].push({name: d.children[i].name, isNum: false, taxonomy: d.children[i]});

        if(d.children[i].children && d.children[i].rank != "7")
        {   
            getTaxNames(d.children[i], list);
        }

            
    }
}

function changingSelectedTaxonomy()
{
        var index = this.list.map(function(e) { return e.name; }).indexOf(this.value);
        var taxonomy = this.list[index].taxonomy;
        var fullCharacterList = taxonomy.characters;
		
		console.log(taxonomy);
		
        if(fullCharacterList)
        {
            cleanTabs();
            
            var measuresGroupList = {};
			var characterLst = allCharactersList.getList();
			
			for(var i = 0; i < fullCharacterList.length; i++)
			{
				if(measuresGroupList[characterLst[fullCharacterList[i]].character_group_name])
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
            for (var key in measuresGroupList) 
            {
                var tab_id = key.replace(/\s+/g, '');
                addTab(tab_id,key,measuresGroupList[key]);
            }
            
            for (var key in inputList) 
            {
                for( var i = 0; i < inputList[key].length; i++)
                {
                    inputList[key][i].toggleEdition(true);
                }
            }
        
        
        var submitEditSpecimenButton = document.getElementById("submitButton");
        submitEditSpecimenButton.onclick = function()
        {
            //submitButton.style = "display:none;";
            var specimen = {};
            specimen.rank = "7";
            
			specimen.name = taxonomy.name;
			specimen.taxonomy_id = taxonomy.taxonomy_id;
            specimen.collection_id = inputList['general_measures'][0].getValue();
            specimen.collected_by = inputList['general_measures'][1].getValue();
            specimen.collected_data = inputList['general_measures'][2].getValue();
            specimen.latitude = inputList['general_measures'][3].getValue();
            specimen.longitude = inputList['general_measures'][4].getValue();
            specimen.information = inputList['general_measures'][5].getValue();
            
            specimen.measures = [];
            for (var key in inputList) 
            {

                    for( var i = 0; i < inputList[key].length; i++)
                    {

                        if(inputList[key][i].getValue() != "" && key != 'general_measures')
                        {
							specimen.measures[inputList[key][i].getcharacterID()] = inputList[key][i].getValue();
                        }

                        
                        //inputList[key][i].toggleEdition(false);
                    }
                
            }
            //taxonomy.children.push(specimen);
            addSpecimen(specimen);
			$('#basicModal').modal('hide');
        };
    }
    else
    {
        // TO DO
        // refaz as combos apos essa para que apareçam as opções certas
        // nao sei ainda como vou fazer exatamente...
    }
    
}
