
function ComboBox()
{
	var combo;
	var txtLabel;
	var id;
	
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
		
		combo.addEventListener("click", function()
		{
			updateShownVisualization();
		});
		
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
	
	this.remove = function()
	{
		var parent = document.getElementById("comboboxes");
		parent.removeChild(txtLabel);
		parent.removeChild(combo);
	}
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
