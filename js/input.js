var SPECIMEN_MEASURES = 0;

function Input()
{
    var type;
    var label;
    var labelName;
    var input;
    var information;
    var characterID;
    var characterGroupID;
    var br, br2;
    
    this.create = function(input_type, parent, name, charID, charGroupID, value, info)
    {
        //information = info;
        //type = input_type;
		labelName = name;
        characterID = charID;
        characterGroupID = charGroupID;
        
		var main_div = document.createElement('div');
		var name_div = document.createElement('div');
		name_div.setAttribute('class',"col-sm-5");
		main_div.appendChild(name_div);
		var type_div = document.createElement('div');
		type_div.setAttribute('class',"col-sm-2");
		main_div.appendChild(type_div);
		var info_div = document.createElement('div');
		info_div.setAttribute('class',"col-sm-5");
		main_div.appendChild(info_div);
		parent.appendChild(main_div);
		
        // creating label with name
		label = document.createElement("H0");
        label.innerHTML = "<b>"+ name + ":</b>  ";
		name_div.appendChild(label);
        
        // creating combobox with provided id
		input = document.createElement("input");
        input.type = input_type;
        input.step = "any";
        input.value = value;
        input.disabled = true;
        input.size = 25;
		name_div.appendChild(input);
        
		//var pointer = this;
        /*
        input.addEventListener("change", function()
		{  
			pointer.validateInputType();
		});*/
        
		// creating label with type
		type = document.createElement("input");
		//var t = document.createTextNode("type: "+input_type);
		type.type = "text";
		type.disabled = true;
		type.size = 10;
		//type.value = "type:"+input_type;
		type.value = input_type;
		//type.appendChild(t);
		type_div.appendChild(type);
		
		// creating label with info
		information = document.createElement("TEXTAREA");
        var t = document.createTextNode(info);
		information.cols = 50;
		information.disabled = true;
		information.appendChild(t);
		info_div.appendChild(information);
		
		/*
        br = document.createElement("br");
        info_div.appendChild(br);
        br2 = document.createElement("br");
        info_div.appendChild(br2);*/
		
    }
	
	this.createCharacter = function(input_type, parent, name, charID, charGroupID, value, info)
	{
		labelName = name;
        characterID = charID;
        characterGroupID = charGroupID;
        
		var main_div = document.createElement('div');
		var name_div = document.createElement('div');
		name_div.setAttribute('class',"col-sm-5");
		main_div.appendChild(name_div);
		var type_div = document.createElement('div');
		type_div.setAttribute('class',"col-sm-2");
		main_div.appendChild(type_div);
		var info_div = document.createElement('div');
		info_div.setAttribute('class',"col-sm-5");
		main_div.appendChild(info_div);
		parent.appendChild(main_div);
        
        // creating combobox with provided id
		input = document.createElement("input");
        input.type = "text";
        input.step = "any";
        input.value = name;
        input.disabled = true;
        input.size = 25;
		name_div.appendChild(input);
        
		//var pointer = this;
        /*
        input.addEventListener("change", function()
		{  
			pointer.validateInputType();
		});*/
        
		// creating label with type
		type = document.createElement("input");
		//var t = document.createTextNode("type: "+input_type);
		type.step = "any";
		type.type = "text";
		type.disabled = true;
		type.size = 10;
		//type.value = "type:"+input_type;
		type.value = input_type;
		//type.appendChild(t);
		type_div.appendChild(type);
		
		// creating label with info
		information = document.createElement("TEXTAREA");
        var t = document.createTextNode(info);
		information.cols = 50;
		information.disabled = true;
		information.appendChild(t);
		info_div.appendChild(information);
	}
    
    this.isValid = function()
    {
        return isValidInput;
    }
    
    this.getValue = function()
    {
        return input.value;
    }
    
    this.getLabelName = function()
    {
        return labelName;
    }
    
    this.getType = function()
    {
		var array = type.value.split(":")
        return array[1];
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
            input.disabled = false;
        else
            input.disabled = true;
        
    }
	
	this.toggleTaxonomyEdition = function(canBeEdited)
	{
		if(canBeEdited)
		{
            input.disabled = false;
			if(characterID)
			{
				type.disabled = false;
				information.disabled = false;
			}
		}
        else
		{
            input.disabled = true;
			type.disabled = true;
			information.disabled = true;
		}
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
		type.remove();
		information.remove();
        //br.remove();
        //br2.remove();
    }
}