var VIZ_COMBO = 0;
var FILTER_COMBO = 1;
var ANALYSIS_COMBO = 2;
var TAXONOMY_COMBO = 3;

/*
 * Class for the comboboxes
 * creates comboboxes dynamically, handling creation, events and removal
 */
function ComboBox()
{
	var combo;
	var txtLabel;
	var id;
	var type;
    var isNum;
	var optionElementList;
	var defaultValue;
    
	/*
     * creates combobox with its name on a label by its right
     */
	this.create = function(name, combo_id)
	{
		id = combo_id;
		
        // creating label with name
		txtLabel = document.createElement("H0");
		var t = document.createTextNode("   " + name + "  ");
		txtLabel.appendChild(t);
		document.getElementById("comboboxes").appendChild(txtLabel);
        
        // creating combobox with provided id
		combo = document.createElement("SELECT");
		combo.setAttribute("id", id);
		document.getElementById("comboboxes").appendChild(combo);
		combo.style.width = '120px';
		type = VIZ_COMBO;
		
        // updates visualization when changing selection
		combo.addEventListener("change", function()
		{  
			updateShownVisualization();
		});
		
	}
	
    /*
     * creates combobox with its name on a label by its right
     * BEFORE a certain HTML element
     */
	this.createBefore = function(name, combo_id, beforeThis)
	{
		id = combo_id;
		
        // creating label with name
		txtLabel = document.createElement("H0");
		var t = document.createTextNode("   " + name + "  ");
		txtLabel.appendChild(t);
		//document.getElementById("comboboxes").appendChild(txtLabel);
		document.getElementById("comboboxes").insertBefore(txtLabel, beforeThis);
    
        // creating combobox with provided id
		combo = document.createElement("SELECT");
		combo.setAttribute("id", id);
		document.getElementById("comboboxes").insertBefore(combo, beforeThis);
		
		type = VIZ_COMBO;
        
		// updates visualization when changing selection
		combo.addEventListener("change", function()
		{
			updateShownVisualization();
		});
	}
    
	/*
     * creates combobox for filtering, no label added
     */
	this.createFilterCombo = function(combo_id,parent, clickFunction)
	{
		id = combo_id;
		combo = document.createElement("SELECT");
		combo.setAttribute("id", id);
        parent.appendChild(combo);
		combo.addEventListener("change", clickFunction);
        combo.clickFunction = clickFunction;
        combo.style.width = '200px';
		type = FILTER_COMBO;
	}
    
    this.createAnalysisCombo = function(combo_id, clickFunction)
    {
        id = combo_id;

		combo = document.createElement("SELECT");
		combo.setAttribute("id", id);
		var parent = document.getElementById("analysis_combos")
        parent.appendChild(combo);
		combo.addEventListener("change", clickFunction);
        var br = document.createElement("br");
        parent.appendChild(br);
        
		
		type = ANALYSIS_COMBO;
    }
    
    this.createTaxonomyCombo = function(combo_id, parent, clickFunction, list)
    {
        id = combo_id;

		combo = document.createElement("SELECT");
		combo.setAttribute("id", "taxonomy_combo"+id);
        combo.list = list;
        parent.appendChild(combo);
		combo.addEventListener("change", clickFunction);
        combo.clickFunction = clickFunction;
        //var br = document.createElement("br");
        //parent.appendChild(br);

		type = TAXONOMY_COMBO;
    }
    
	/*
     * removes all combobox options
     */
	this.clearOptions = function()
	{
        /*
		var i;
		for(i=combo.options.length-1;i>=0;i--)
		{
			combo.remove(i);
		}*/
        while (combo.firstChild) 
        {
            combo.removeChild(combo.firstChild);
        }
	}
	
    /*
     * updates combobox options from list
     */
	this.updateOptions = function(optionList)
	{
        var previouslySelectedOption = this.getSelectedOption();
        var isNewCombo;
            if(combo.options.length > 0)
                isNewCombo = false;
            else
                isNewCombo = true;
                
        // saves current index name so it can remain unaltered if possible
        var newIndex = optionList.map(function(e) { return e.name; }).indexOf(previouslySelectedOption);

        this.clearOptions();
        optionElementList = [];
        if(optionList[0])
        {
            if(optionList[0].group)
            {   
                var groupList = {};
                var newOptList = [];
                for (var i = 0; i < optionList.length; i++)
                {
                    var optgroup = document.createElement("optgroup");
                    optgroup.setAttribute("label", optionList[i].group);
                    
                    groupList[optionList[i].group] = optgroup;
                    
                    //combo.appendChild(optgroup);
                }
                
                // adds options from list
                for (var i = 0; i < optionList.length; i++)
                {
                    var opt = document.createElement("option");
                    opt.isNumber = optionList[i].isNum;
					opt.group = optionList[i].group;

                    var t = document.createTextNode(optionList[i].name);
                    opt.appendChild(t);
                    optionElementList.push(opt);
                    newOptList.push(optionList[i].name);
                    groupList[optionList[i].group].appendChild(opt);
                    //combo.appendChild(opt);
                    this.setNumericDataType(optionList[i].isNum);
                }
                
                for (var key in groupList)
                {
                    combo.appendChild(groupList[key]);
                }
                
                NodeList.prototype.forEach = Array.prototype.forEach
                var children = combo.childNodes;
                children.forEach(function(item)
                {
                    var groupChildren = item.childNodes;
                    groupChildren.forEach(function(optitem)
                    {
                        if(optitem.label == previouslySelectedOption)
                        {
                            optitem.setAttribute("selected", "selected");
                        }
                    });
                });
                
                //newIndex = newOptList.indexOf(previouslySelectedOption);
                //console.log(newIndex);
            }
            else
            {
                // adds options from list
                for (var i = 0; i < optionList.length; i++)
                {
                    var opt = document.createElement("option");
                    opt.isNumber = optionList[i].isNum;
                    var t = document.createTextNode(optionList[i].name);
                    opt.appendChild(t);
                    optionElementList.push(opt);
                    combo.appendChild(opt);
                    this.setNumericDataType(optionList[i].isNum);
                }
                
                // if previous selection still exists keep it unaltered
                if(newIndex != -1)
                    this.setSelectedOption(newIndex);
                else
                {
                    this.setSelectedOption(0);
                    
                    if(type == FILTER_COMBO && isNewCombo == false)
                    {
                        alert("WARNING! Your filters are now invalid to your new selection");
                    }
                    if(type == VIZ_COMBO && isNewCombo == false)
                    {
                        alert("WARNING! Your visualization parameters are now invalid to your new selection");
                    }
                    
                }
            }
            
            
        }
	}
    
	/*
     * get selected combobox option string
     */
	this.getSelectedOption = function()
	{
		if(combo)
			return combo.value;
		else
			return false;
	}
	
	this.getList = function()
	{
		if(combo.list)
			return combo.list;
	}
	
    /*
     * set selected combobox option id
     */
	this.setSelectedOption = function(itemId)
	{
		combo.selectedIndex = itemId;
	}
	
	this.setSelectedOptionByName = function(name)
	{
		var list = combo.options;
		for(var i = 0; i < combo.options.length; i++)
		{
			if(combo.options[i].text == name)
			{
				combo.selectedIndex = i;
			}
		}

	}
	
    this.makeClick = function()
    {
        combo.clickFunction();
    }
	
	this.setDefaultValue = function(value)
	{
		defaultValue = value;
	}
	
	this.getDefaultValue = function()
	{
		return defaultValue;
	}
    
    /*
     * hide combobox
     */
	this.hide = function()
	{
		combo.style.display = 'none';
		txtLabel.style.display = 'none';
	}
	
    /*
     * show combobox
     */
	this.show = function()
	{
		combo.style.display = 'inline';
		txtLabel.style.display = 'inline';
	}
	
    /*
     * remove combobox
     */
	this.remove = function()//(parent)
	{
		combo.remove();
		if(txtLabel)
			txtLabel.remove();
		/*var parent = document.getElementById(parent);
		if(type == VIZ_COMBO)
			parent.removeChild(txtLabel);
		parent.removeChild(combo);*/
	}
	
	this.disable = function(isDisabled)
	{
		combo.disabled = isDisabled;
	}
	
	this.setOpacity = function(opacity)
	{
		combo.style.opacity = opacity;
	}
	
	this.changeStyle = function(style)
	{
		combo.style = style;
	}
    
	this.setSize = function(size)
	{
		combo.style.width = size+"px";
	}
    /*
     * set if combobox is to be used with numeric data
     * used with filtering comboboxes
     */
    this.setNumericDataType = function(dataType)
    {
        isNum = dataType;
    }
    
    /*
     * get if combobox is to be used with numeric data
     * used with filtering comboboxes
     */
    this.isNumeric = function()
    {
		//console.log(combo);
		return optionElementList[combo.selectedIndex].isNumber;
        //return isNum;
    }
	
	this.getGroupName = function()
    {
		return optionElementList[combo.selectedIndex].group;
        //return isNum;
    }
	
	this.getParentDiv = function()
	{
		return combo.parentNode;
	}

}


