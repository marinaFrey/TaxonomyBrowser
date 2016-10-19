

function makeAddSpecimenPopup(specimen)
{
    var txtLabel = document.getElementById("myModalLabel");
	txtLabel.className = "modal-title";
	txtLabel.innerHTML = "<h1> Add Specimen </h1>";
    
    var submitButton = document.getElementById("submitButton");
    submitButton.style = "display:block;";
    
    console.log(node);
    var taxonomy = node;
    var list = [];
    getTaxNames(taxonomy, list);

    
    var infoLabel = document.getElementById("info_text");
    infoLabel.innerHTML = "select new specimen's taxonomy: <br>";
    for( var i = 0; i < list.length; i++)
    {
        if(list[i])
        {
            var combo = new ComboBox();
            combo.createTaxonomyCombo(i,infoLabel,changingSelectedTaxonomy, list[i]);
            combo.updateOptions(list[i]);
            
        }
    }
    var br = document.createElement("br");
    infoLabel.appendChild(br);
    
    cleanSpecimenMeasuresFromInputList();
    
    // adding standard specimen information
    var newInput2 = new Input();
    newInput2.create("text",infoLabel, "Collection ID","","","", "");
    inputList['general_measures'].push(newInput2);
    var newInput3 = new Input();
    newInput3.create("text",infoLabel, "Collected by","","","", "");
    inputList['general_measures'].push(newInput3);
    var newInput4 = new Input();
    newInput4.create("text",infoLabel, "Data","","","" , "");
    inputList['general_measures'].push(newInput4);
    var newInput5 = new Input();
    newInput5.create("number",infoLabel, "Latitude","","", "", "");
    inputList['general_measures'].push(newInput5);
    var newInput6 = new Input();
    newInput6.create("number",infoLabel, "Longitude","","","", "");
    inputList['general_measures'].push(newInput6);
    var newInput7 = new Input();
    newInput7.create("text",infoLabel, "Information","","","", "");
    inputList['general_measures'].push(newInput7);
    
    
    var editSpecimenButton = document.getElementById("editSpecimenButton");
    editSpecimenButton.style = "display:none;";
    
    var removeSpecimenButton = document.getElementById("removeSpecimenButton");
    removeSpecimenButton.style = "display:none;";
    
    $('#basicModal').modal('show');
}

function getTaxNames(d, list)
{
    for( var i = 0; i < d.children.length; i++)
    {
        if(!list[d.rank])
            list[d.rank] = [];
            
        list[d.rank].push({name: d.children[i].name, isNum: false, taxonomy: d.children[i]});

        if(d.children[i].children && d.children[i].rank != "7")
        {   
            getTaxNames(d.children[i], list);
        }

            
    }
}

function changingSelectedTaxonomy()
{
        var index = this.list.map(function(e) { return e.name; }).indexOf(this.value);
        console.log(index);
        var characters = this.list[index].taxonomy.characters;
        
        console.log(characters);
        
        cleanTabs();
        inputList = [];
        
        
        
        var measuresGroupList = {};
        for(var i = 0; i < characters.length; i++)
        {
            if(measuresGroupList[characters[i].group])
            {

                measuresGroupList[characters[i].group].push(
                {
                    name: characters[i].name, 
                    value: "", 
                    type: characters[i].type,
                    charId: characters[i].charId,
                    charTypeId: characters[i].charTypeId,
                    information: characters[i].information
                });

            }
            else
            {
                var list = [];
                measuresGroupList[characters[i].group] = list;
                measuresGroupList[characters[i].group].push(
                {
                    name: characters[i].name, 
                    value: "", 
                    type: characters[i].type,
                    charId: characters[i].charId,
                    charTypeId: characters[i].charTypeId,
                    information: characters[i].information
                });
            }

        }
        
        for (var key in measuresGroupList) 
        {
            var tab_id = key.replace(/\s+/g, '');
            addTab(tab_id,key,measuresGroupList[key]);
        }
        
        for (var key in inputList) 
        {
            for( var i = 0; i < inputList[key].length; i++)
            {
                inputList[key][i].toggleEdition(true);
            }
        }
    
    
    
    
}
