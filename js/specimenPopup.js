
var inputList = {};

/*
 * Gets info from selected specimen and shows it in bootstrap's popup
 */
function makeSpecimenPopup(specimen)
{
    // creating title from specimen's name (currently its species)
	var txtLabel = document.getElementById("myModalLabel");
	txtLabel.className = "modal-title";
	txtLabel.innerHTML = "<h1>"+specimen.name+" ( "+ specimen.collection_id +" )</h1>";

    // removing all inputs from previous selected specimen
    if(inputList['general_measures'])
    {
        for( var i = 0; i < inputList['general_measures'].length; i++)
        {
            inputList['general_measures'][i].remove();
        }
        inputList['general_measures'] = [];
    }
    else
    {
        console.log("listanova");
        var list2 = [];
        inputList['general_measures'] = list2;
    }
    
    // adding standard specimen information
    var infoLabel = document.getElementById("info_text");
    var newInput2 = new Input();
    newInput2.create("text",infoLabel, "Collection ID",specimen.collection_id, "");
    inputList['general_measures'].push(newInput2);
    var newInput3 = new Input();
    newInput3.create("text",infoLabel, "Collected by",specimen.collected_by, "");
    inputList['general_measures'].push(newInput3);
    var newInput4 = new Input();
    newInput4.create("text",infoLabel, "Data",specimen.collected_data , "");
    inputList['general_measures'].push(newInput4);
    var newInput5 = new Input();
    newInput5.create("number",infoLabel, "Latitude", specimen.latitude, "");
    inputList['general_measures'].push(newInput5);
    var newInput6 = new Input();
    newInput6.create("number",infoLabel, "Longitude", specimen.longitude, "");
    inputList['general_measures'].push(newInput6);
    var newInput7 = new Input();
    newInput7.create("text",infoLabel, "Information",specimen.information, "");
    inputList['general_measures'].push(newInput7);

    var measuresGroupList = {};
    // getting information from all its measures and separating them according to their groups
	for(var i = 0; i < specimen.measures.length; i++)
	{
        if(measuresGroupList[specimen.measures[i].group])
        {
            measuresGroupList[specimen.measures[i].group].push(
            {
                name: specimen.measures[i].name, 
                value: specimen.measures[i].value, 
                type: specimen.measures[i].type,
                information: specimen.measures[i].information
            });
        }
        else
        {
            var list = [];
            measuresGroupList[specimen.measures[i].group] = list;
            measuresGroupList[specimen.measures[i].group].push(
            {
                name: specimen.measures[i].name, 
                value: specimen.measures[i].value, 
                type: specimen.measures[i].type,
                information: specimen.measures[i].information
            });
        }        
	}
    
    // getting all characteristics inherited from species yet not populated on specimen, to be able to populate when edited
    var fullCharacterList = specimen.parent.characters;
    console.log(fullCharacterList);
    console.log(measuresGroupList);
    for(var i = 0; i < fullCharacterList.length; i++)
    {
        if(measuresGroupList[fullCharacterList[i].group])
        {
            if( measuresGroupList[fullCharacterList[i].group].map(function(e) { return e.name; }).indexOf(fullCharacterList[i].name) == -1)
            {
                measuresGroupList[fullCharacterList[i].group].push(
                {
                    name: fullCharacterList[i].name, 
                    value: "", 
                    type: fullCharacterList[i].type,
                    information: fullCharacterList[i].information
                });
            }
        }
        else
        {
            var list = [];
            measuresGroupList[fullCharacterList[i].group] = list;
            measuresGroupList[fullCharacterList[i].group].push(
            {
                name: fullCharacterList[i].name, 
                value: "", 
                type: fullCharacterList[i].type,
                information: fullCharacterList[i].information
            });
            console.log("nao existia o grupo!");
        }
        /*
        if(measuresGroupList[fullCharacterList[i].group].map(function(e) { return e.name; }).indexOf(fullCharacterList[i].name) == -1)
        {
            measuresGroupList[fullCharacterList[i].group].push({name: fullCharacterList[i].name, value: "", type: fullCharacterList[i].type});
        }*/
    }
    console.log(measuresGroupList);

    var measures_tab_list = document.getElementById("measures_tab_list");
    var measures_tab_content = document.getElementById("measures_tab_content");
    while (measures_tab_list.firstChild) 
    {
        measures_tab_list.removeChild(measures_tab_list.firstChild);
    }
    while (measures_tab_content.firstChild) 
    {
        measures_tab_content.removeChild(measures_tab_content.firstChild);
    }
    

    var i = 0;
    for (var key in measuresGroupList) 
    {
        var tab_id = key.replace(/\s+/g, '');
        addTab(tab_id,key,measuresGroupList[key]);
    }

    
    var addSpecimenButton = document.getElementById("addSpecimenButton");
    addSpecimenButton.onclick = function(){addSpecimen(specimen);};
    
    var editSpecimenButton = document.getElementById("editSpecimenButton");
    editSpecimenButton.onclick = function(){editSpecimenFields(specimen);/*editSpecimen(specimen);*/};
    
    var removeSpecimenButton = document.getElementById("removeSpecimenButton");
    removeSpecimenButton.onclick = function()
    {
        if (confirm("Do you really want to delete this specimen? This action can't be undone") == true) 
        {
            removeSpecimen(specimen);
            $('#basicModal').modal('hide');
        }
    };
    
	$('#basicModal').modal('show');
}