/*
 * Class for multiple dynamic comboboxes used in parallel coordinates visualization
 * creates comboboxes dynamically, handling creation, events and removal
 */
function MultipleComboboxes()
{
	var combos = [];
	var comboNumber = 0;
	var ptr = this;
	var addButton;
	
    /*
     * creates 3 initial comboboxes and a button so more can be added
     */
	this.initialize = function()
	{
		
		var newCombo = new ComboBox();
		newCombo.create("X1","mcombo1");
		
		var rmvButton =document.createElement("img");
		rmvButton.setAttribute('src', 'images/remove.png');
		rmvButton.style.width= '16px';
		rmvButton.style.width= '16px';
		rmvButton.comboPointer = newCombo;
		document.getElementById("comboboxes").appendChild(rmvButton);
		rmvButton.onclick = function()
		{
			ptr.removeCombo(this.comboPointer);
		};
		
		combos.push({combo: newCombo, removeButton: rmvButton});
		
		newCombo = new ComboBox();
		newCombo.create("X2","mcombo2");
        
		rmvButton =document.createElement("img");
		rmvButton.setAttribute('src', 'images/remove.png');
		rmvButton.style.width= '16px';
		rmvButton.style.width= '16px';
		rmvButton.comboPointer = newCombo;
		document.getElementById("comboboxes").appendChild(rmvButton);
		rmvButton.onclick = function()
		{
			ptr.removeCombo(this.comboPointer);
		};
		
		combos.push({combo: newCombo, removeButton: rmvButton});
		
        newCombo = new ComboBox();
		newCombo.create("X3","mcombo3");
        
		rmvButton =document.createElement("img");
		rmvButton.setAttribute('src', 'images/remove.png');
		rmvButton.style.width= '16px';
		rmvButton.style.width= '16px';
		rmvButton.comboPointer = newCombo;
		document.getElementById("comboboxes").appendChild(rmvButton);
		rmvButton.onclick = function()
		{
			ptr.removeCombo(this.comboPointer);
		};
		
		combos.push({combo: newCombo, removeButton: rmvButton});
		
		comboNumber = 3;
		
        // creatin add button
		addButton=document.createElement("img");
		addButton.setAttribute('src', 'images/add.png');
		addButton.style.width= '32px';
		addButton.style.width= '32px';
		document.getElementById("comboboxes").appendChild(addButton);
		addButton.onclick = function()
		{
			ptr.addCombo();
		};

	}
	
    /*
     * adds new combobox and updates shown visualization
     */
	this.addCombo = function()
	{
		var newCombo = new ComboBox();
		newCombo.createBefore("X"+(comboNumber+1),"mcombo"+(comboNumber+1), addButton); 		
        newCombo.updateOptions(generateNumericMeasuresList());
		newCombo.setSize(120);
        newCombo.setSelectedOption(comboNumber);

		var rmvButton =document.createElement("img");
		rmvButton.setAttribute('src', 'images/remove.png');
		rmvButton.style.width= '16px';
		rmvButton.style.width= '16px';
		rmvButton.comboPointer = newCombo;
		document.getElementById("comboboxes").insertBefore(rmvButton, addButton);
		rmvButton.onclick = function()
		{
			//console.log(this.comboPointer);
			ptr.removeCombo(this.comboPointer);
		};
		
		combos.push({combo: newCombo, removeButton: rmvButton});
		
		comboNumber++;
		
        updateShownVisualization();

		
	}
	
    /*
     * removes a specific combobox from the cluster
     */
	this.removeCombo = function(comboToRemove)
	{
		for(var i = 0; i < combos.length; i++)
		{
			if(combos[i].combo == comboToRemove)
			{
				combos[i].combo.remove();
				combos[i].removeButton.remove();
				combos.splice(i,1);
				comboNumber--;
			}
		}
		updateShownVisualization();

	}
	
    /*
     * updates all comboboxes options
     */
	this.updateOptions = function(list)
	{
		for(var i = 0; i < combos.length; i++)
		{
			combos[i].combo.updateOptions(list);
		}
	}
	
    /*
     * get selected options from all comboboxes and returns a list with all in order
     */
	this.getSelectedOptions = function()
	{
		var list = [];
		for(var i= 0; i < combos.length; i++)
		{
			list.push(combos[i].combo.getSelectedOption());
		}
		return list;
	}
	
    /*
     * hides all comboboxes
     */
	this.hide = function()
	{
		for(var i= 0; i < combos.length; i++)
		{
			combos[i].combo.hide();
			combos[i].removeButton.style.display = "none";
		}
		addButton.style.display = 'none';
	}
	
    /*
     * shows all comboboxes
     */
	this.show = function()
	{
		for(var i= 0; i < combos.length; i++)
		{
			combos[i].combo.show();
			combos[i].removeButton.style.display = "inline";
		}
		addButton.style.display = 'inline';
	}
    
    /*
     * set comboboxes indexes when initializing 
     * so that they won't show the same option
     */
    this.setDifferentIndexes = function()
    {
        for(var i= 0; i < combos.length; i++)
		{
			combos[i].combo.setSelectedOption(i);
		}
    }
	
}
/*
 * creates scatterplot comboboxes and checkbox for dynamic axis
 * hides them to only show when needed
 */
