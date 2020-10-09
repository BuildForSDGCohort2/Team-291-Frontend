import React from "react";
import myIcon from "../pin.png";
import mechIcon from "../mechanic.png";
import mapboxgl from "mapbox-gl";


mapboxgl.accessToken = "pk.eyJ1IjoidHdhYmkiLCJhIjoiY2tlZnZyMWozMHRqdjJzb3k2YzlxZnloYSJ9.FBL3kyXAQ22kEws-y6XbJQ";

const Map = (props) => {

    const mapContainerRef = React.useRef(null);
    const [mechanicList, setMechanicList] = React.useState([]);

    const getLocationNames = (lat, long) => {
        var loc = "";
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }

        })
            .then((response) => response.json())
            .then((result) => {
                var country = result.countryName;
                var sub = result.principalSubdivision;
                var locality = result.locality;

                loc = country +", "+sub + ", "+locality;
                props.getLocation(loc);
                return loc;
            }).catch((error) => {
            alert("oops an error occurred: " + error + " .Try reloading your page");
        });
    };

    var map;

    // initialize map when component mounts
    React.useEffect(() => {

        setMechanicList(props.mechanicList);
        //console.log(props.mechanicList)

        //if(!props.isLoggedIn){
        //window.location.href = "/";
        //}
        var geoLocArray = [];
        if(props.mechanicList.length == 0 || props.mechanicList == null){
            //the list is empty
        } else {

            props.mechanicList.slice(34).map((mechanic) => {
                //console.log(mechanic.company_name);
                if(mechanic == null){

                }else {
                    geoLocArray.push(
                        {
                            "type": "Feature",
                            "properties": {
                                "message": mechanic.company_name,
                                "number" : mechanic.phoneNumber,
                                "iconSize": [60, 60]
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [mechanic.company_absolute_location_lon[0], mechanic.company_absolute_location_lat[0]]
                            }
                        }
                    );
                }

            });

        }

        //console.log(geoLocArray);

        navigator.geolocation.getCurrentPosition((position) => {
            const userCoordinates = [position.coords.longitude, position.coords.latitude];
            getLocationNames(position.coords.latitude, position.coords.longitude);

            map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: userCoordinates,
                zoom: 10,
            });


            map.on("load", function() {
                props.popupCallBack();
                map.loadImage(myIcon,
                    function(error, image) {
                        map.addImage("myIcon-marker", image);
                    });
                map.loadImage(
                    mechIcon,
                    function(error, image) {
                        map.addImage("custom-marker", image);
                        map.addSource("points", {
                            "type": "geojson",
                            "data": {
                                "type": "FeatureCollection",
                                "features": [
                                    {
                                        "type": "Feature",
                                        "properties": {},
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": userCoordinates
                                        }
                                    }

                                ]
                            }
                        });

                        //dummy location data and mechanic locations
                        var geojson = {
                            "type": "FeatureCollection",
                            "features": geoLocArray
                        };


                        map.addSource("mechPoints", {
                            "type": "geojson",
                            "data": geojson
                        });

                        map.addLayer({
                            "id": "symbols",
                            "type": "symbol",
                            "source": "points",
                            "layout": {
                                "icon-image": "myIcon-marker"
                            }
                        });
                        map.addLayer({
                            "id": "mechSymbols",
                            "type": "symbol",
                            "source": "mechPoints",
                            "layout": {
                                "icon-image": "custom-marker"
                            }
                        });

                        map.flyTo({
                            center: userCoordinates,
                            zoom: 15
                        });

                        // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
                        map.on("click", "mechSymbols", function(e) {
                            map.flyTo({
                                center: e.features[0].geometry.coordinates
                            });
                            new mapboxgl.Popup()
                                .setLngLat(e.features[0].geometry.coordinates)
                                .setHTML("<h3>title</h3><p>some mechanic</p>")
                                .addTo(map);
                            //console.log(e.features[0]);
                            alert("Garage Name: " + e.features[0].properties.message +". \n" + "Phone Number: " + e.features[0].properties.number);
                        });

                        map.on("mouseenter", "mechSymbols", function() {
                            map.getCanvas().style.cursor = "pointer";
                            //alert("some mechanic");
                        });

                        map.on("mouseleave", "mechSymbols", function() {
                            map.getCanvas().style.cursor = "";
                        });

                        // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
                        map.on("click", "symbols", function(e) {
                            map.flyTo({
                                center: e.features[0].geometry.coordinates
                            });
                            new mapboxgl.Popup()
                                .setLngLat(e.features[0].geometry.coordinates)
                                .setHTML("<h3>title</h3><p>some mechanic</p>")
                                .addTo(map);
                            alert("your position");
                        });

                        map.on("mouseenter", "symbols", function() {
                            // Change the cursor style as a UI indicator.
                            map.getCanvas().style.cursor = "pointer";
                            //alert("your position");

                        });

                        map.on("mouseleave", "symbols", function() {
                            map.getCanvas().style.cursor = "";
                        });

                    }
                );
            });

        });
        return () => map.remove();

    }, [props.mechanicList]);

    return (
        <div className="map-container vh-90" ref={mapContainerRef} />
    );
};

export default Map;