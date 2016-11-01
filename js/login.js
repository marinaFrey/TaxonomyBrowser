
function showLoginPopup()
{
	var loginErrorAlert = document.getElementById("loginErrorAlert");	
	loginErrorAlert.style= "display:none";
	$('#loginModal').modal('show');
}

function submitLoginPopup()
{
	var usernameLineEdit = document.getElementById("username");	
	var passwordLineEdit = document.getElementById("password");
	
	validateLogin(usernameLineEdit.value,passwordLineEdit.value)
}

function wrongLogin()
{
	var loginErrorAlert = document.getElementById("loginErrorAlert");	
	loginErrorAlert.style= "display:block";
}

function showUsersInformation(user_info)
{
	var loginButton = document.getElementById("loginButton");	
	loginButton.style= "display:none";
	var userTab = document.getElementById("userTab");	
	userTab.style= "display:block";
	
	user = JSON.parse(user_info);
	
	userLoggedIn = new User();
	userLoggedIn.create(user.id, user.full_name,user.user_name,user.role, user.email);
	userLoggedIn.populateUserInterface();
}

function hideLoginPopup()
{
	$('#loginModal').modal('hide');
}

function logout()
{
	var loginButton = document.getElementById("loginButton");	
	loginButton.style= "display:block";
	var userTab = document.getElementById("userTab");	
	userTab.style= "display:none";
	
	userLoggedIn = [];
}

/* login configuration */

function changeUsersInfo()
{
	userLoggedIn.populateChangeUserInformationModal();
}

function submitChangesInUser()
{
	userLoggedIn.submitChanges();
}

function createNewUser()
{
}

function resetUsersPassword()
{

}

/* user */

function User()
{
	this.userName;
	this.fullName;
	this.userID;
	this.role;
	this.email;
	
	this.create = function(id,full_name,user_name,role,email)
	{
		this.userName = user_name;
		this.fullName = full_name;
		this.userID = id;
		this.role = role;
		this.email = email;
	}
	
	this.populateUserInterface = function()
	{
		var welcomeUserString = document.getElementById("welcomeUserString");	
		welcomeUserString.innerHTML = "<strong> Welcome, "+this.userName+" </strong>";
		
		var fullnameString = document.getElementById("fullnameString");	
		fullnameString.innerHTML = "<strong> "+this.fullName+" </strong>";
		
		var emailString = document.getElementById("emailString");	
		emailString.innerHTML = this.email;
		
		var userRole;
		if(this.role == "1")
			userRole = "Super User";
		else
			userRole = "Standard User";
			
		var roleString = document.getElementById("roleString");	
		roleString.innerHTML = userRole;

	}
	
	this.populateChangeUserInformationModal = function()
	{
		
		var usernameConfig = document.getElementById("usernameConfig");	
		usernameConfig.value = this.userName;
		var fullnameConfig = document.getElementById("fullnameConfig");	
		fullnameConfig.value = this.fullName;
		var emailConfig = document.getElementById("emailConfig");	
		emailConfig.value = this.email;
		
		$('#loginConfigurationModal').modal('show');
	}
	
	this.submitChanges = function()
	{
		var informationErrorAlert = document.getElementById("informationErrorAlert");
		
		var usernameConfig = document.getElementById("usernameConfig");	
		this.userName = usernameConfig.value;
		var fullnameConfig = document.getElementById("fullnameConfig");	
		this.fullName = fullnameConfig.value;
		var emailConfig = document.getElementById("emailConfig");	
		this.email = emailConfig.value;
		
		var passwordConfig = document.getElementById("passwordConfig");	
		var passwordConfirmationConfig = document.getElementById("passwordConfirmationConfig");	
		
		if(passwordConfig.value == passwordConfirmationConfig.value)
		{
			var oldPasswordConfig = document.getElementById("oldPasswordConfig");	
				
			var usr = {id:this.userID, password:oldPasswordConfig.value, full_name:this.fullName,user_name:this.userName,role:this.role, email:this.email};
			var result = editUser(usr);
			
			console.log(result);
			
		}
		else
		{
			informationErrorAlert.style = "display:block";
		}

	}
	
	this.getID = function()
	{
		return this.userID;
	}
	
}