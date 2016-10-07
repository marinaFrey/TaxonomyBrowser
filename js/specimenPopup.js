
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
	var info_text =
		"<h3><b>Collection ID: </b>" + specimen.collection_id +"<br />" +
		"<b>Collected by: </b>" + specimen.collected_by + "<br />" +
		"<b>Data: </b>" + specimen.collected_data +"<br />" +
		"<b>Latitude: </b>" + specimen.latitude + "<br />" +
		"<b>Longitude: </b>" + specimen.longitude + "<br />" +
		"<b>Information: </b>" + specimen.information + 
		"<br /><br /></h3> <h2><b>Measures: </b></h2><br /><br />";
	
    // getting information from all its measures
	for(var i = 0; i < specimen.measures.length; i++)
	{
		info_text += 
			"<h4><b>"+specimen.measures[i].name+": </b>" + specimen.measures[i].value +"<br /></h4>";

	}
	
	var infoLabel = document.getElementById("info_text");
	infoLabel.innerHTML = info_text;
	
	$('#basicModal').modal('show');
}

