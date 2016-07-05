var VIZ_COMBO = 0;
var FILTER_COMBO = 1;

function ComboBox()
{
	var combo;
	var txtLabel;
	var id;
	var type;
    var isNum;
	
	this.create = function(name, combo_id)
	{
		id = combo_id;
		
		txtLabel = document.createElement("H0");
		var t = document.createTextNode("   " + name + "  ");
		txtLabel.appendChild(t);
		document.getElementById("comboboxes").appendChild(txtLabel);

		combo = document.createElement("SELECT");
		combo.setAttribute("id", id);
		document.getElementById("comboboxes").appendChild(combo);
		
		type = VIZ_COMBO;
		
		combo.addEventListener("click", function()
		{
			updateShownVisualization();
		});
		
	}
	
	this.createBefore = function(name, combo_id, beforeThis)
	{
		id = combo_id;
		
		txtLabel = document.createElement("H0");
		var t = document.createTextNode("   " + name + "  ");
		txtLabel.appendChild(t);
		//document.getElementById("comboboxes").appendChild(txtLabel);
		document.getElementById("comboboxes").insertBefore(txtLabel, beforeThis);

		combo = document.createElement("SELECT");
		combo.setAttribute("id", id);
		//document.getElementById("comboboxes").appendChild(combo);
		document.getElementById("comboboxes").insertBefore(combo, beforeThis);
		
		type = VIZ_COMBO;
		
		combo.addEventListener("click", function()
		{
			updateShownVisualization();
		});
	}
	
	this.createFilterCombo = function(combo_id, clickFunction)
	{
		id = combo_id;

		combo = document.createElement("SELECT");
		combo.setAttribute("id", id);
		var parent = document.getElementById("filters_info")
		//parent.insertBefore(combo, addBtn);
        parent.appendChild(combo);
		combo.addEventListener("click", clickFunction);
		
		type = FILTER_COMBO;
	}
	
	this.clearOptions = function()
	{
		var i;
		for(i=combo.options.length-1;i>=0;i--)
		{
			combo.remove(i);
		}
	}
	
	this.updateOptions = function(optionList)
	{
        var newIndex = optionList.map(function(e) { return e.name; }).indexOf(this.getSelectedOption());
		this.clearOptions();
		for (var i = 0; i < optionList.length; i++)
		{
			var opt = document.createElement("option");
			//opt.setAttribute("value", "volvocar");
			var t = document.createTextNode(optionList[i].name);
			opt.appendChild(t);
			combo.appendChild(opt);
            this.setNumericDataType(optionList[i].isNum);
		}
        if(newIndex != -1)
			this.setSelectedOption(newIndex);
		else
			this.setSelectedOption(0);
		
	}
	
	this.getSelectedOption = function()
	{
		return combo.value;
	}
	
	this.setSelectedOption = function(itemId)
	{
		combo.selectedIndex = itemId;
	}
	
	this.hide = function()
	{
		combo.style.display = 'none';
		txtLabel.style.display = 'none';
	}
	
	this.show = function()
	{
		combo.style.display = 'inline';
		txtLabel.style.display = 'inline';
	}
	
	this.remove = function(parent)
	{
		var parent = document.getElementById(parent);
		if(type == VIZ_COMBO)
			parent.removeChild(txtLabel);
		parent.removeChild(combo);
	}
    
    this.setNumericDataType = function(dataType)
    {
        isNum = dataType;
    }
    
    this.isNumeric = function()
    {
        return isNum;
    }

}



function MultipleComboboxes()
{
	var combos = [];
	var comboNumber = 0;
	var ptr = this;
	var addButton;
	
	this.initialize = function()
	{
		
		combos[0] = new ComboBox();
		combos[0].create("X1","mcombo1");
		
		combos[1] = new ComboBox();
		combos[1].create("X2","mcombo2");
        
        combos[2] = new ComboBox();
		combos[2].create("X3","mcombo3");
        
		comboNumber = 3;
		
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
	
	this.updateOptions = function(list)
	{
		for(var i = 0; i < combos.length; i++)
		{
			combos[i].updateOptions(list);
		}
	}
	
	this.getSelectedOptions = function()
	{
		var list = [];
		for(var i= 0; i < combos.length; i++)
		{
			list.push(combos[i].getSelectedOption());
		}
		return list;
	}
	
	this.hide = function()
	{
		for(var i= 0; i < combos.length; i++)
		{
			combos[i].hide();
		}
		addButton.style.display = 'none';
	}
	
	this.show = function()
	{
		for(var i= 0; i < combos.length; i++)
		{
			combos[i].show();
		}
		addButton.style.display = 'inline';
	}
        
    this.setDifferentIndexes = function()
    {
        for(var i= 0; i < combos.length; i++)
		{
			combos[i].setSelectedOption(i);
		}
    }
	
}

function initializeComboboxes()
{
    dynamicCheckbox = document.createElement("input");
    
    dynamicCheckbox.type = "checkbox";
    dynamicCheckbox.checked = false;
    dynamicCheckbox.style = "vertical-align: bottom;";
    dynamicCheckbox.addEventListener("click", function()  
	{
        if(this.checked)
            makeDynamicAxis = true;       
        else
            makeDynamicAxis = false;
            
        updateShownVisualization();
    });
    document.getElementById("comboboxes").appendChild(dynamicCheckbox);
    dynamicCheckbox.style.display = 'none';
    
    dynamicCheckboxText = document.createElement("H0");
    var t = document.createTextNode(" Dynamic Axis ");
    dynamicCheckboxText.style = "margin-right:100px;font-size: 20px;display:inline;";
    dynamicCheckboxText.appendChild(t);
    document.getElementById("comboboxes").appendChild(dynamicCheckboxText);
	dynamicCheckboxText.style.display = 'none';	
    
    var label = document.createElement('label')
    label.htmlFor = "id";
    label.appendChild(document.createTextNode('moving axis'));
    
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

function generateMeasuresList()
{
	var m_list = [];

	for (var i = 0; i < selection.length; i++)
	{
		if(selection[i].characters)
		{

            for(var j = 0; j < selection[i].characters.length; j++)
            {
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

function generateNumericMeasuresList()
{
	var m_list = [];
	for (var i = 0; i < selection.length; i++)
	{
		if(selection[i].characters)
		{

            for(var j = 0; j < selection[i].characters.length; j++)
            {
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
