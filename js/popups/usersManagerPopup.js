
function makeUsersManagerPopup(users_info, groups)
{
	if(userLoggedIn && userLoggedIn.getRole() == "1")
	{
		var users = JSON.parse(users_info);
		var grps = JSON.parse(groups);
		var manager = new UsersManager();
		manager.createInterface();
		manager.addUsers(users, grps);
	}
	else
	{
		alert("You must be logged in an Administrator account to access the Users Manager");
	}
}

function UsersManager()
{
	this.usersList = [];
	var toBeDeletedList;
	var pointer = this;
	
	this.createInterface = function()
	{
		var txtLabel = document.getElementById("myModalLabel");
		txtLabel.className = "modal-title";
		txtLabel.innerHTML = "<h1> Users </h1>";
    
		var submitButton = document.getElementById("submitButton");
		submitButton.style = "display:block;";
		submitButton.onclick = this.submit;
		
		cleanSpecimenMeasuresFromInputList();
		cleanTabs();
		
		var infoLabel = document.getElementById("info_text");
		infoLabel.innerHTML = "";
		
		var editTaxonomyButton = document.getElementById("editSpecimenButton");
		editTaxonomyButton.style = "display:none;";

		var removeTaxonomyButton = document.getElementById("removeSpecimenButton");
		removeTaxonomyButton.style = "display:none;";
		
		$('#basicModal').modal('show');
	}
	
	this.addUsers = function(users, groups)
	{
		var infoLabel = document.getElementById("info_text");
		for(var i=0; i < users.length; i++)
		{
			
			var usr = new User();
			usr.create(users[i].user_id,users[i].full_name,users[i].user_name,users[i].role_id,users[i].email, users[i].user_groups);
			
			this.usersList[i] = new Input();
			this.usersList[i].createUserForManaging(usr,infoLabel,this.removeUser, groups);
			
			
		}
		
	}

	this.removeUser = function()
	{	
		console.log(this);
		this.linePointer.toggleToBeDeleted(true);
		this.setAttribute('src', 'images/add.png');
		//this.style = "width:32px;opacity:1;";
		this.onclick = pointer.undoUserRemoval;
	}
	
	this.undoUserRemoval = function()
	{
		this.linePointer.toggleToBeDeleted(false);
		this.setAttribute('src', 'images/remove.png');
		this.onclick = pointer.removeUser;
	}
	
	this.submit = function()
	{
		var usersToBeEdited = [];
		console.log(pointer.usersList);
		for( var i = 0; i < pointer.usersList.length; i++)
		{
			var user = pointer.usersList[i].getUser();
			
			if(pointer.usersList[i].willBeDeleted())
			{
				removeUser(user.getID());
			}
			else
			{
				if(pointer.usersList[i].hasBeenChanged() )
				{	// updateUser($user_id, $role_id, $user_name, $user_password, $full_name, $email)
					console.log( pointer.usersList[i].getUsersNewGroups());
					usersToBeEdited.push({user_id:user.getID(), role_id: pointer.usersList[i].getTypeID(), user_groups: pointer.usersList[i].getUsersNewGroups()});
					
					console.log(usersToBeEdited);
					//if(character.character_name != "")
					//	editCharacter(character);
				}
				
			}
		}
		
		if(usersToBeEdited.length)
			editUsers(usersToBeEdited);
		
		$('#basicModal').modal('hide');
	}
	
}