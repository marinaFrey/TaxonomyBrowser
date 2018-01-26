/*
 * Class for the map visualization
 * creates map using Google Maps API and adds specimens location on the map
 */
function mapVisualization()
{
    var height = 600;
    var width = 700;
    var map;
    // defines center only for initialization
    var myCenter=new google.maps.LatLng(-29.8998873,-51.6375691);
    var markers=[];
    var infoWindow_list=[];
    
    /*
     * creates map defining a certain zoom level and center
     * center defined is not important, it will be changed when data is added
     */
    this.create = function()
    {
        var mapProp = 
        {
          center:myCenter,
          zoom:7//,
          //mapTypeId:google.maps.MapTypeId.HYBRID
        };

        map=new google.maps.Map(document.getElementById("maps"),mapProp);
    } 
    
    /*
     * updates map do show markers created from selected specimens with location info
     */
    this.update = function(dataset)
    {
        var hasMarker = false;
        
        // if there is no filter applied, all selection is used 
		if(filteredSelection[0] == "all")
		{
			for (var i = 0; i < dataset.length; i++)
			{
                // only creates marker if specimen has latitude and longitude info
				if(dataset[i].longitude && dataset[i].latitude )
				{
                    hasMarker = true;
					var sp = dataset[i];
					var marker = new google.maps.Marker(
					{
					   position: new google.maps.LatLng(parseFloat(sp.latitude),parseFloat(sp.longitude)),
					   icon: pinSymbol(sp.color),
					});

					marker.setMap(map); 
					map.setCenter(marker.position);
					markers.push(marker);
					
                    // creating info window to show some of the specimen's info when hovered
					var infowindow = new google.maps.InfoWindow();
					var info = "<p><h4> <b>" + sp.name +"</b></h4><br />" +
							   "<b>Collection ID: </b>" + sp.collection_id +"<br />" +
							   "<b>Collected by: </b>" + sp.collected_by + "<br />" +
							   "<b>Date: </b>" + sp.collected_data + "</p>";
							   
                    // adding hovering to show partial info from specimen
					google.maps.event.addListener(marker,'mouseover',(function(marker, infowindow,info)
					{
						return function()
						{
							closeInfos();
							infowindow.setContent(info); 
							infowindow.open(map,marker);
							
							infoWindow_list[0]=infowindow;
						};
					})(marker,infowindow,info));
					
					// event to close window when mouse moves away from marker
					google.maps.event.addListener(marker,'mouseout',(
					function()
					{
						closeInfos();
					   
					}));
                    
					// adding click event to show specimen's full info
					google.maps.event.addListener(marker,'click',(function(sp)
					{
						return function()
						{
							closeInfos();
							makeSpecimenPopup(sp);
						};
					})(sp));
				}
			}
		}
		else
		{
            // if there is filter applied, filteredSelection vector is used as index to access selected specimens in dataset
			for (var i = 0; i < filteredSelection.length; i++)
			{	
				if(dataset[filteredSelection[i]].longitude&& dataset[filteredSelection[i]].latitude)
				{   
                    hasMarker = true;
					var sp = dataset[filteredSelection[i]];
                    // only creates marker if specimen has latitude and longitude info
					var marker = new google.maps.Marker(
					{
					   position: new google.maps.LatLng(parseFloat(sp.latitude),parseFloat(sp.longitude)),
					   icon: pinSymbol(sp.color),
					});

					marker.setMap(map); 
					map.setCenter(marker.position);
					markers.push(marker);
					
                    // creating info window to show some of the specimen's info when hovered
					var infowindow = new google.maps.InfoWindow();
					var info = "<p><h4> <b>" + sp.name +"</b></h4><br />" +
							   "<b>Collection ID: </b>" + sp.collection_id +"<br />" +
							   "<b>Collected by: </b>" + sp.collected_by + "<br />" +
							   "<b>Date: </b>" + sp.collected_data + "</p>";
					
                    // adding hovering to show partial info from specimen                    
					google.maps.event.addListener(marker,'mouseover',(function(marker, infowindow,info)
					{
						return function()
						{
							closeInfos();
							infowindow.setContent(info); 
							infowindow.open(map,marker);
							
							infoWindow_list[0]=infowindow;
						};
					})(marker,infowindow,info));
					
					// event to close window when mouse moves away from marker
					google.maps.event.addListener(marker,'mouseout',(
					function()
					{

						closeInfos();
					   
					}));
					
                    // adding click event to show specimen's full info
					google.maps.event.addListener(marker,'click',(function(sp)
					{
						return function()
						{
							closeInfos();
							makeSpecimenPopup(sp);
						};
					})(sp));
				}
			}
		}
        
        // if no marker has been created an image is displayed to inform the user no specimen has matched the filter
        // in this case it's possible there is some specimen selected, but none with location info
        if(!hasMarker)
        {
            document.getElementById("maps").style.display =  "none";
            document.images["nofiltersel"].style.display =  "block";
        }
        
    }
    
    /*
     * creates custom pin symbol using vector paths
     */
    function pinSymbol(color) 
    {

        return {
            // imitation of the marker used on google maps
            //path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            // circle
            path: 'M 0,0 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            fillColor: color,
            fillOpacity: 0.4,
            strokeColor: 'none',
            strokeWeight: 0,
            scale: 3
        };
    }
    
    /*
     * closes any info window still showing
     */
    function closeInfos()
    {
       if(infoWindow_list.length > 0)
       {   
          /* detach the info-window from the marker ... undocumented in the API docs */
          infoWindow_list[0].set("marker", null);
     
          /* and close it */
          infoWindow_list[0].close();
     
          /* blank the array */
          infoWindow_list.length = 0;
       }
    }

}