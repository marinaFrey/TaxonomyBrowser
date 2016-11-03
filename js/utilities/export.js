
function exportSelection()
{
    var dataset;
	var measuresUsed;
    var specimen;
    var characterLst = allCharactersList.getList();

    if(filteredSelection[0] != "all")
    {
        dataset = [];
        measuresUsed = [];
        // for showing a circle all 3 variables selected must exist
        // so it's made a check to confirm if the specimen has a value to all 3 before showing
        for (var i = 0; i < filteredSelection.length; i++)
        {
            specimen = {};
            specimen['collection_id'] = selection[filteredSelection[i]].collection_id;
            specimen['collected_data'] = selection[filteredSelection[i]].collected_data;
            specimen['latitude'] = selection[filteredSelection[i]].latitude;
            specimen['longitude'] = selection[filteredSelection[i]].longitude;

            
            if(selection[filteredSelection[i]].measures)
            {	
                for(var charId_key in  selection[filteredSelection[i]].measures) 
                {
                    var measureName = characterLst[charId_key].character_name;
					measuresUsed[charId_key] = measureName;
                    specimen[measureName] = selection[filteredSelection[i]].measures[charId_key];                      
                }
            }
            if(specimen.collection_id)
                dataset.push(specimen);
        }
    }
    else
    {
        // if there is no filter applied, all selection is used 
        dataset= [];
        measuresUsed= [];
        // for showing a circle all 3 variables selected must exist
        // so it's made a check to confirm if the specimen has a value to all 3 before showing
        for (var i = 0; i < selection.length; i++)
        {
            specimen = {};
            specimen['collection_id'] = selection[i].collection_id;
            specimen['collected_data'] = selection[i].collected_data;
            specimen['latitude'] = selection[i].latitude;
            specimen['longitude'] = selection[i].longitude;
            
            if(selection[i].measures)
            {
                for(var charId_key in  selection[i].measures) 
                {
                    var measureName = characterLst[charId_key].character_name;
					measuresUsed[charId_key] = measureName;
					specimen[measureName] = selection[i].measures[charId_key];              
                }
            }
            if(specimen.collection_id)
                dataset.push(specimen);
        }
    }
	
	var measuresUsedList = ['collection_id','collected_data','latitude','longitude'];
	for ( var item in measuresUsed )
	{
		measuresUsedList.push( measuresUsed[ item ] );
	}

	downloadCSV({ filename: "export.csv" }, dataset, measuresUsedList);

}

function convertArrayOfObjectsToCSV(args, measuresUsedList) 
{  
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ';';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = measuresUsedList; //Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) 
	{
        ctr = 0;
        keys.forEach(function(key) 
		{
            if (ctr > 0) result += columnDelimiter;
			if(item[key])
				result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCSV(args, dataset, measuresUsedList) 
{  
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: dataset 
        }, measuresUsedList);
        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) 
		{
            csv = 'data:text/csv;charset=utf-8,' + csv;
            //location.href = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
		
		a = document.createElement('a');
		document.body.appendChild(a);
		a.download = filename;
		a.href = data;
		a.click();
}


