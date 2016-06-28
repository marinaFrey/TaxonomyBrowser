
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

function makeFilterPopup()
{
    var txtLabel = document.getElementById("myModalLabel");
    txtLabel.className = "modal-title";
	txtLabel.innerHTML = "<h1> Filters </h1>";
    
    var infoLabel = document.getElementById("info_text");
    infoLabel.innerHTML = "";
    
    combo = document.createElement("SELECT");
    combo.setAttribute("id", "sel");
    infoLabel.appendChild(combo);
    
    var oImg=document.createElement("img");
    oImg.setAttribute('src', 'images/remove.png');
    oImg.style.width= '32px';
    oImg.style.width= '32px';
    infoLabel.appendChild(oImg);
    
    var oImg=document.createElement("img");
    oImg.setAttribute('src', 'images/add.png');
    oImg.style.width= '32px';
    oImg.style.width= '32px';
    infoLabel.appendChild(oImg);
    
    $('#basicModal').modal('show');
}
