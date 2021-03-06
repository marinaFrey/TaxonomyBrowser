
/* FILES */

function createHierarchyFile()
{
	var user_info;
	if(userLoggedIn)
		user_info = {user_id: userLoggedIn.getID(), user_role: userLoggedIn.getRole()};
	else
		user_info = {user_id: "-1", user_role: "2"};
		
    waitingDialog.show('Getting Database...');
	
	var name = "lol";
    $.ajax({
        url: 'js/databaseInterface/php/generateCharactersList.php',
        type: 'POST',
        data: {id:name},
        success: function(data) 
        {
			//console.log(data);
			allCharactersList.receiveListFromDatabase(data);
			$.ajax({
				url: 'js/databaseInterface/php/generate_json_hierarchy.php',
				type: 'POST',
				data: {id:user_info},
				success: function(data) 
				{
					//console.log(data);
					sunburst.remove();
					//sunburst = new Sunburst();
					
					taxTreeData = JSON.parse(data);
					sunburst.create(taxTreeData);
					
					
					setTimeout(function()
					{
						waitingDialog.hide();
						selection = [];
						filteredSelection = ["all"];
						updateShownVisualizationAndOptions();
					}, 1000);
					
				},
				error:function(data)
				{
					alert("error");
				}
			});
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
			//console.log(data);
			allCharactersList.receiveListFromDatabase(data);
        },
        error:function(data)
        {
            alert("error");
        }
    });


}

function createRanksFile()
{
    var name = "lola";
    
    $.ajax({
        url: 'js/databaseInterface/php/generateRankList.php',
        type: 'POST',
        data: {id:name},
        success: function(data) 
        {
			//console.log(data);
			allRanksList.receiveListFromDatabase(data);
        },
        error:function(data)
        {
            alert("error");
        }
    });
    

}

function createUnitsList()
{
	var user = "lol";
	
	$.ajax({
        url: 'js/databaseInterface/php/generateUnitList.php',
        type: 'POST',
        data: {id:user},
        success: function(data) 
        {
			if(!data)
			{
				console.log("could not get units list");
			}
			else
			{
				//console.log(data);
				allUnitsList.receiveListFromDatabase(data);
			}
        },
        error:function(data)
        {
            alert("error");
        }
    });
	
}


function validateLogin(name,password)
{
	var user = {name:name, password:password};
	
	$.ajax({
        url: 'js/databaseInterface/php/login.php',
        type: 'POST',
        data: {id:user},
        success: function(data) 
        {
			if(!data)
			{
				wrongLogin();
			}
			else
			{
				//console.log(data);
				showUsersInformation(data);
				createHierarchyFile();
				hideLoginPopup();
			}
        },
        error:function(data)
        {
            alert("error:"+data);
        }
    });
	
}

function getAllUsers()
{
	waitingDialog.show('Loading Users From Database...');
	
	var user_info = "non";
	$.ajax({
        url: 'js/databaseInterface/php/getUsers.php',
        type: 'POST',
        data: {id:user_info},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
			var users = data;
			$.ajax({
				url: 'js/databaseInterface/php/generate_groups_list.php',
				type: 'POST',
				data: {id:user_info},
				success: function(data) 
				{
					//console.log(data); // Inspect this in your console
					waitingDialog.hide();
					makeUsersManagerPopup(users, data);
					
				},
				error:function(data)
				{
					alert("error");
				}
			});			
        },
        error:function(data)
        {
            alert("error");
        }
    });
}

function editUser(user_info)
{
	//var user = {name:name, password:password};

	$.ajax({
        url: 'js/databaseInterface/php/editUser.php',
        type: 'POST',
        data: {id:user_info},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
			if(!data)
			{
				showLoginConfigurationErrorBlock("Could not login with provided password.");
			}
			else
			{
				showUsersInformation(data);
				$('#loginConfigurationModal').modal('hide');
			}
        },
        error:function(data)
        {
            alert("error");
        }
    });
	
}

function editUsers(users_info)
{
	//var user = {name:name, password:password};

	$.ajax({
        url: 'js/databaseInterface/php/editUsers.php',
        type: 'POST',
        data: {id:users_info},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console

        },
        error:function(data)
        {
            alert("error");
        }
    });
	
}

function addUser(user_info)
{
	//var user = {name:name, password:password};
	
	$.ajax({
        url: 'js/databaseInterface/php/addUser.php',
        type: 'POST',
        data: {id:user_info},
        success: function(data) 
        {
            console.log(data); // Inspect this in your console
			if(!data)
			{

			}
			else
			{

			}
        },
        error:function(data)
        {
            alert("error");
        }
    });
	
}

function removeUser(user_id)
{
	var usr = {id: user_id};
    $.ajax({
        url: 'js/databaseInterface/php/deleteUser.php',
        type: 'POST',
        data: {id:usr},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
        },
        error:function(data)
        {
            alert("error");
        }
    });
    
    
}

