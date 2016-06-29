
function makeSpecimenPopup(specimen)
{
	var txtLabel = document.getElementById("myModalLabel");
	txtLabel.className = "modal-title";
	txtLabel.innerHTML = "<h1>"+specimen.name+"</h1>";
	
	var info_text =
		"<h3><b>Collection ID: </b>" + specimen.collection_id +"<br />" +
		"<b>Collected by: </b>" + specimen.collected_by + "<br />" +
		"<b>Data: </b>" + specimen.collected_data +"<br />" +
		"<b>Latitude: </b>" + specimen.latitude + "<br />" +
		"<b>Longitude: </b>" + specimen.longitude + "<br />" +
		"<b>Information: </b>" + specimen.information + 
		"<br /><br /></h3> <h2><b>Measures: </b></h2><br /><br />";
	
	for(var i = 0; i < specimen.measures.length; i++)
	{
		info_text += 
			"<h4><b>"+specimen.measures[i].name+": </b>" + specimen.measures[i].value +"<br /></h4>";

	}
	
	var infoLabel = document.getElementById("info_text");
	infoLabel.innerHTML = info_text;
	
	$('#basicModal').modal('show');
}

function FilterPopup()
{
	var infoLabel;
	var addButton;
	var measuresList;
	var operationsListNumeric = ["exists","doesn't exist","is","is not","is smaller than","is bigger than","is smaller or equal to","is bigger or equal to"];
	var operationsListString = ["exists","doesn't exist","is", "is not"]
	var ptr = this;
	
	this.create = function()
	{
		var txtLabel = document.getElementById("filterModalLabel");
		txtLabel.className = "modal-title";
		txtLabel.innerHTML = "<h1> Filters </h1>";
		
		infoLabel = document.getElementById("filters_info");
		infoLabel.innerHTML = "";
		
		
		
		addButton=document.createElement("img");
		addButton.setAttribute('src', 'images/add.png');
		addButton.style.width= '64px';
		addButton.style.width= '64px';
		document.getElementById("filters_add_button").appendChild(addButton);
		addButton.onclick = function()
		{
			ptr.addFilter();
		};
		
		
	}
	
	this.addFilter = function()
	{

		var comboMeasure = new ComboBox();
        var comboOption = new ComboBox();
        var input = document.createElement("input");
        var oImg=document.createElement("img");
        var br = document.createElement("br");
        
		comboMeasure.createFilterCombo("comboMeasure", function()
		{
            
			console.log("hello world");
		});
		comboMeasure.updateOptions(generateMeasuresList());
	
		comboOption.createFilterCombo("comboOption", function()
		{
            if(operationsListString.indexOf(comboOption.getSelectedOption()) == -1)
            {
                comboOption.setNumericDataType(true);
            }
            else
            {
                comboOption.setNumericDataType(false);
            }
			console.log("options");
		});
		comboOption.updateOptions(operationsListNumeric);

        input.type = "text";
		//infoLabel.insertBefore(input, addButton);
        infoLabel.appendChild(input);
        
		oImg.setAttribute('src', 'images/remove.png');
		oImg.style.width= '32px';
		oImg.style.width= '32px';
		oImg.onclick = function()
		{
			ptr.removeFilter(comboMeasure, comboOption, input, br, this);
		};
		//infoLabel.insertBefore(oImg, addButton);
		infoLabel.appendChild(oImg);
		
		
		//infoLabel.insertBefore(br, addButton);
		infoLabel.appendChild(br);
		
		filters.push({comboMeasure: comboMeasure, comboOption: comboOption, input: input});
	}
	
	this.removeFilter = function(comboM, comboO, inputLine, br, rmvButton)
	{
		infoLabel.removeChild(rmvButton);
		comboM.remove("filters_info");
		comboO.remove("filters_info");
		infoLabel.removeChild(inputLine);
		infoLabel.removeChild(br);
		filters.splice(filters.map(function(e) {return e.comboMeasure; }).indexOf(comboM),1);
		
	}
	
	this.show = function()
	{
		$('#filterModal').modal('show');
	}
}

