
function Ranks()
{
	var rankList;
	
	this.createFile = function()
	{
		createRanksFile();
	}
	
    this.createList = function()
    {
		$.getJSON("data/ranks.json", function(json) 
		{
			rankList = json;
			return rankList;
		});
	}
	
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