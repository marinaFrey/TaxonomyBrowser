
function createHierarchyFile()
{
    var name = "joaozinho";
    
    $.ajax({
        url: 'js/databaseInterface/php/generate_json_hierarchy.php',
        type: 'POST',
        data: {id:name},
        success: function(data) 
        {
            console.log(data); // Inspect this in your console
        },
        error:function(data)
        {
            alert("error");
        }
    });
    

}

function createCharactersFile()
{
    var name = "lol";
    
    $.ajax({
        url: 'js/databaseInterface/php/generateCharactersList.php',
        type: 'POST',
        data: {id:name},
        success: function(data) 
        {
            console.log(data); // Inspect this in your console
        },
        error:function(data)
        {
            alert("error");
        }
    });
    

}

function addSpecimen(specimen)
{
    var sp = {
        taxonomy_id: specimen.taxonomy_id, 
        collection_ID: specimen.collection_id, 
        collected_by:specimen.collected_by, 
        data:specimen.collected_data, 
        latitude:specimen.latitude, 
        longitude:specimen.longitude, 
        altitude: specimen.altitude, 
        information: specimen.information, 
        measures:specimen.measures
        }
    
    $.ajax({
        url: 'js/databaseInterface/php/addSpecimen.php',
        type: 'POST',
        data: {id:sp},
        success: function(data) 
        {
            console.log(data); // Inspect this in your console
            createHierarchyFile();
        },
        error:function(data)
        {
            alert("error");
        }
    });

}

function editSpecimen(specimen)
{

    var sp = {
        id:specimen.id, 
        taxonomy_id: specimen.taxonomy_id, 
        collection_ID: specimen.collection_id, 
        collected_by:specimen.collected_by, 
        data:specimen.collected_data, 
        latitude:specimen.latitude, 
        longitude:specimen.longitude, 
        altitude: specimen.altitude, 
        information: specimen.information, 
        measures:specimen.measures
        }
    
    $.ajax({
        url: 'js/databaseInterface/php/editSpecimen.php',
        type: 'POST',
        data: {id:sp},
        success: function(data) 
        {
            console.log(data); // Inspect this in your console
            createHierarchyFile();
        },
        error:function(data)
        {
            alert("error");
        }
    });

}

function removeSpecimen(sp)
{
    console.log(filteredSelection);
    var species_id = {id: sp.id};
    var index = selection.map(function(e) { return e.id; }).indexOf(species_id.id);
    if(filteredSelection[0] != "all")
    {
        var filtered_index = filteredSelection.indexOf(index);
        for (var i = filtered_index; i < filteredSelection.length; i++)
        {
            if(filteredSelection[i] >= filtered_index)
                filteredSelection[i] = filteredSelection[i] - 1;
        }

        filteredSelection.splice(filtered_index,1);
    }
        
    selection.splice(index,1);
    //console.log(node);
    
    updateFromFiltering();
    
    /*
    $.ajax({
        url: 'js/databaseInterface/php/deleteSpecimen.php',
        type: 'POST',
        data: {id:species_id},
        success: function(data) 
        {
            console.log(data); // Inspect this in your console
            createHierarchyFile();
        },
        error:function(data)
        {
            alert("error");
        }
    });*/
    
    
}

function addTaxnomy()
{

}

function editTaxonomy()
{

}

function removeTaxonomy()
{

}
