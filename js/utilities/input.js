var SPECIMEN_MEASURES = 0;

function Input()
{
	var sel_checkbox;
	var combo;
	var deleteBtn;
	var toBeDeleted;
    this.type = new ComboBox();
	this.fixed = false;
	this.unit;
    var label;
    var labelName;
    var input;
    var information;
    var characterID;
    var characterGroupID;
    var br, br2;
	var label_size = 25;
	var information_size = 40;
    
    this.create = function(input_type, parent, name, charID, charGroupID, value, unit_id, info)
    {
        //information = info;
        //type = input_type;
		labelName = name;
        characterID = charID;
        characterGroupID = charGroupID;
        
		var main_div = document.createElement('div');
		var name_div = document.createElement('div');
		name_div.setAttribute('class',"col-sm-4");
		main_div.appendChild(name_div);
		var unit_div = document.createElement('div');
		unit_div.setAttribute('class',"col-sm-2");
		unit_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(unit_div);
		var type_div = document.createElement('div');
		type_div.setAttribute('class',"col-sm-2");
		type_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(type_div);
		var info_div = document.createElement('div');
		info_div.setAttribute('class',"col-sm-4");
		main_div.appendChild(info_div);
		parent.appendChild(main_div);
		
		
		sel_checkbox = document.createElement("input");;
		combo = new ComboBox();
		deleteBtn = document.createElement("img");
		
        // creating label with name
		label = document.createElement("H0");
        label.innerHTML = "<b>"+ name + ":</b> <br> ";
		name_div.appendChild(label);
        
        // creating input with provided id
		input = document.createElement("input");
        input.type = input_type;
        input.step = "any";
        input.value = value;
        input.disabled = true;
        input.size = label_size + 10;
		name_div.appendChild(input);
        
		//var pointer = this;
        /*
        input.addEventListener("change", function()
		{  
			pointer.validateInputType();
		});*/
        
		// creating label with unit
		var allOptUnits = allUnitsList.getList();
		var optUnits = allUnitsList.getUnitListAsOptions();
		this.unit = new ComboBox();
		this.unit.createTaxonomyCombo(name+"combo_unit", unit_div, function(){}, []);
		this.unit.updateOptions(optUnits);
        if(unit_id != null && unit_id != "")
			this.unit.setSelectedOption(optUnits.map(function(f){return f.name;}).indexOf(allOptUnits[unit_id].unit_name));
		else	
			this.unit.setSelectedOption(0);
		this.unit.disable(true);
		
		// creating label with type
		this.type = new ComboBox();
		this.type.createTaxonomyCombo(name+"combo", type_div, function(){}, [])
        this.type.updateOptions([{name:input_type, isNum:false}]);
		this.type.disable(true);
		/*
		type = document.createElement("input");
		//var t = document.createTextNode("type: "+input_type);
		type.type = "text";
		type.disabled = true;
		type.size = 10;
		//type.value = "type:"+input_type;
		type.value = input_type;
		//type.appendChild(t);
		type_div.appendChild(type);*/
		
		// creating label with info
		information = document.createElement("TEXTAREA");
        var t = document.createTextNode(info);
		information.cols = information_size - 5;
		information.disabled = true;
		information.appendChild(t);
		info_div.appendChild(information);
		
		/*
        br = document.createElement("br");
        info_div.appendChild(br);
        br2 = document.createElement("br");
        info_div.appendChild(br2);*/
		
    }
	
	this.createCombo = function(input_type, parent, name, charID, charGroupID, optionsList, info)
	{
		labelName = name;
        characterID = charID;
        characterGroupID = charGroupID;
        
		var main_div = document.createElement('div');
		var name_div = document.createElement('div');
		name_div.setAttribute('class',"col-sm-4");
		main_div.appendChild(name_div);
		var unit_div = document.createElement('div');
		unit_div.setAttribute('class',"col-sm-2");
		unit_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(unit_div);
		var type_div = document.createElement('div');
		type_div.setAttribute('class',"col-sm-2");
		type_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(type_div);
		var info_div = document.createElement('div');
		info_div.setAttribute('class',"col-sm-4");
		main_div.appendChild(info_div);
		parent.appendChild(main_div);
		
		
		sel_checkbox = document.createElement("input");;
		input = document.createElement("input");;
		deleteBtn = document.createElement("img");
		
		
        // creating label with name
		label = document.createElement("H0");
        label.innerHTML = "<b>"+ name + ":</b>  ";
		name_div.appendChild(label);
        
        // creating combobox with provided id
		combo = new ComboBox();
		combo.createTaxonomyCombo(name+"combo", name_div, function(){}, optionsList)
        combo.updateOptions(optionsList);
		
		// creating label with unit

		this.unit = new ComboBox();
		this.unit.createTaxonomyCombo(name+"combo_unit", unit_div, function(){}, []);
		this.unit.updateOptions([{name: "", isNum: false}]);
		this.unit.setSelectedOption(0);
		this.unit.disable(true);
		
		// creating label with type
		this.type = new ComboBox();
		this.type.createTaxonomyCombo(name+"combo", type_div, function(){}, [])
        this.type.updateOptions([{name:input_type, isNum:false}]);
		this.type.disable(true);
		/*
		type = document.createElement("input");
		//var t = document.createTextNode("type: "+input_type);
		type.type = "text";
		type.disabled = true;
		type.size = 10;
		//type.value = "type:"+input_type;
		type.value = input_type;
		//type.appendChild(t);
		type_div.appendChild(type);*/
		
		// creating label with info
		information = document.createElement("TEXTAREA");
        var t = document.createTextNode(info);
		information.cols = information_size - 20;
		information.disabled = true;
		information.appendChild(t);
		info_div.appendChild(information);
	}
	
	this.createCharacter = function(input_type, parent, name, charID, charGroupID, value, unit_id, info, selected, fixed)
	{
		this.fixed = fixed;
		labelName = name;
        characterID = charID;
        characterGroupID = charGroupID;
        
		var main_div = document.createElement('div');
		var check_div = document.createElement('div');
		check_div.setAttribute('class',"col-sm-1");
		main_div.appendChild(check_div);
		var name_div = document.createElement('div');
		name_div.setAttribute('class',"col-sm-3");
		main_div.appendChild(name_div);
		var unit_div = document.createElement('div');
		unit_div.setAttribute('class',"col-sm-2");
		unit_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(unit_div);
		var type_div = document.createElement('div');
		type_div.setAttribute('class',"col-sm-2");
		type_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(type_div);
		var info_div = document.createElement('div');
		info_div.setAttribute('class',"col-sm-4");
		main_div.appendChild(info_div);
		parent.appendChild(main_div);
        
		combo =  new ComboBox();
		deleteBtn = document.createElement("img");
		
		// creating checkbox to select characteristic or not
		sel_checkbox = document.createElement("input");
		sel_checkbox.type = "checkbox";
		sel_checkbox.value = name+ "checkbox";
		sel_checkbox.disabled = true;
		if(selected)
			sel_checkbox.checked = true;
		else
			sel_checkbox.checked = false;
			
		check_div.appendChild(sel_checkbox);
		
        // creating combobox with provided id
		input = document.createElement("input");
        input.type = "text";
        input.step = "any";
        input.value = name;
        input.disabled = true;
        input.size = label_size;
		name_div.appendChild(input);
        
		//var pointer = this;
        /*
        input.addEventListener("change", function()
		{  
			pointer.validateInputType();
		});*/
        
		// creating label with unit
		var allOptUnits = allUnitsList.getList();
		var optUnits = allUnitsList.getUnitListAsOptions();
		this.unit = new ComboBox();
		this.unit.createTaxonomyCombo(name+"combo_unit", unit_div, function(){}, []);
		this.unit.updateOptions(optUnits);
        if(unit_id != null && unit_id != "")
			this.unit.setSelectedOption(optUnits.map(function(f){return f.name;}).indexOf(allOptUnits[unit_id].unit_name));
		else	
			this.unit.setSelectedOption(0);
		this.unit.disable(true);
		
		// creating label with type
		this.type = new ComboBox();
		this.type.createTaxonomyCombo(name+"combo", type_div, function(){}, [])
        this.type.updateOptions([{name:input_type, isNum:false}]);
		this.type.disable(true);
		/*
		type = document.createElement("input");
		//var t = document.createTextNode("type: "+input_type);
		type.step = "any";
		type.type = "text";
		type.disabled = true;
		type.size = 10;
		//type.value = "type:"+input_type;
		type.value = input_type;
		//type.appendChild(t);
		type_div.appendChild(type);*/
		
		// creating label with info
		information = document.createElement("TEXTAREA");
        var t = document.createTextNode(info);
		information.cols = information_size - 5;
		information.disabled = true;
		information.appendChild(t);
		info_div.appendChild(information);
	}
	
	this.createCharacterForManaging = function(input_type, parent, add_before_div, name, charID, charGroupID, value, unit_id, info, deleteFunction)
	{
		labelName = name;
        characterID = charID;
        characterGroupID = charGroupID;

		var main_div = document.createElement('div');
		var name_div = document.createElement('div');
		name_div.setAttribute('class',"col-sm-3");
		main_div.appendChild(name_div);
		var unit_div = document.createElement('div');
		unit_div.setAttribute('class',"col-sm-2");
		unit_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(unit_div);
		var type_div = document.createElement('div');
		type_div.setAttribute('class',"col-sm-2");
		type_div.style="display:flex;justify-content:center;align-items:center;";
		main_div.appendChild(type_div);
		var info_div = document.createElement('div');
		info_div.setAttribute('class',"col-sm-4");
		main_div.appendChild(info_div);
		var check_div = document.createElement('div');
		check_div.setAttribute('class',"col-sm-1");
		check_div.style="display:flex;justify-content:right;align-items:right;";
		main_div.appendChild(check_div);
		
		parent.insertBefore(main_div, add_before_div);
		//parent.appendChild(main_div);
        
		combo =  new ComboBox();
		sel_checkbox = document.createElement("input");
		
		// creating delete button
		deleteBtn = document.createElement("img");
		deleteBtn.setAttribute('src', 'images/remove.png');
		deleteBtn.style.width= '32px';
		deleteBtn.style.width= '32px';
		deleteBtn.linePointer = this;
		deleteBtn.onclick = deleteFunction;
		check_div.appendChild(deleteBtn);
		
        // creating combobox with provided id
		input = document.createElement("input");
        input.type = "text";
        input.step = "any";
        input.value = name;
        input.defaultValue = name;
		
        //input.disabled = true;
        input.size = label_size;
		name_div.appendChild(input);
        
		//var pointer = this;
        /*
        input.addEventListener("change", function()
		{  
			pointer.validateInputType();
		});*/
		
		// creating label with unit
		var allOptUnits = allUnitsList.getList();
		var optUnits = allUnitsList.getUnitListAsOptions();

		this.unit = new ComboBox();
		this.unit.createTaxonomyCombo(name+"combo_unit", unit_div, function(){}, [])
		this.unit.updateOptions(optUnits);
		if(unit_id != null && unit_id != "")
			this.unit.setSelectedOption(optUnits.map(function(f){return f.name;}).indexOf(allOptUnits[unit_id].unit_name));
		else	
			this.unit.setSelectedOption(0);
			
		if(charID)
			this.unit.disable(true);

		
		
        var opt = allCharactersList.gerCharTypesListAsOptionsWithStardardNomenclature()
		this.type = new ComboBox();
		this.type.createTaxonomyCombo(name+"combo", type_div, function(){}, [])
        this.type.updateOptions(opt);
		if(input_type != "")
			this.type.setSelectedOption(opt.map(function(f){return f.name;}).indexOf(input_type));

		if(charID)
			this.type.disable(true);
		else
			console.log(this.type);

		// creating label with info
		information = document.createElement("TEXTAREA");
        //var t = document.createTextNode(info);
		information.defaultValue = info;
		information.cols = information_size;
		//information.disabled = true;
		//information.appendChild(t);
		info_div.appendChild(information);
	}
    
    this.isValid = function()
    {
        return isValidInput;
    }
    
	this.getIfChecked = function()
	{
		return sel_checkbox.checked;
	}
	
    this.getValue = function()
    {
		if(combo.getSelectedOption())
		{
			return combo.getSelectedOption();
		}
        else
			return input.value;
    }
	
	this.getComboTaxonomyID = function()
	{
		if(combo.getSelectedOption())
		{
			var list = combo.getList();
			
			var index = list.map(function(e) { return e.name; }).indexOf(combo.getSelectedOption());
			return list[index].taxonomy.taxonomy_id;
		}
	}
    
    this.getLabelName = function()
    {
        return labelName;
    }
    
    this.getType = function()
    {
		if(this.type.getSelectedOption())
		{
			return this.type.getSelectedOption();
		}

    }
	
	this.getTypeID = function()
    {	
		if(this.type)
		{
			if(this.type.getSelectedOption())
			{console.log(this.type);
				var t = this.type.getSelectedOption();
				var typeID;
				if(t == "text")
				{
					typeID = allCharactersList.getCharTypeID("string");
				}
				else
					typeID = allCharactersList.getCharTypeID("real number");

				return typeID;
			}
		}

    }
	
	this.getUnitID = function()
    {	
		if(this.unit)
		{
			if(this.unit.getSelectedOption())
			{
				var typeID;
				typeID = allUnitsList.getIndexByUnitname(this.unit.getSelectedOption());
				return typeID;
			}
		}

    }
    
    this.getInformation = function()
    {
        return information.value;
    }
    
    this.getcharacterID = function()
    {
        return characterID;
    }
    
    this.getcharacterGroupID = function()
    {
        return characterGroupID;
    }
	
	this.setComboOption = function(option)
	{
		combo.setSelectedOption(option);
	}
    
    this.hide = function()
    {
        label.style = "display:none;";
        input.style = "display:none;";
        //br.style = "display:none;";
        //br2.style = "display:none;";
    }
    
    this.show = function()
    {
        label.style = "display:block;";
        input.style = "display:block;";
        //br.style = "display:block;";
        //br2.style = "display:block;";
    }
    
    this.toggleEdition = function(canBeEdited)
    {
        if(canBeEdited)
		{
			if(combo.getSelectedOption())
				combo.disable(false);
			else
				input.disabled = false;
		}
        else
		{
			if(combo.getSelectedOption())
				combo.disable(true);
			else
				input.disabled = true;
		}
        
    }
	
	this.toggleComboEdition = function(canBeEdited)
	{
		if(canBeEdited)
			combo.disable(false);
        else
			combo.disable(true);
	}
	
	this.toggleTaxonomyEdition = function(canBeEdited)
	{
		if(canBeEdited)
			sel_checkbox.disabled = false;
        else
			sel_checkbox.disabled = true;
		
	}
	
	this.toggleCharactersEdition = function(canBeEdited)
	{
		if(canBeEdited)
		{
            input.disabled = false;
			if(characterID)
			{
				this.type.disable(false);
				this.unit.disable(false);
				information.disabled = false;
			}
		}
        else
		{
            input.disabled = true;
			this.type.disable(true);
			this.unit.disable(true);
			information.disabled = true;
		}
	}
	
	this.toggleToBeDeleted = function(willBeDeleted)
	{
		toBeDeleted = willBeDeleted;
		if(willBeDeleted)
		{
            input.disabled = true;
			input.style = "background:#ff8484;";

			this.type.disable(true);
			this.type.changeStyle("background:#ff8484;");
			information.disabled = true;
			information.style = "background:#ff8484;";
			
		}
        else
		{
            input.disabled = false;
			input.style = "background:#eeeeee;";
			this.type.disable(false);
			this.type.changeStyle("background:#eeeeee;");
			information.disabled = false;
			information.style = "background:#eeeeee;";
		}
	}
	
	this.willBeDeleted = function()
	{
		return toBeDeleted;
	}
	
	this.isFixed = function()
	{
		return this.fixed;
	}
	
	this.hasBeenChanged = function()
	{
		if (input.value != input.defaultValue)
			return true;
		
		//if(!type.options[type.selectedIndex].defaultSelected)
		//	return true
		
		if (information.value != information.defaultValue)
			return true;
			
		return false;
	}
    
    this.validateInputType = function()
    {
        console.log("validating");
        console.log(input.value);
    }
    
    this.remove = function()
    {
        label.remove();
        input.remove();
		this.type.remove();
		this.unit.remove();
		information.remove();
        //br.remove();
        //br2.remove();
    }
}