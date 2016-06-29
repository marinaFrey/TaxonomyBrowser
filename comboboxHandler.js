var VIZ_COMBO = 0;
var FILTER_COMBO = 1;

function ComboBox()
{
	var combo;
	var txtLabel;
	var id;
	var type;
	
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
	
	this.createFilterCombo = function(combo_id, addBtn, clickFunction)
	{
		id = combo_id;

		combo = document.createElement("SELECT");
		combo.setAttribute("id", id);
		var parent = document.getElementById("filters_info")
		parent.insertBefore(combo, addBtn);
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
		this.clearOptions();
		for (var i = 0; i < optionList.length; i++)
		{
			var opt = document.createElement("option");
			//opt.setAttribute("value", "volvocar");
			var t = document.createTextNode(optionList[i]);
			opt.appendChild(t);
			combo.appendChild(opt);
		}
		
	}
	
	this.getSelectedOption = function()
	{
		return combo.value;
	}
	
	this.hide = function()
	{
		combo.style.display = 'none';
		txtLabel.style.display = 'none';
	}
	
	this.show = function()
	{
		combo.style.display = 'block';
		txtLabel.style.display = 'block';
	}
	
	this.remove = function(parent)
	{
		var parent = document.getElementById(parent);
		if(type == VIZ_COMBO)
			parent.removeChild(txtLabel);
		parent.removeChild(combo);
	}
}

function initializeComboboxes()
{
    comboX = new ComboBox();
	comboX.create("X","comboX");
	
	comboY = new ComboBox();
	comboY.create("Y","comboY");
	
	comboSize = new ComboBox();
	comboSize.create("Size","comboSize");
    
    comboColor = new ComboBox();
	comboColor.create("Color","comboColor");
}

function initializeParallelComboboxes()
{
    combo1 = new ComboBox();
	combo1.create("X1","combo1");
	
	combo2 = new ComboBox();
	combo2.create("X2","combo2");
	
	combo3 = new ComboBox();
	combo3.create("X3","combo3");
	
	combo4 = new ComboBox();
	combo4.create("X4","combo4");
	
	combo5 = new ComboBox();
	combo5.create("X5","combo5");
	
	combo6 = new ComboBox();
	combo6.create("X6","combo6");
	

}

function generateMeasuresList()
{
	var m_list = [];

	for (var i = 0; i < selection.length; i++)
	{
		if(selection[i].rank = "7" && selection[i].children)
		{
			if(selection[i].children)
			{
				if(selection[i].children[0].measures)
				{
					for(var j = 0; j < selection[i].children[0].measures.length; j++)
					{
							if(m_list.indexOf(selection[i].children[0].measures[j].name)==-1)
							{
								m_list.push(selection[i].children[0].measures[j].name);
							}
								

					}
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
		if(selection[i].rank = "7" && selection[i].children)
		{
			if(selection[i].children)
			{
				if(selection[i].children[0].measures)
				{
					for(var j = 0; j < selection[i].children[0].measures.length; j++)
					{
							if(m_list.indexOf(selection[i].children[0].measures[j].name)==-1 && 
							   (selection[i].children[0].measures[j].type == "real number" || 
							   selection[i].children[0].measures[j].type == "integer number"))
							{
								m_list.push(selection[i].children[0].measures[j].name);
							}
								

					}
				}
				
			}

		}

	}

	return m_list;
	
}
