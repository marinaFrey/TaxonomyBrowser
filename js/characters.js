
function Characters()
{
	var charList;
	var charTypesList;
	
	this.createFile = function()
	{
		createCharactersFile();
	}
	
    this.createList = function()
    {
		$.getJSON("data/characters.json", function(json) 
		{
			charList = json;
			//console.log(json);
			return charList;
		});
	}
	
	this.createCharTypesList = function()
	{
		if(!charList)
			this.createList();
			
		charTypesList = {};
		for( var key in charList)
		{
			if(!charTypesList[charList[key].character_type_id])
			{
				charTypesList[charList[key].character_type_id] = charList[key].character_type_name;
			}
		}
		return charTypesList;
	}
	
	this.getCharTypesList = function()
	{
		return charTypesList;
	}
	
	this.getharTypesListAsOptions = function()
	{
		var new_list = [];
		for( var key in charTypesList)
		{
			new_list.push({name: charTypesList[key], isNum: false});
		}
		
		return new_list;
	}
	
	this.getList = function()
	{
		return charList;
	}
}