function initializeComboboxes()
{
    // creating dynamic axis checkbox
    dynamicCheckbox = document.createElement("input");
    dynamicCheckbox.type = "checkbox";
    dynamicCheckbox.checked = false;
    dynamicCheckbox.style = "vertical-align: bottom;";
    dynamicCheckbox.addEventListener("change", function()  
	{
        if(this.checked)
            makeDynamicAxis = true;       
        else
            makeDynamicAxis = false;
            
        updateShownVisualization();
    });
    document.getElementById("comboboxes").appendChild(dynamicCheckbox);
    dynamicCheckbox.style.display = 'none';
    
    // creating dynamic axis label
    dynamicCheckboxText = document.createElement("H0");
    var t = document.createTextNode(" Dynamic Lenses ");
    dynamicCheckboxText.style = "margin-right:100px;font-size: 20px;display:inline;";
    dynamicCheckboxText.appendChild(t);
    document.getElementById("comboboxes").appendChild(dynamicCheckboxText);
	dynamicCheckboxText.style.display = 'none';	
    
    var label = document.createElement('label')
    label.htmlFor = "id";
    label.appendChild(document.createTextNode('moving axis'));
    
    // creating comboboxes
    comboX = new ComboBox();
	comboX.create("X","comboX");
    comboX.hide();
	
	comboY = new ComboBox();
	comboY.create("Y","comboY");
    comboY.hide();
	
	comboSize = new ComboBox();
	comboSize.create("Size","comboSize");
    comboSize.hide();
    
    comboColor = new ComboBox();
	comboColor.create("Color","comboColor");
    comboColor.hide();
}

