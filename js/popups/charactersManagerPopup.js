
function makeCharactersManagerPopup()
{
	if(userLoggedIn && userLoggedIn.getRole() == "1")
	{
		var manager = new CharactersManager();
		manager.createInterface();
	}
	else
	{
		alert("You must be logged in an Administrator account to access the Characteristics Manager");
	}
}

function CharactersManager()
{
	var temporaryCharacterList;
	var toBeDeletedList;
	var pointer = this;
	
	this.createInterface = function()
	{
		var txtLabel = document.getElementById("myModalLabel");
		txtLabel.className = "modal-title";
		txtLabel.innerHTML = "<h1> Characteristics </h1>";
    
		var submitButton = document.getElementById("submitButton");
		submitButton.style = "display:block;";
		submitButton.onclick = this.submit;
		
		cleanSpecimenMeasuresFromInputList();
		cleanTabs();
		
		var infoLabel = document.getElementById("info_text");
		infoLabel.innerHTML = "add, edit and delete characteristics below: <br>";
		
		var measuresGroupList = {};
		var characterLst = allCharactersList.getList();
		// getting information from all its measures and separating them according to their groups
		for(var charId_key in  characterLst) 
		{	
			var stdType;
					if(characterLst[charId_key].character_type_name == "string")
						stdType = "text";
					else
						stdType = "number";
			if(measuresGroupList[characterLst[charId_key].character_group_name])
			{
				
				measuresGroupList[characterLst[charId_key].character_group_name].push(
				{
					name: characterLst[charId_key].character_name, 
					type: stdType,
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
					type: stdType,
					charId: characterLst[charId_key].character_id,
					charTypeId: characterLst[charId_key].character_group_id,
					information: characterLst[charId_key].information,
					selected: false
				});
			}        
		}
		
		this.allowCharactersSelection();
		
		var i = 0;
		for (var key in measuresGroupList) 
		{
			var tab_id = key.replace(/\s+/g, '');
			this.addCharactersForManagingTab(tab_id,key,measuresGroupList[key], this.removeCharacter);
		}
		
		
		
		
		var editTaxonomyButton = document.getElementById("editSpecimenButton");
		editTaxonomyButton.style = "display:none;";

		var removeTaxonomyButton = document.getElementById("removeSpecimenButton");
		removeTaxonomyButton.style = "display:none;";
		
		$('#basicModal').modal('show');
	}
	
	this.addCharactersForManagingTab = function(id, label, measuresList , rmvFunction)
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
		
		var btn_div = document.createElement('div');
		btn_div.setAttribute('class',"col-sm-3");
		var side_div = document.createElement('div');
		side_div.setAttribute('class',"col-sm-9");
		side_div.setAttribute('height',"64px");
		
		var fill = document.createElement("TEXTAREA");
		fill.cols = 50;
		fill.disabled = true;
		//information.disabled = true;
		side_div.appendChild(fill);
		
		var addBtn = document.createElement("img");
		addBtn.setAttribute('src', 'images/add.png');
		addBtn.style= "position: relative;text-align: left;width:64px; height:64px;";
		addBtn.group = label;
		addBtn.groupID = measuresList[0].charTypeId;
		addBtn.div_ptr = div;
		addBtn.addBtn_div = btn_div;
		addBtn.pointer = this;
		addBtn.onclick = this.addCharacter;
		btn_div.appendChild(addBtn);
		div.appendChild(btn_div);
		div.appendChild(side_div);
		
		for( var i = 0; i < measuresList.length; i++)
		{
			var newInputMeasures = new Input();
			newInputMeasures.createCharacterForManaging(measuresList[i].type,div, btn_div, measuresList[i].name, measuresList[i].charId, measuresList[i].charTypeId, "", measuresList[i].information,rmvFunction);
			
			inputList[label].push(newInputMeasures);
		}
		
		
		
		
		measures_tab_content.appendChild(div);

	}
	
	this.allowCharactersSelection = function()
	{
		for (var key in inputList) 
		{
			for( var i = 0; i < inputList[key].length; i++)
			{
				inputList[key][i].toggleCharactersEdition(true);

			}
		}
	}
	
	this.addCharacter = function()
	{
		
		var newInputMeasures = new Input();
		newInputMeasures.createCharacterForManaging("",this.div_ptr, this.addBtn_div, "", "", this.groupID, "", "",this.pointer.removeCharacter);

		inputList[this.group].push(newInputMeasures);
	}
	
	this.removeCharacter = function()
	{	
		this.linePointer.toggleToBeDeleted(true);
		this.setAttribute('src', 'images/add.png');
		this.onclick = pointer.undoCharacterRemoval;
	}
	
	this.undoCharacterRemoval = function()
	{
		this.linePointer.toggleToBeDeleted(false);
		this.setAttribute('src', 'images/remove.png');
		this.onclick = pointer.removeCharacter;
	}
	
	this.submit = function()
	{
		console.log("submit");
		for (var key in inputList) 
		{
			for( var i = 0; i < inputList[key].length; i++)
			{
				var character = 
				{
					character_id: inputList[key][i].getcharacterID(),
					character_name: inputList[key][i].getValue(),
					information: inputList[key][i].getInformation(),
					character_group_id: inputList[key][i].getcharacterGroupID(),
					character_type_id: inputList[key][i].getTypeID()
				}

				if(inputList[key][i].willBeDeleted())
				{
					if(character.character_id)
						removeCharacter(character);
				}
				else
				{
					if(!character.character_id)
					{
						var characterLst = allCharactersList.getList();
						var canBeAdded = true;
						for(var charId_key in  characterLst) 
						{
							if(characterLst[charId_key].character_name == character.character_name)
								canBeAdded = false;
						}
						if(canBeAdded )
						{
							if(character.character_name != "")
								addCharacter(character);
							else
								alert("ERROR! The characteristic you are trying to add must have a name! It will not be saved.");
						}
						else
						{
							alert("ERROR! The characteristic you are trying to add already exists! It will not be saved.");
						}
					}
					else	
					{	
						if(inputList[key][i].hasBeenChanged() )
						{
							if(character.character_name != "")
								editCharacter(character);
							else
								alert("ERROR! The characteristic you are trying to add must have a name! It will not be saved.");
						}
					}
				}


			}
		}
		
		$('#basicModal').modal('hide');
	}
	
}