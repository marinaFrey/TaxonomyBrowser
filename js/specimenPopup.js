
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
	
    // creating info label to show all information on the specimen
    /*
	var info_text =
		"<h3><b>Collection ID: </b>" + specimen.collection_id +"<br />" +
		"<b>Collected by: </b>" + specimen.collected_by + "<br />" +
		"<b>Data: </b>" + specimen.collected_data +"<br />" +
		"<b>Latitude: </b>" + specimen.latitude + "<br />" +
		"<b>Longitude: </b>" + specimen.longitude + "<br />" +
		"<b>Information: </b>" + specimen.information;
	
    var infoLabel = document.getElementById("info_text");
	infoLabel.innerHTML = info_text;*/

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
    
    
    var infoLabel = document.getElementById("info_text");
    var newInput2 = new Input();
    newInput2.create("text",infoLabel, "Collection ID",specimen.collection_id);
    inputList['general_measures'].push(newInput2);
    var newInput3 = new Input();
    newInput3.create("text",infoLabel, "Collected by",specimen.collected_by);
    inputList['general_measures'].push(newInput3);
    var newInput4 = new Input();
    newInput4.create("text",infoLabel, "Data",specimen.collected_data);
    inputList['general_measures'].push(newInput4);
    var newInput5 = new Input();
    newInput5.create("number",infoLabel, "Latitude", specimen.latitude);
    inputList['general_measures'].push(newInput5);
    var newInput6 = new Input();
    newInput6.create("number",infoLabel, "Longitude", specimen.longitude);
    inputList['general_measures'].push(newInput6);
    var newInput7 = new Input();
    newInput7.create("text",infoLabel, "Information",specimen.information);
    inputList['general_measures'].push(newInput7);

    var measuresGroupList = {};
    // getting information from all its measures
	for(var i = 0; i < specimen.measures.length; i++)
	{
        if(measuresGroupList[specimen.measures[i].group])
        {
            measuresGroupList[specimen.measures[i].group].push({name: specimen.measures[i].name, value: specimen.measures[i].value, type:specimen.measures[i].type});
        }
        else
        {
            var list = [];
            measuresGroupList[specimen.measures[i].group] = list;
            measuresGroupList[specimen.measures[i].group].push({name: specimen.measures[i].name, value: specimen.measures[i].value, type:specimen.measures[i].type});
        }        
		//info_text += 
		//	"<h4><b>"+specimen.measures[i].name+": </b>" + specimen.measures[i].value +"<br /></h4>";
	}

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
    editSpecimenButton.onclick = function(){editSpecimenFields();/*editSpecimen(specimen);*/};
    
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
            newInputMeasures.create("text",div, measuresList[i].name, measuresList[i].value);
        else
            newInputMeasures.create("number",div, measuresList[i].name, measuresList[i].value);
            
        inputList[label].push(newInputMeasures);
    }
    

    measures_tab_content.appendChild(div);

};

function editSpecimenFields()
{
    var submitButton = document.getElementById("submitButton");
    submitButton.style = "display:block;";
    
    for( var i = 0; i < inputList['general_measures'].length; i++)
    {
        inputList['general_measures'][i].toggleEdition(true);
    }
    /*for( var i = 0; i < inputList.length; i++)
    {   console.log(inputList[i]);
        for( var j = 0; j < inputList[i].length; j++)
            {
                inputList[i][j].toggleEdition(true);
                console.log(inputList[i][j]);
            }
    }*/
    
}