/*
 * gets all species list of measures names and checks if value should be a number
 * returns an object list with all measure names, avoiding duplicates
 *//*
 function generateMeasuresList()
{
	console.log("LOLO");
	var m_list = [];
	var check_m_list = [];
	var characterLst = allCharactersList.getList();

	for (var i = 0; i < selection.length; i++)
	{
		if(selection[i].measures)
		{
			for(var charId_key in  selection[i].measures) 
			{
				check_m_list[charId_key] = true;
			}
		}
	}
	

	for(var charId_key in  check_m_list) 
	{
		
		if(characterLst[charId_key].character_type_name == "real number" || 
			characterLst[charId_key].character_type_name == "integer number")
		{
			m_list.push({
				id: charId_key, 
				name: characterLst[charId_key].character_name, 
				group: characterLst[charId_key].character_group_name,
				isNum: true});
		}
		else
		{
			m_list.push({
				id: charId_key, 
				name: characterLst[charId_key].character_name, 
				group: characterLst[charId_key].character_group_name,
				isNum: false});
		}

	}
	console.log(m_list);
	return m_list;
}*/

function generateMeasuresList()
{
	var m_list = [];
	var characterLst = allCharactersList.getList();
	
	for (var i = 0; i < selection.length; i++)
	{
        if(selection[i].inheritedCharacters)
		{

            for(var j = 0; j < selection[i].inheritedCharacters.length; j++)
            {
                // checks if measure not in list already
                if(m_list.map(function(e) { return e.id; }).indexOf(selection[i].inheritedCharacters[j])==-1)
                {
                    if(characterLst[selection[i].inheritedCharacters[j]].character_type_name == "real number" || 
                        characterLst[selection[i].inheritedCharacters[j]].character_type_name == "integer number")
						{
							
							m_list.push({
                                id: selection[i].inheritedCharacters[j], 
                                name: characterLst[selection[i].inheritedCharacters[j]].character_name, 
                                group: characterLst[selection[i].inheritedCharacters[j]].character_group_name,
                                isNum: true});
						}
                    else
					{
                        m_list.push({
                            id: selection[i].inheritedCharacters[j], 
                            name: characterLst[selection[i].inheritedCharacters[j]].character_name,
                            group: characterLst[selection[i].inheritedCharacters[j]].character_group_name,                            
                            isNum: false});
					}
                }
            }
		}
    
		if(selection[i].characters)
		{

            for(var j = 0; j < selection[i].characters.length; j++)
            {
                // checks if measure not in list already
                if(m_list.map(function(e) { return e.id; }).indexOf(selection[i].characters[j])==-1)
                {
                    if(characterLst[selection[i].characters[j]].character_type_name == "real number" || 
                        characterLst[selection[i].characters[j]].character_type_name == "integer number")
						{
							
							m_list.push({
                                id: selection[i].characters[j], 
                                name: characterLst[selection[i].characters[j]].character_name, 
                                group: characterLst[selection[i].characters[j]].character_group_name,
                                isNum: true});
						}
                    else
					{
                        m_list.push({
                            id: selection[i].characters[j], 
                            name: characterLst[selection[i].characters[j]].character_name,
                            group: characterLst[selection[i].characters[j]].character_group_name,                            
                            isNum: false});
					}
                }
            }
		}
	}
	return m_list;
}

