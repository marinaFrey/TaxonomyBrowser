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
        
        for (var i = 0; i < dataset.length; i++)
        {
            if(dataset[i].latitude && dataset[i].latitude != "")
            {          
                var marker = new google.maps.Marker(
                {
                   position: new google.maps.LatLng(parseFloat(dataset[i].latitude),parseFloat(dataset[i].longitude)),
                   icon: pinSymbol(dataset[i].color),
                });

                marker.setMap(map); 
                map.setCenter(marker.position);
				markers.push(marker);
                
                var infowindow = new google.maps.InfoWindow();
                var info = "<p> <b>" + dataset[i].name +"</b><br />" +
                           "ID da coleção: " + dataset[i].collection_id +"<br />" +
                           "Coletado por: " + dataset[i].collected_by + "<br />" +
                           "Coletado em: " + dataset[i].collected_data + "</p>";
                           
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
                
                
            }
           
        }
        
    }
    
    
    
    function pinSymbol(color) 
    {

        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 1,
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