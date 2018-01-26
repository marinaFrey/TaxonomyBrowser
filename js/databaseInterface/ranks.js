
function Ranks()
{
	var rankList;
	
	this.createList = function()
	{
		createRanksFile();
	}
	
	this.receiveListFromDatabase = function(list)
	{
		console.log(list);
		rankList = JSON.parse(list);
	}
	/*
    this.createList = function()
    {
		$.getJSON("data/ranks.json", function(json) 
		{
			rankList = json;
			return rankList;
		});
	}
	*/
	this.getList = function()
	{
		return rankList;
	}
	
	this.getRankListAsOptions = function()
	{
		var new_list = [];
		for( var key in rankList)
		{
			new_list.push({name: rankList[key], isNum: false});
		}
		
		return new_list;
	}
	
	this.getIndexByRankname = function(name)
	{
		for( var key in rankList)
		{
			if(rankList[key] == name)
			{
				return key;
			}
		}
	}
}