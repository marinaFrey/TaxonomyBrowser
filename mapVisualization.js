function mapVisualization()
{
    var height = 600;
    var width = 700;
    var map;
    var myCenter=new google.maps.LatLng(-29.8998873,-51.6375691);
    var markers=[];
    var infoWindow_list=[];
    
    this.create = function()
    {
		svg_selected.selectAll("*").remove();
        var mapProp = 
        {
          center:myCenter,
          zoom:7,
          //mapTypeId:google.maps.MapTypeId.HYBRID
        };

        //geocoder = new google.maps.Geocoder();
        map=new google.maps.Map(document.getElementById("maps"),mapProp);
    } 
    
    this.update = function(dataset)
    {
        //console.log(dataset);
        svg_selected.selectAll("*").remove();
        document.getElementById("maps").style = "display:block;";
        document.getElementById("sel_viz").style = "display:none;";
        
        this.create();
        var hasMarker = false;
		if(filteredSelection[0] == "all")
		{
			for (var i = 0; i < dataset.length; i++)
			{
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
					
					var infowindow = new google.maps.InfoWindow();
					var info = "<p><h4> <b>" + sp.name +"</b></h4><br />" +
							   "<b>Collection ID: </b>" + sp.collection_id +"<br />" +
							   "<b>Collected by: </b>" + sp.collected_by + "<br />" +
							   "<b>Date: </b>" + sp.collected_data + "</p>";
							   
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
					
					
					google.maps.event.addListener(marker,'mouseout',(
					function()
					{

						closeInfos();
					   
					}));
					
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
			for (var i = 0; i < filteredSelection.length; i++)
			{	
				if(dataset[filteredSelection[i]].longitude&& dataset[filteredSelection[i]].latitude)
				{   
                    hasMarker = true;
					var sp = dataset[filteredSelection[i]];
					var marker = new google.maps.Marker(
					{
					   position: new google.maps.LatLng(parseFloat(sp.latitude),parseFloat(sp.longitude)),
					   icon: pinSymbol(sp.color),
					});

					marker.setMap(map); 
					map.setCenter(marker.position);
					markers.push(marker);
					
					var infowindow = new google.maps.InfoWindow();
					var info = "<p><h4> <b>" + sp.name +"</b></h4><br />" +
							   "<b>Collection ID: </b>" + sp.collection_id +"<br />" +
							   "<b>Collected by: </b>" + sp.collected_by + "<br />" +
							   "<b>Date: </b>" + sp.collected_data + "</p>";
							   
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
					
					
					google.maps.event.addListener(marker,'mouseout',(
					function()
					{

						closeInfos();
					   
					}));
					
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
        
        if(!hasMarker)
        {
            document.getElementById("maps").style = "display:none;";
            document.images["nofiltersel"].style = "display:block;";
        }
        
    }
    
    
    
    function pinSymbol(color) 
    {

        return {
            //path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            path: 'M 0,0 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            fillColor: color,
            fillOpacity: 0.4,
            strokeColor: 'none',
            strokeWeight: 0,
            scale: 3
        };
    }
        
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
    
    /*
    function clearMarkers() 
    {
        setMapOnAll(null);
    }
    
    function showMarkers() 
    {
        setMapOnAll(map);
    }
    
    function deleteMarkers() 
    {
        clearMarkers();
        markers = [];
    }*/
    /*
    this.changeMapType(type)
    {
        if(type == "TERRAIN")
        {
            map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        }
    }*/
}