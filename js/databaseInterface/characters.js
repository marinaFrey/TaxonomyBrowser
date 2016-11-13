
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
		createCharactersFile();
	}
	
	this.receiveListFromDatabase = function(list)
	{
		charList = JSON.parse(list);
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
	
	this.getCharTypesListAsOptions = function()
	{
		var new_list = [];
		for( var key in charTypesList)
		{
			new_list.push({name: charTypesList[key], isNum: false});
		}
		
		return new_list;
	}
	
	this.gerCharTypesListAsOptionsWithStardardNomenclature = function()
	{
		var new_list = [];

		new_list.push({name: "text", isNum: false});
		new_list.push({name: "number", isNum: false});

		return new_list;
	}
	
	this.getCharTypeID = function(charType)
	{
		for( var key in charTypesList)
		{
			if(charTypesList[key] == charType)
				return key;
		}
		
	}
	
	this.getList = function()
	{
		return charList;
	}
}