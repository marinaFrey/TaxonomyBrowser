
function Units()
{
	var unitList;
	
    this.createList = function()
    {
		createUnitsList();
	}
	
	this.receiveListFromDatabase = function(list)
	{
		unitList = JSON.parse(list);
	}
	
	this.getList = function()
	{
		return unitList;
	}
	
	this.getUnitListAsOptions = function()
	{
		var new_list = [{name:"unit undefined", isNum:false}];
		for( var key in unitList)
		{
			new_list.push({name: unitList[key].unit_name, isNum: false});
		}
		
		return new_list;
	}
	
	this.getIndexByUnitname = function(name)
	{
		for( var key in unitList)
		{
			if(unitList[key].unit_name == name)
			{
				return key;
			}
		}
	}
	
}