var SELECTED_VIZ = 0;
var SCATTERPLOT_VIZ = 1;
var COORD_PARAL_VIZ = 2;
var DOTS_VIZ = 3;
var MAPS_VIZ = 4;
var active_visualization = 3;



var mapsViz;
var selViz;
var dotsViz;
var paralCoordViz;

/* SUNBURST EVENTS */

function showNodeInfo()
{
	console.log("info");
}

function addNode()
{
	console.log("add");
	//document.images["addButton"].src= "images/edit2.png";
}

function editNode()
{
	console.log("edit");
}

function removeNode()
{
	console.log("remove");
}

/* SELECTED SPECIMEN EVENTS */

function openFilters()
{
    filterPopup.show();
}

/* VISUALIZATION EVENTS */

function showBars()
{
	//document.images["bars"].style = " border: 4px solid yellow;border-radius: 38px;" 
	//document.images["matrix"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["dots"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["coord"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["map"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["nosel"].style = "display:none;";
    
	//active_visualization = SELECTED_VIZ;
    
    comboX.updateOptions([]);
    comboY.updateOptions([]);
    comboSize.updateOptions(generateNumericMeasuresList());
    comboColor.updateOptions(["specimen"]);

	selViz = new selectedVisualization;
    selViz.create();
	if(selection[0])
		selViz.update(selection);

}

function showParallelCoord()
{
	//document.images["bars"].style =" border: 4px solid #6D6D6D;border-radius: 38px;" 
	//document.images["matrix"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["dots"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["coord"].style =" border: 4px solid yellow;border-radius: 38px;" 
	document.images["map"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
    document.images["nosel"].style = "display:none;";
    document.images["nofiltersel"].style = "display:none;";
    
	active_visualization = COORD_PARAL_VIZ;
	
	comboX.hide();
    comboY.hide();
    comboSize.hide();
    comboColor.hide();
	
	var list = generateNumericMeasuresList();
	
	multipleCombos.updateOptions(list);
	multipleCombos.show();

    if(firstTimeMultipleCombos)
    {
        multipleCombos.setDifferentIndexes();
        firstTimeMultipleCombos = false;
        
    }
    
	ParallelCoordinates();
	
	/*
	paralCoordViz = new ParallelCoordinates();
	paralCoordViz.create();
	if(selection[0])
		paralCoordViz.update(selection);*/
	
}

function showDots()
{
	//document.images["bars"].style =" border: 4px solid #6D6D6D;border-radius: 38px;" 
	//document.images["matrix"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["dots"].style = " border: 4px solid yellow;border-radius: 38px;" 
	document.images["coord"].style =" border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["map"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["nosel"].style = "display:none;";
    document.images["nofiltersel"].style = "display:none;";
    
	active_visualization = DOTS_VIZ;
	
    multipleCombos.hide();
    comboX.show();
    comboY.show();
    comboSize.show();
    comboColor.show();
    
	var list = generateNumericMeasuresList();
	
    comboX.updateOptions(list);
    comboY.updateOptions(list);
    comboSize.updateOptions(list);
    comboColor.updateOptions([{name:"specimen",isNum:false}]);
    
    if(firstTimeCombos)
    {
        comboX.setSelectedOption(0);
        comboY.setSelectedOption(1);
        comboSize.setSelectedOption(2);
        firstTimeCombos = false;
    }
    
	dotsViz = new dotsVisualization;
    dotsViz.create();
	
	if(selection[0])
		dotsViz.update(selection);
}

function showMap()
{
	//document.images["bars"].style =" border: 4px solid #6D6D6D;border-radius: 38px;" 
	//document.images["matrix"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["dots"].style =" border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["coord"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["map"].style = " border: 4px solid yellow;border-radius: 38px;" 
	document.images["nosel"].style = "display:none;";
    document.images["nofiltersel"].style = "display:none;";
    
	active_visualization = MAPS_VIZ;
	
    multipleCombos.hide();
    comboX.hide();
    comboY.hide();
    comboSize.hide();
    comboColor.show();
    
	comboX.updateOptions([]);
    comboY.updateOptions([]);
    comboSize.updateOptions([]);
    comboColor.updateOptions([{name:"specimen",isNum:false}]);
    
	mapsViz = new mapVisualization;
    mapsViz.create();
	if(selection[0])
		mapsViz.update(selection);

}

/* UPDATE EVENTS */

function updateShownVisualization()
{
	
	switch(active_visualization)
	{
		case SELECTED_VIZ:
			//selViz.update(selection);
		break;
		
		case SCATTERPLOT_VIZ:	
		break;
		
		case COORD_PARAL_VIZ:
			ParallelCoordinates();
		break;
		
		case DOTS_VIZ:
			multipleCombos.hide();
			dotsViz.update(selection);
		break;
		
		case MAPS_VIZ:
			multipleCombos.hide();
			mapsViz.update(selection);
		break;
	}
	
}

function updateFromFiltering()
{
	selectedSpecimens();
	selectedNumber.update();
    if(filteredSelection.length == 0)
    {
        document.images["nofiltersel"].style = "display:block;";
        document.getElementById("sel_viz").style = "display:none;";
        document.getElementById("maps").style = "display:none;";
    }
    else
    {
        switch(active_visualization)
        {
            case SELECTED_VIZ:
                //selViz.update(selection);
            break;
            
            case SCATTERPLOT_VIZ:
            
            break;
            
            case COORD_PARAL_VIZ:
                showParallelCoord();
            break;
            
            case DOTS_VIZ:    
                showDots();
            break;
            
            case MAPS_VIZ:
                showMap();
            break;
        }
    }
    
	
}

function updateShownVisualizationAndOptions()
{
    filteredSelection = [];
    filteredSelection.push("all");
    selectedSpecimens();
    selectedNumber.update();
    if(selection.length == 0)
    {
        document.images["nosel"].style = "display:block;";
        document.getElementById("sel_viz").style = "display:none;";
        document.getElementById("maps").style = "display:none;";
    }
    else
    {
        document.images["nofiltersel"].style = "display:none;";
        document.images["nosel"].style = "display:none;";
        
        var newOptionsList = [{name:"Collection ID", isNum:false},
                                {name:"Collected by", isNum:false},
                                {name:"Data", isNum:false},
                                {name:"Latitude", isNum:true},
                                {name:"Longitude", isNum:false}
                             ].concat(generateMeasuresList());
        updateFilterOptions(newOptionsList);
        

        
        switch(active_visualization)
        {
            case SELECTED_VIZ:
                showBars();
            break;
            
            case SCATTERPLOT_VIZ:		
            break;
            
            case COORD_PARAL_VIZ:
                showParallelCoord();          
            break;
            
            case DOTS_VIZ:
                showDots();
            break;
            
            case MAPS_VIZ:
                showMap();
            break;
        }
    }
    

	
	
}