/*
 * gets all species list of numeric measures names only
 * returns an object list with all measure names, avoiding duplicates
 */
function generateNumericMeasuresList()
{
	var m_list = [];
	var check_m_list = [];
	var characterLst = allCharactersList.getList();

	if(filteredSelection[0] != "all")
	{
		for (var i = 0; i < filteredSelection.length; i++)
		{
			if(selection[filteredSelection[i]].measures)
			{
				for(var charId_key in  selection[filteredSelection[i]].measures) 
				{
					check_m_list[charId_key] = true;
				}
			}
		}
	}
	else
	{
		for (var i = 0; i < selection.length; i++)
		{
			if(selection[i].measures)
			{
				for(var charId_key in  selection[i].measures) 
				{
					check_m_list[charId_key] = true;
				}
			}
		}
	}

	for(var charId_key in  check_m_list) 
	{
		
		if(characterLst[charId_key].character_type_name == "real number" || 
			characterLst[charId_key].character_type_name == "integer number")
			m_list.push({
				id: charId_key, 
				name: characterLst[charId_key].character_name, 
				group: characterLst[charId_key].character_group_name,
				isNum: true});

	}
	
	return m_list;
}

function generateTotalNumericMeasuresList()
{
	var m_list = [];
	var characterLst = allCharactersList.getList();
	for (var i = 0; i < selection.length; i++)
	{
        if(selection[i].inheritedCharacters)
		{

            for(var j = 0; j < selection[i].inheritedCharacters.length; j++)
            {	
                // checks if measure not in list already
                if(m_list.map(function(e) { return e.id; }).indexOf(selection[i].inheritedCharacters[j])==-1)
                {
                    
                    if(characterLst[selection[i].inheritedCharacters[j]].character_type_name == "real number" || 
                        characterLst[selection[i].inheritedCharacters[j]].character_type_name == "integer number")
                        m_list.push({
                            id: selection[i].inheritedCharacters[j], 
                            name: characterLst[selection[i].inheritedCharacters[j]].character_name, 
                            group: characterLst[selection[i].inheritedCharacters[j]].character_group_name,
                            isNum: true});

                }
            }
		}
        
		if(selection[i].characters)
		{

            for(var j = 0; j < selection[i].characters.length; j++)
            {	
                // checks if measure not in list already
                if(m_list.map(function(e) { return e.id; }).indexOf(selection[i].characters[j])==-1)
                {
                    
                    if(characterLst[selection[i].characters[j]].character_type_name == "real number" || 
                        characterLst[selection[i].characters[j]].character_type_name == "integer number")
                        m_list.push({
                            id: selection[i].characters[j], 
                            name: characterLst[selection[i].characters[j]].character_name, 
                            group: characterLst[selection[i].characters[j]].character_group_name,
                            isNum: true});

                }
            }
		}
	}
	return m_list;
}

