

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
	
	//selectedViz.update(selection);
	var selViz = new selectedVisualization;
    selViz.create();
	selViz.update(selection);

}

function showDots()
{
	document.images["bars"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["matrix"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["dots"].style = " border: 2px solid yellow;border-radius: 22px;" 
	document.images["coord"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["map"].style = " border: 2px solid #6D6D6D;border-radius: 22px;"
	
	var dotsViz = new dotsVisualization;
    dotsViz.create();
	dotsViz.update(selection);
}

function showMap()
{
	document.images["bars"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["matrix"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["dots"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["coord"].style = " border: 2px solid #6D6D6D;border-radius: 22px;" 
	document.images["map"].style = " border: 2px solid yellow;border-radius: 22px;" 
	
	var mapsViz = new mapVisualization;
    mapsViz.create();
	mapsViz.update(selection);
}