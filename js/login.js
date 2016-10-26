
function showLoginPopup()
{
	var loginPopup = new LoginPopup();
	loginPopup.show();
}

function LoginPopup()
{
	this.show = function()
	{
		//$('#loginModal').class="modal show";
		$('#loginModal').modal('show');
	}
	
	this.hide = function()
	{
		$('#loginModal').modal('hide');
	}
	
}