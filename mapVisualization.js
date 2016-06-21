function mapVisualization()
{
    var height = 600;
    var width = 700;
    var map;
    var myCenter=new google.maps.LatLng(-30.069093,-51.164871);
    var markers=[];
    
    this.create = function()
    {
        var mapProp = 
        {
          center:myCenter,
          zoom:11,
          //mapTypeId:google.maps.MapTypeId.HYBRID
        };

        //geocoder = new google.maps.Geocoder();
        map=new google.maps.Map(document.getElementById("sel_viz"),mapProp);
    } 
    
    this.update = function(dataset)
    {
        //console.log(dataset);
        for (var i = 0; i < dataset.length; i++)
        {
            if(dataset[i].latitude && dataset[i].latitude != "")
            {
                console.log(dataset[i].latitude);
                var marker=new google.maps.Circle(
                {
                  center:new google.maps.LatLng(parseFloat(dataset[i].latitude),parseFloat(dataset[i].longitude)),
                  radius:20000,
                  strokeColor:dataset[i].color,
                  //strokeOpacity:0.8,
                  strokeWeight:1,
                  fillColor:dataset[i].color,
                  fillOpacity:0.4
                });
                
                google.maps.event.addListener(marker,'click',onClick);
                marker.setMap(map); 
                markers.push(marker);
                map.setCenter(marker.center);
            }
           
        }
        
        
        /*
        var infowindow = new google.maps.InfoWindow(
        {
          content:"Hello World!"
        });
        infowindow.open(map,marker);
        */
        
        
    }
    
    function onClick()
    {
        console.log("hello world");
    }
    
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
    }
    /*
    this.changeMapType(type)
    {
        if(type == "TERRAIN")
        {
            map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        }
    }*/
}