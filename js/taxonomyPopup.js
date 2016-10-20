var RANK_SPECIES = "7";

function makeTaxonomyPopup(taxonomy)
{
    console.log(taxonomy);
    
    // creating title from taxonomy's name
	var txtLabel = document.getElementById("myModalLabel");
	txtLabel.className = "modal-title";
	txtLabel.innerHTML = "<h1>"+taxonomy.name+" </h1>";

    cleanSpecimenMeasuresFromInputList();
    
    // adding standard specimen information
    var infoLabel = document.getElementById("info_text");
    var newInput2 = new Input();
    newInput2.create("text",infoLabel, "Name","","",taxonomy.name, "");
    inputList['general_measures'].push(newInput2);
    var newInput3 = new Input();
    newInput3.create("text",infoLabel, "Rank","","",taxonomy.rank, "");
    inputList['general_measures'].push(newInput3);
    var newInput4 = new Input();
    newInput4.create("text",infoLabel, "Number of Specimens in Database","","",taxonomy.value , "");
    inputList['general_measures'].push(newInput4);
    var newInput5 = new Input();
    newInput5.create("number",infoLabel, "Information","","", taxonomy.information, "");
	inputList['general_measures'].push(newInput5);

	
    $('#basicModal').modal('show');
}