function addTab(id, label, measuresList )
{
    // creating tab list entry
    var measures_tab_list = document.getElementById("measures_tab_list");   
    var list = document.createElement('li');
    if(!measures_tab_list.firstChild)
        list.setAttribute('class',"active");
    var entry = document.createElement('a');
    entry.setAttribute('data-toggle', 'tab');
    entry.setAttribute('href', "#" + id);
    
    entry.innerHTML = label;

    list.appendChild(entry);
    measures_tab_list.appendChild(list);
    
    // creating content entry
    var measures_tab_content = document.getElementById("measures_tab_content");
    var div = document.createElement('div');
    if(!measures_tab_content.firstChild)
        div.setAttribute('class',"tab-pane fade in active");
    else
        div.setAttribute('class', "tab-pane fade");
    div.setAttribute('id', id);
    
    var br = document.createElement("br");
        div.appendChild(br);
    
    var list = [];
    inputList[label] = list;
    
    for( var i = 0; i < measuresList.length; i++)
    {
        var newInputMeasures = new Input();
        if(measuresList[i].type == 'string')
            newInputMeasures.create("text",div, measuresList[i].name, measuresList[i].value, measuresList[i].information);
        else
            newInputMeasures.create("number",div, measuresList[i].name, measuresList[i].value, measuresList[i].information);
            
        inputList[label].push(newInputMeasures);
    }
    

    measures_tab_content.appendChild(div);

};

function editSpecimenFields(specimen)
{
    var submitButton = document.getElementById("submitButton");
    submitButton.style = "display:block;";
    
    
    for (var key in inputList) 
    {
        for( var i = 0; i < inputList[key].length; i++)
        {
            inputList[key][i].toggleEdition(true);
        }
    }


    var submitEditSpecimenButton = document.getElementById("submitButton");
    submitEditSpecimenButton.onclick = function()
    {
        submitButton.style = "display:none;";
        
        specimen.collection_id = inputList['general_measures'][0].getValue();
        specimen.collected_by = inputList['general_measures'][1].getValue();
        specimen.collected_data = inputList['general_measures'][2].getValue();
        specimen.latitude = inputList['general_measures'][3].getValue();
        specimen.longitude = inputList['general_measures'][4].getValue();
        specimen.information = inputList['general_measures'][5].getValue();

        for (var key in inputList) 
        {

                for( var i = 0; i < inputList[key].length; i++)
                {
                    var index = specimen.measures.map(function(e) { return e.name; }).indexOf(inputList[key][i].getLabelName());
                    if(index >= 0)
                    {
                        specimen.measures[index].value = inputList[key][i].getValue();
                        
                    }
                    else
                    {
                        if(inputList[key][i].getValue() != "")
                        {
                            specimen.measures.push(
                            {
                                name: inputList[key][i].getLabelName(), 
                                value: inputList[key][i].getValue(), 
                                type: inputList[key][i].getType(),
                                information: inputList[key][i].getInformation()
                            });
                        }
                        else
                        {
                        
                        }
                    }
                    inputList[key][i].toggleEdition(false);
                }
            
        }
        console.log(specimen);
        //editSpecimen(specimen);
    };
    
}




