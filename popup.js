
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

function FilterPopup()
{
	var infoLabel;
	var addButton;
	var measuresList;
	var operationsListNumeric = ["exists","is","is not","is smaller than","is bigger than","is smaller or equal to","is bigger or equal to"];
	var operationsListString = ["exists","is", "is not"]
	var ptr = this;
	
	this.create = function()
	{
		var txtLabel = document.getElementById("filterModalLabel");
		txtLabel.className = "modal-title";
		txtLabel.innerHTML = "<h1> Filters </h1>";
		
		infoLabel = document.getElementById("filters_info");
		infoLabel.innerHTML = "";
		
		
		
		addButton=document.createElement("img");
		addButton.setAttribute('src', 'images/add.png');
		addButton.style.width= '64px';
		addButton.style.width= '64px';
		infoLabel.appendChild(addButton);
		addButton.onclick = function()
		{
			ptr.addFilter();
		};
		
		
	}
	
	this.addFilter = function()
	{

		var comboMeasure = new ComboBox();
		comboMeasure.createFilterCombo("comboMeasure", addButton, function()
		{
			console.log("hello world");
		});
		comboMeasure.updateOptions(generateMeasuresList());
		
		var comboOption = new ComboBox();
		comboOption.createFilterCombo("comboOption", addButton, function()
		{
			console.log("hello world");
		});
		comboOption.updateOptions(operationsListNumeric);
		
		var input = document.createElement("input");
        input.type = "text";
		infoLabel.insertBefore(input, addButton);
		
		var br = document.createElement("br");
		
		var oImg=document.createElement("img");
		oImg.setAttribute('src', 'images/remove.png');
		oImg.style.width= '32px';
		oImg.style.width= '32px';
		oImg.onclick = function()
		{
			ptr.removeFilter(comboMeasure, comboOption, input, br, this);
		};
		infoLabel.insertBefore(oImg, addButton);
		
		
		infoLabel.insertBefore(br, addButton);
		
		filters.push({comboMeasure: comboMeasure, comboOption: comboOption, input: input});
	}
	
	this.removeFilter = function(comboM, comboO, inputLine, br, rmvButton)
	{
		infoLabel.removeChild(rmvButton);
		comboM.remove("filters_info");
		comboO.remove("filters_info");
		infoLabel.removeChild(inputLine);
		infoLabel.removeChild(br);
		filters.splice(filters.map(function(e) {return e.comboMeasure; }).indexOf(comboM),1);
		
	}
	
	this.show = function()
	{
		$('#filterModal').modal('show');
	}
}

