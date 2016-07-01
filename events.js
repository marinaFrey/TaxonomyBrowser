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
	document.images["matrix"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["dots"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["coord"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["map"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	
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
	document.images["matrix"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["dots"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["coord"].style =" border: 4px solid yellow;border-radius: 38px;" 
	document.images["map"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
    
	active_visualization = COORD_PARAL_VIZ;
	/*
	comboX.hide();
    comboY.hide();
    comboSize.hide();
    comboColor.hide();*/
	
	var list = generateNumericMeasuresList();
	
	multipleCombos.updateOptions(list);
	//multipleCombos.show();

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
	document.images["matrix"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["dots"].style = " border: 4px solid yellow;border-radius: 38px;" 
	document.images["coord"].style =" border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["map"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	
	active_visualization = DOTS_VIZ;
	
	var list = generateNumericMeasuresList();
	

    comboX.updateOptions(list);
    comboY.updateOptions(list);
    comboSize.updateOptions(list);
    comboColor.updateOptions(["specimen"]);
    
	dotsViz = new dotsVisualization;
    dotsViz.create();
	
	if(selection[0])
		dotsViz.update(selection);
}

function showMap()
{
	//document.images["bars"].style =" border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["matrix"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["dots"].style =" border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["coord"].style = " border: 4px solid #6D6D6D;border-radius: 38px;" 
	document.images["map"].style = " border: 4px solid yellow;border-radius: 38px;" 
	
	active_visualization = MAPS_VIZ;
	
    //comboX.hide();
    //comboY.hide();
    //comboSize.hide();
	comboX.updateOptions([]);
    comboY.updateOptions([]);
    comboSize.updateOptions([]);
    comboColor.updateOptions(["specimen"]);
    
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

function updateShownVisualizationAndOptions()
{
	var newOptionsList = ["Collection ID", "Collected by", "Data", "Latitude", "Longitude"].concat(generateMeasuresList())
	updateFilterOptions(newOptionsList);
	filteredSelection = ["all"];

	selectedSpecimens();
	switch(active_visualization)
	{
		case SELECTED_VIZ:

            showBars();
		break;
		
		case SCATTERPLOT_VIZ:
		
		break;
		
		case COORD_PARAL_VIZ:
		
		break;
		
		case DOTS_VIZ:

            showDots();
		break;
		
		case MAPS_VIZ:

            showMap();
		break;
	}
	
}