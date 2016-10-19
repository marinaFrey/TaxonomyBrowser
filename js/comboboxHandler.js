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
	this.createFilterCombo = function(combo_id, clickFunction)
	{
		id = combo_id;

		combo = document.createElement("SELECT");
		combo.setAttribute("id", id);
		var parent = document.getElementById("filters_info")
        parent.appendChild(combo);
		combo.addEventListener("change", clickFunction);
		
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
        //var br = document.createElement("br");
        //parent.appendChild(br);

		type = TAXONOMY_COMBO;
    }
    
	/*
     * removes all combobox options
     */
	this.clearOptions = function()
	{
		var i;
		for(i=combo.options.length-1;i>=0;i--)
		{
			combo.remove(i);
		}
	}
	
    /*
     * updates combobox options from list
     */
	this.updateOptions = function(optionList)
	{
        var isNewCombo;
        if(combo.options.length > 0)
            isNewCombo = false;
        else
            isNewCombo = true;
            
        // saves current index name so it can remain unaltered if possible
        var newIndex = optionList.map(function(e) { return e.name; }).indexOf(this.getSelectedOption());
		this.clearOptions();
        // adds options from list
		for (var i = 0; i < optionList.length; i++)
		{
			var opt = document.createElement("option");
			var t = document.createTextNode(optionList[i].name);
			opt.appendChild(t);
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
    
	/*
     * get selected combobox option string
     */
	this.getSelectedOption = function()
	{
		return combo.value;
	}
	
    /*
     * set selected combobox option id
     */
	this.setSelectedOption = function(itemId)
	{
		combo.selectedIndex = itemId;
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
	this.remove = function(parent)
	{
		var parent = document.getElementById(parent);
		if(type == VIZ_COMBO)
			parent.removeChild(txtLabel);
		parent.removeChild(combo);
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
        return isNum;
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
		
		combos[0] = new ComboBox();
		combos[0].create("X1","mcombo1");
		
		combos[1] = new ComboBox();
		combos[1].create("X2","mcombo2");
        
        combos[2] = new ComboBox();
		combos[2].create("X3","mcombo3");
        
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
		combos[comboNumber] = new ComboBox();
		combos[comboNumber].createBefore("X"+(comboNumber+1),"mcombo"+(comboNumber+1), addButton); 		
        combos[comboNumber].updateOptions(generateNumericMeasuresList());
        combos[comboNumber].setSelectedOption(comboNumber);
		comboNumber++;
		
        updateShownVisualization();
		if(comboNumber == 6)
		{
			addButton.style.display = 'none';
		}
		
	}
	
    /*
     * removes a specific combobox from the cluster
     */
	this.removeCombo = function(comboToRemove)
	{
		for(var i = 0; i < combos.length; i++)
		{
			if(combos[i] == comboToRemove)
			{
				combos[i].splice(i,1);
				comboNumber--;
			}
		}
	}
	
    /*
     * updates all comboboxes options
     */
	this.updateOptions = function(list)
	{
		for(var i = 0; i < combos.length; i++)
		{
			combos[i].updateOptions(list);
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
			list.push(combos[i].getSelectedOption());
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
			combos[i].hide();
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
			combos[i].show();
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
			combos[i].setSelectedOption(i);
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
    var t = document.createTextNode(" Dynamic Axis ");
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
 */
function generateMeasuresList()
{
	var m_list = [];
	for (var i = 0; i < selection.length; i++)
	{
		if(selection[i].characters)
		{

            for(var j = 0; j < selection[i].characters.length; j++)
            {
                // checks if measure not in list already
                if(m_list.map(function(e) { return e.name; }).indexOf(selection[i].characters[j].name)==-1)
                {
                    if(selection[i].characters[j].type == "real number" || 
                        selection[i].characters[j].type == "integer number")
                        m_list.push({name: selection[i].characters[j].name, isNum: true});
                    else
                        m_list.push({name: selection[i].characters[j].name, isNum: false});
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
	for (var i = 0; i < selection.length; i++)
	{
		if(selection[i].characters)
		{

            for(var j = 0; j < selection[i].characters.length; j++)
            {
                // checks if measure not in list already
                if(m_list.map(function(e) { return e.name; }).indexOf(selection[i].characters[j].name)==-1)
                {
                    
                    if(selection[i].characters[j].type == "real number" || 
                        selection[i].characters[j].type == "integer number")
                        m_list.push({name: selection[i].characters[j].name, isNum: true});

                }
            }
		}
	}
	return m_list;
}
