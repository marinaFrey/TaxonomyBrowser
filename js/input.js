var SPECIMEN_MEASURES = 0;

function Input()
{
    var type;
    var label;
    var labelName;
    var input;
    var information;
    var chararacterID;
    var characterGroupID;
    var br, br2;
    
    this.create = function(input_type, parent, name, charID, charGroupID, value, info)
    {
        information = info;
        type = input_type;
		labelName = name;
        chararacterID = charID;
        characterGroupID = charGroupID;
        
        // creating label with name
		label = document.createElement("H0");
        label.innerHTML = "<b>"+ name + ":</b>  ";
		parent.appendChild(label);
        
        // creating combobox with provided id
		input = document.createElement("input");
        input.type = input_type;
        input.step = "any";
        input.value = value;
        input.disabled = true;
        input.size = 30;
		parent.appendChild(input);
        var pointer = this;
        /*
        input.addEventListener("change", function()
		{  
			pointer.validateInputType();
		});*/
        
        br = document.createElement("br");
        parent.appendChild(br);
        br2 = document.createElement("br");
        parent.appendChild(br2);
		
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
        return type;
    }
    
    this.getInformation = function()
    {
        return information;
    }
    
    this.getchararacterID = function()
    {
        return chararacterID;
    }
    
    this.getcharacterGroupID = function()
    {
        return characterGroupID;
    }
    
    this.hide = function()
    {
        label.style = "display:none;";
        input.style = "display:none;";
        br.style = "display:none;";
        br2.style = "display:none;";
    }
    
    this.show = function()
    {
        label.style = "display:block;";
        input.style = "display:block;";
        br.style = "display:block;";
        br2.style = "display:block;";
    }
    
    this.toggleEdition = function(canBeEdited)
    {
        if(canBeEdited)
            input.disabled = false;
        else
            input.disabled = true;
        
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
        br.remove();
        br2.remove();
    }
}