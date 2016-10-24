var stockData = [  
            {
                Symbol: "AAPL",
                Company: "Apple Inc.",
                Price: 132.54
            },
            {
                Symbol: "INTC",
                Company: "Intel Corporation",
                Price: 33.45
            },
            {
                Symbol: "GOOG",
                Company: "Google Inc",
                Price: 554.52
            },
        ];
function exportSelection()
{
    var dataset;
    var specimen;
    var characterLst = allCharactersList.getList();

    if(filteredSelection[0] != "all")
    {
        dataset = [];
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
                    specimen[measureName] = selection[i].measures[charId_key];              
                }
            }
            if(specimen.collection_id)
                dataset.push(specimen);
        }
    }
    
    console.log(dataset);
        
        downloadCSV({ filename: "export.csv" }, dataset);
        /*
        // Create Object
        var items = [
              { name: "Item 1", color: "Green", size: "X-Large" },
              { name: "Item 2", color: "Green", size: "X-Large" },
              { name: "Item 3", color: "Green", size: "X-Large" }];

        // Convert Object to JSON
        var jsonObject = JSON.stringify(items);

        // Convert JSON to CSV & Display CSV
        console.log(ConvertToCSV(jsonObject));*/
    //});

}

function convertArrayOfObjectsToCSV(args) 
{  
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ';';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function ConvertToCSV(objArray) 
{
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) 
    {
        var line = '';
        for (var index in array[i]) 
        {
            if (line != '') line += ';'

            line += array[i][index];
        }
        str += line + '\r\n';
    }

    return str;
}

function downloadCSV(args, dataset) 
{  
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: dataset
        });
        if (csv == null) return;
        console.log(csv);
        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
        

        
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
}


