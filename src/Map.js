import React from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  DirectionsRenderer,
} from '@react-google-maps/api';


const containerStyle = {
  width: '80vw',
  height: '100vh',
};

var center = {
  lat: 13.1240,
  lng: 80.2121,
};
var zoom=5;

var propData;
var infwindow;

const options = {
  // styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  minZoom: 2,
  streetViewControl: false,
};
var  marker;


const Map = (props) => {
  console.log(props)
  propData=props;
  if(props.location){
    center={lat:props.location.lat,lng:props.location.lng};
  }
  else{
    center = {
      lat: 13.1240,
      lng: 80.2121,
    };
  }
  if(propData.zoomFactor){
    zoom=props.zoomFactor
  }
  else{
    zoom=5;
  }
      if (propData.elevator === true  ) {
      infwindow=  <InfoWindow position={center}>
       <span>{props.elevation.elevate}</span> 
      </InfoWindow>
    }
    else{
      infwindow=''
    }
    if(!propData.nearbyPlaces || !propData.directions){
      marker= <Marker 
      position={center}>
        {infwindow}
        </Marker>
      
    }
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDBIF6tEKyTxtxnH6zM_US7Jg4s6eM8VLQ"
  })

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  return isLoaded ? (
    <GoogleMap id="mapEle"
      isMarkerShown="true"
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={options}
      onClick={(event) => {
        console.log('event', event)
      }}
    >    {marker}
        {
          propData.nearbyPlaces && (
          propData.nearbyPlaces.map((res,i)=>
            
            <Marker key={i}
      position={res.geometry.location}>
        {infwindow}
        </Marker>
          )
          )
        }
        {
         propData.directions && (
        <DirectionsRenderer directions={propData.directions}>
        

        </DirectionsRenderer>
         )
}


    </GoogleMap>
  ) : <></>
};

export default Map;
