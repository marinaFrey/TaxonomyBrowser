
function makeCharactersManagerPopup()
{
	console.log("abrindo manager");
	var manager = new CharactersManager();
	manager.createInterface();
}

function CharactersManager()
{
	var temporaryCharacterList;
	var pointer = this;
	
	this.createInterface = function()
	{
		var txtLabel = document.getElementById("myModalLabel");
		txtLabel.className = "modal-title";
		txtLabel.innerHTML = "<h1> Characteristics </h1>";
    
		var submitButton = document.getElementById("submitButton");
		submitButton.style = "display:block;";
		submitButton.onclick = this.submit();
		
		cleanSpecimenMeasuresFromInputList();
		cleanTabs();
		
		var infoLabel = document.getElementById("info_text");
		infoLabel.innerHTML = "add, edit and delete characteristics below: <br>";
		
		var measuresGroupList = {};
		var characterLst = allCharactersList.getList();
		// getting information from all its measures and separating them according to their groups
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
		
		for( var i = 0; i < measuresList.length; i++)
		{
			var newInputMeasures = new Input();
			newInputMeasures.createCharacterForManaging(measuresList[i].type,div, measuresList[i].name, measuresList[i].charId, measuresList[i].charTypeId, "", measuresList[i].information,rmvFunction);

			inputList[label].push(newInputMeasures);
		}
		
		var btn_div = document.createElement('div');
		btn_div.setAttribute('class',"col-sm-1");
		var side_div = document.createElement('div');
		side_div.setAttribute('class',"col-sm-11");
		side_div.setAttribute('height',"64px");
		var addBtn = document.createElement("img");
		addBtn.setAttribute('src', 'images/add.png');
		addBtn.style= "text-align: left; width:64px; height:64px;";
		addBtn.group = label;
		addBtn.div_ptr = div
		addBtn.pointer = this;
		addBtn.onclick = this.addCharacter;
		btn_div.appendChild(addBtn);
		div.appendChild(btn_div);
		div.appendChild(side_div);
		
		
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
		newInputMeasures.createCharacterForManaging("",this.div_ptr, "", "", "", "", "",this.pointer.removeCharacter);

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
	
	}
	
}