function resetPassword(user_info)
{
	var user = {user_name:"marina", email:"marina.fortes.rey@gmail.com"};
	
	$.ajax({
        url: 'js/databaseInterface/php/resetUserPassword.php',
        type: 'POST',
        data: {id:user},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
			if(!data)
			{

			}
			else
			{

			}
        },
        error:function(data)
        {
            alert("error");
        }
    });
	
}

/* SPECIMEN */

function addSpecimen(specimen)
{
	var m = [];
	var characterLst = allCharactersList.getList();
	for(key in specimen.measures)
	{
		m.push({charId: key, charTypeId: characterLst[key].character_group_id, value: specimen.measures[key]});
	}

    var sp = 
	{
        taxonomy_id: specimen.taxonomy_id, 
        collection_ID: specimen.collection_id, 
        collected_by:specimen.collected_by, 
        data:specimen.collected_data, 
        latitude:specimen.latitude, 
        longitude:specimen.longitude, 
        altitude: specimen.altitude, 
        information: specimen.information, 
        measures:m,
		user_id: specimen.user_id,
		group_id: specimen.group_id
	}
    console.log(sp);
	
    $.ajax({
        url: 'js/databaseInterface/php/addSpecimen.php',
        type: 'POST',
        data: {id:sp},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
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
	var m = [];
	var characterLst = allCharactersList.getList();
	for(key in specimen.measures)
	{
		m.push({charId: key, charTypeId: characterLst[key].character_group_id, value: specimen.measures[key]});
	}

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
        measures:m,
		user_id:specimen.user_id,
		group_id:specimen.group_id
        }
    
    $.ajax({
        url: 'js/databaseInterface/php/editSpecimen.php',
        type: 'POST',
        data: {id:sp},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
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
	var species_id = {id: sp.id};
	/*
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
    
    updateFromFiltering();*/
    
    
    $.ajax({
        url: 'js/databaseInterface/php/deleteSpecimen.php',
        type: 'POST',
        data: {id:species_id},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
            createHierarchyFile();
        },
        error:function(data)
        {
            alert("error");
        }
    });
    
    
}

/* TAXONOMY */

function addTaxonomy(taxonomy, taxonomy_parent)
{
	var tx = {
		name: taxonomy.name,
        parent_taxonomy_id: taxonomy_parent.taxonomy_id, 
        rank: taxonomy.rank, 
        information: taxonomy.information, 
        characters:taxonomy.characters
        }
	console.log(tx);
    
    $.ajax({
        url: 'js/databaseInterface/php/addTaxonomy.php',
        type: 'POST',
        data: {id:tx},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
            createHierarchyFile();
        },
        error:function(data)
        {
            alert("error");
        }
    });
}	

function editTaxonomy(taxonomy)
{
	var parent;
	if(taxonomy.parent)
		parent = taxonomy.parent.taxonomy_id;
	else
		parent = "";
	var tx = {
		id: taxonomy.taxonomy_id,
		name: taxonomy.name,
        parent_taxonomy_id: parent, 
        rank: taxonomy.rank, 
        information: taxonomy.information, 
        characters:taxonomy.characters
        }
	console.log(tx);
    
    $.ajax({
        url: 'js/databaseInterface/php/editTaxonomy.php',
        type: 'POST',
        data: {id:tx},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
            createHierarchyFile();
        },
        error:function(data)
        {
            alert("error");
        }
    });
}

function removeTaxonomy(taxonomy)
{
	var tx = {id: taxonomy.taxonomy_id}
	console.log(tx);
    
    $.ajax({
        url: 'js/databaseInterface/php/deleteTaxonomy.php',
        type: 'POST',
        data: {id:tx},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
            createHierarchyFile();
        },
        error:function(data)
        {
            alert("error");
        }
    });
}

/* CHARACTERS */

function addCharacter(character)
{
    console.log(character);
    $.ajax({
        url: 'js/databaseInterface/php/addCharacter.php',
        type: 'POST',
        data: {id:character},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
            allCharactersList.createFile();
        },
        error:function(data)
        {
            alert("error");
        }
    });
}

function editCharacter(character)
{
	console.log("edit");
	console.log(character);
	
	$.ajax({
        url: 'js/databaseInterface/php/editCharacter.php',
        type: 'POST',
        data: {id:character},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
            allCharactersList.createFile();
        },
        error:function(data)
        {
            alert("error");
        }
    });
}

function removeCharacter(character)
{
	var char_id = {id: character.character_id};
	console.log("rmv");
	console.log(char_id);
	
	$.ajax({
        url: 'js/databaseInterface/php/deleteCharacter.php',
        type: 'POST',
        data: {id:char_id},
        success: function(data) 
        {
            //console.log(data); // Inspect this in your console
            allCharactersList.createFile();
        },
        error:function(data)
        {
            alert("error");
        }
    });
}


