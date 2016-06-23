var SELECTED_VIZ = 0;
var SCATTERPLOT_VIZ = 1;
var COORD_PARAL_VIZ = 2;
var DOTS_VIZ = 3;
var MAPS_VIZ = 4;
var active_visualization = 0;

var comboX;
var comboY;
var comboSize;

var mapsViz;
var selViz;
var dotsViz;

/* SUNBURST EVENTS */

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

/* VISUALIZATION EVENTS */

function showBars()
{
	document.images["bars"].style = " border: 2px solid yellow;border-radius: 22px;" 
	document.images["matrix"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["dots"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["coord"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["map"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	
	active_visualization = SELECTED_VIZ;

	selViz = new selectedVisualization;
    selViz.create();
	if(selection[0])
		selViz.update(selection);

}

function showDots()
{
	document.images["bars"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["matrix"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["dots"].style = " border: 2px solid yellow;border-radius: 22px;" 
	document.images["coord"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["map"].style = " border: 2px solid #6D6D6D;border-radius: 22px;"
	
	active_visualization = DOTS_VIZ;
	
	dotsViz = new dotsVisualization;
    dotsViz.create();
	
	comboX = new ComboBox();
	comboX.create("X","comboX");
	comboX.updateOptions(generateNumericMeasuresList());
	
	comboY = new ComboBox();
	comboY.create("Y","comboY");
	comboY.updateOptions(generateNumericMeasuresList());
	
	comboSize = new ComboBox();
	comboSize.create("Size","comboSize");
	comboSize.updateOptions(generateNumericMeasuresList());
	
	if(selection[0])
		dotsViz.update(selection);
}

function showMap()
{
	document.images["bars"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["matrix"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["dots"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["coord"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["map"].style = " border: 2px solid yellow;border-radius: 22px;" 
	
	active_visualization = MAPS_VIZ;
	
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
			selViz.update(selection);
		break;
		
		case SCATTERPLOT_VIZ:
		
		break;
		
		case COORD_PARAL_VIZ:
		
		break;
		
		case DOTS_VIZ:
			dotsViz.update(selection);
		break;
		
		case MAPS_VIZ:
			mapsViz.update(selection);
		break;
	}
	
}