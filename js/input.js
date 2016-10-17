var SPECIMEN_MEASURES = 0;

function Input()
{
    var type;
    var label;
    var input;
    var br, br2;
    
    this.create = function(input_type, parent, name, value)
    {
        type = input_type;
		
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
		parent.appendChild(input);
        var pointer = this;
        input.addEventListener("change", function()
		{  
			pointer.validateInputType();
		});
        
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