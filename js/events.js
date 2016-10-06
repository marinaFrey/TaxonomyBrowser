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

/*
 * Shows Filtering popup
 */
function openFilters()
{
    filterPopup.show();
}

function showAnalysisPopup()
{
    analysis.show();
}

/* VISUALIZATION EVENTS */


function showBars()
{

}

function showSunburstbySpecies()
{
    document.images["byspecies"].src="images/species2.png";
    document.images["byspecimen"].src ="images/specimen.png";
    sunburst.togglePartition(false);
}

function showSunburstbySpecimen()
{
    document.images["byspecies"].src="images/species.png";
    document.images["byspecimen"].src ="images/specimen2.png"; 
    sunburst.togglePartition(true);
}

/*
 * Changes yellow border (to show wich visualization is selected) on the icons
 * Hides comboboxes not used and updates options
 * Shows Parallel Coordinates Visualization with selected specimens info
 */
function showParallelCoord()
{
    document.images["coord"].src="images/coord.png";
    document.images["dots"].src ="images/bullets2.png";
	document.images["map"].src = "images/map2.png";
	document.images["nosel"].style = "display:none;";
    document.images["nofiltersel"].style = "display:none;";

    
	active_visualization = COORD_PARAL_VIZ;
	
	comboX.hide();
    comboY.hide();
    comboSize.hide();
    comboColor.hide();
    dynamicCheckboxText.style.display = 'none';	
    dynamicCheckbox.style.display = 'none';
	
	var list = generateNumericMeasuresList();
	
	multipleCombos.updateOptions(list);
	multipleCombos.show();

    if(firstTimeMultipleCombos)
    {
        multipleCombos.setDifferentIndexes();
        firstTimeMultipleCombos = false;
        
    }
    
    svg_selected.selectAll("*").remove();
    document.getElementById("maps").style = "display:none;";
    document.getElementById("sel_viz").style = "display:block;";
    
	//ParallelCoordinates();
	
	
	paralCoordViz = new ParallelCoordinates();
	paralCoordViz.create();
	if(selection[0])
		paralCoordViz.update();
	
}

/*
 * Changes yellow border (to show wich visualization is selected) on the icons
 * Hides comboboxes not used and updates options
 * Shows Scatterplot visualization with selected specimens info
 */
function showDots()
{

    document.images["coord"].src="images/coord2.png";
    document.images["dots"].src ="images/bullets.png";
	document.images["map"].src = "images/map2.png";
	document.images["nosel"].style = "display:none;";
    document.images["nofiltersel"].style = "display:none;";
	active_visualization = DOTS_VIZ;
	
    multipleCombos.hide();
    comboX.show();
    comboY.show();
    comboSize.show();
    comboColor.show();
    dynamicCheckboxText.style.display = 'inline';	
    dynamicCheckbox.style.display = 'inline';
    
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
    
    document.getElementById("maps").style = "display:none;";
    document.getElementById("sel_viz").style = "display:block;";
    svg_selected.selectAll("*").remove();
    
	dotsViz = new dotsVisualization;
    dotsViz.create();
	
	if(selection[0])
		dotsViz.update();
}

/*
 * Changes yellow border (to show wich visualization is selected) on the icons
 * Hides comboboxes not used and updates options
 * Shows Google Maps API with selected specimens position if available
 */
function showMap()
{
	document.images["coord"].src="images/coord2.png";
    document.images["dots"].src ="images/bullets2.png";
	document.images["map"].src = "images/map.png";
	document.images["nosel"].style = "display:none;";
    document.images["nofiltersel"].style = "display:none;";
    
	active_visualization = MAPS_VIZ;
	
    multipleCombos.hide();
    comboX.hide();
    comboY.hide();
    comboSize.hide();
    comboColor.show();
    dynamicCheckboxText.style.display = 'none';	
    dynamicCheckbox.style.display = 'none';
    
	comboX.updateOptions([]);
    comboY.updateOptions([]);
    comboSize.updateOptions([]);
    comboColor.updateOptions([{name:"specimen",isNum:false}]);
    
    svg_selected.selectAll("*").remove();
    document.getElementById("maps").style = "display:block;";
    document.getElementById("sel_viz").style = "display:none;";
    
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
            multipleCombos.show();
			paralCoordViz.update();
		break;
		
		case DOTS_VIZ:
			multipleCombos.hide();
			dotsViz.update();
		break;
		
		case MAPS_VIZ:
			multipleCombos.hide();
			mapsViz.update(selection);
		break;
	}
	
}

function updateFromFiltering()
{
	selectedSpecimenViz.update();
	//selectedNumber.update();
    //analysis.update();
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
    selectedSpecimenViz.update();
    //selectedNumber.update();
    
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

        if(filters.length > 0)
            applyFilters();

        //analysis.update();

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