function applyFilters()
{
    filteredSelection = [];
    
    for (var i = 0; i < selection.length; i++)
    {
        if(selection[i].measures)
        {
            var accept = true;
            for (var k = 0; k < filters.length && accept; k++)
            {
                var measure = filters[k].comboMeasure.getSelectedOption();
                var option = filters[k].comboOption.getSelectedOption();
                var value = filters[k].input.value;
                
                switch(option)
                {
                    case "exists":
                    
                        var exists = false;
                        for(var j = 0; j < selection[i].measures.length; j++)
                        {
                            if(selection[i].measures[j].name == measure) 
                            {
                                exists = true;
                            }  
                        }
                        if(exists == false)
                            accept = false;
                        
                    break;
                    case "doesn't exist":
                    
                        var exists = false;
                        for(var j = 0; j < selection[i].measures.length; j++)
                        {
                            if(selection[i].measures[j].name == measure) 
                            {
                                exists = true;
                            }  
                        }
                        if(exists == true)
                            accept = false;
                    
                    break;
                    case "is":
                    
                        var exists = false;
                        for(var j = 0; j < selection[i].measures.length; j++)
                        {
                            if(comboOption.isNum)
                            {
                                if((selection[i].measures[j].name == measure) && (parseFloat(selection[i].measures[j].value) == parseFloat(value))) 
                                {
                                    exists = true;
                                }  
                            }
                            else
                            {
                                if((selection[i].measures[j].name == measure) && (selection[i].measures[j].value == value)) 
                                {
                                    exists = true;
                                }  
                            }
                            
                        }
                        if(exists == false)
                            accept = false;
                    
                    break;
                    
                    case "is not":
                    
                        var exists = false;
                        for(var j = 0; j < selection[i].measures.length; j++)
                        {
                            if(comboOption.isNum)
                            {
                                if((selection[i].measures[j].name == measure) && (parseFloat(selection[i].measures[j].value) == parseFloat(value))) 
                                {
                                    exists = true;
                                }  
                            }
                            else
                            {
                                if((selection[i].measures[j].name == measure) && (selection[i].measures[j].value == value)) 
                                {
                                    exists = true;
                                }  
                            }
                            
                        }
                        if(exists == true)
                            accept = false;
                    
                    break;
                    case "is smaller than":
                    
                        var exists = false;
                        for(var j = 0; j < selection[i].measures.length; j++)
                        {
                            if((selection[i].measures[j].name == measure) && (parseFloat(selection[i].measures[j].value) < parseFloat(value))) 
                            {
                                exists = true;
                            }         
                        }
                        if(exists == false)
                            accept = false;
                    
                    break;
                    case "is bigger than":
                    
                        var exists = false;
                        for(var j = 0; j < selection[i].measures.length; j++)
                        {
                            if((selection[i].measures[j].name == measure) && (parseFloat(selection[i].measures[j].value) > parseFloat(value))) 
                            {
                                exists = true;
                            }         
                        }
                        if(exists == false)
                            accept = false;
                        
                    break;
                    case "is smaller or equal to":
                    
                        var exists = false;
                        for(var j = 0; j < selection[i].measures.length; j++)
                        {
                            if((selection[i].measures[j].name == measure) && (parseFloat(selection[i].measures[j].value) <= parseFloat(value))) 
                            {
                                exists = true;
                            }         
                        }
                        if(exists == false)
                            accept = false;
                    
                    break;
                    case "is bigger or equal to":
                    
                    var exists = false;
                        for(var j = 0; j < selection[i].measures.length; j++)
                        {
                            if((selection[i].measures[j].name == measure) && (parseFloat(selection[i].measures[j].value) >= parseFloat(value))) 
                            {
                                exists = true;
                            }         
                        }
                        if(exists == false)
                            accept = false;
                    
                    break;
                }
                
            }
            if(accept == true)
            {
                filteredSelection.push(i);
            }
        }
    }
         
    for (var i = 0; i < filteredSelection.length; i++)
    {
        console.log(selection[filteredSelection[i]]);
    }
        
        
    $('#filterModal').modal('hide');
}

