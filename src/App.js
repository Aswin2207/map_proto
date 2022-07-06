import './App.css';
import React,{ useState,componentDidMount} from 'react';
import Map from "./Map";
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyDBIF6tEKyTxtxnH6zM_US7Jg4s6eM8VLQ");
Geocode.setLanguage("en");


class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      doorNbr:'',
      buildName:'',
      street:'',
      area:'',
      city:'',
      state:'',
      zipcode:'',
      country:'',
      location:'',
      zoomFactor:'',
      elevation:'',
      elevateFetch:false,
      directionRes:'',
      directionFetch:false,
      destLat:'',
      destLng:'',
      nearbyPlaces:''  }
    this.getLocation = this.getLocation.bind(this);
    this.handleState = this.handleState.bind(this);
    this.getElevation = this.getElevation.bind(this);
    this.getDirection = this.getDirection.bind(this);
    this.setDirection = this.setDirection.bind(this);
    this.similarPlaces = this.similarPlaces.bind(this);
    this.reset=this.reset.bind(this);
  }

  componentDidMount(){
      this.setState({doorNbr:''})
      this.setState({buildName:''})
      this.setState({street:''})
      this.setState({area:''})
      this.setState({city:''})
      this.setState({state:''})
      this.setState({zipcode:''})
      this.setState({country:''})
      this.setState({location:''})
      this.setState({zoomFactor:''})
      this.setState({elevateFetch:false})
      this.setState({elevation:''})
      this.setState({directionFetch:''})
      this.setState({destLat:''})
      this.setState({destLng:''})
      this.setState({nearbyPlaces:''})
    }

  handleState(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  getLocation(){
    this.setState({elevateFetch:false});
    this.setState({elevation:''});
    this.setState({nearbyPlaces:''});
    let geocodeData=(this.state.buildName?this.state.buildName+',':'')+(this.state.area?this.state.area+',':'')+(this.state.city?this.state.city+',':'')+
    (this.state.zipcode?this.state.zipcode+',':'')+(this.state.state?this.state.state+',':'')+(this.state.country?this.state.country+',':'');
    Geocode.fromAddress(geocodeData).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({location:{lat:lat,lng:lng}});
        this.setState({zoomFactor:15});
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getElevation(){
    const elevator = new window.google.maps.ElevationService();
    elevator
    .getElevationForLocations({
      locations: [{ lat: this.state.location.lat,lng: this.state.location.lng }],
    })
    .then(({ results }) => {
      if (results[0]) {
        this.setState({elevation:{elevate:
          "The height of the marked location is " +
            results[0].elevation +
            " meters."}});
            this.setState({elevateFetch:true})
      } else {
        // infowindow.setContent("No results found");
      }
    })
    .catch((e) =>
    console.log(e)
    );
  }

  getDirection(){
    var directionsService = new window.google.maps.DirectionsService();
    var request = {
      origin: {lat:this.state.location.lat,lng:this.state.location.lng},
      destination:new window.google.maps.LatLng(this.state.destLat,this.state.destLng),
      travelMode: 'DRIVING'
    };
    directionsService.route(request).then(res=>{
      console.log(res)
      if (res) {
        this.setState({directionRes:res});
        this.setState({zoomFactor:20});
      }
    }) 
  }

  reset(){
    this.setState({doorNbr:''})
    this.setState({buildName:''})
    this.setState({street:''})
    this.setState({area:''})
    this.setState({city:''})
    this.setState({state:''})
    this.setState({zipcode:''})
    this.setState({country:''})
    this.setState({location:''})
    this.setState({zoomFactor:''})
    this.setState({elevateFetch:false})
    this.setState({elevation:''})
    this.setState({directionFetch:''})
    this.setState({destLat:''})
    this.setState({destLng:''})
    this.setState({nearbyPlaces:''})
  }

  setDirection(){
  this.setState({nearbyPlaces:''})
   this.setState({directionFetch:true});
  }
  similarPlaces(){
    const post={
      "coords": { "lat": this.state.location.lat, "lng": this.state.location.lng},
      "buildName": this.state.buildName,
      "area": this.state.area
    }
   fetch("http://localhost:3000/similarPlaces",{method:'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify(post) })
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({nearbyPlaces:result.data.results });
        this.setState({zoomFactor:13 });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  render(){
  return (
    <section className='App'>
        <div className="container mb-5">
          <strong className="header">Location  Search</strong>
          <div className="row">
          <div className="form-group col-lg-3 pt-3  pb-5">
    <label >Door No</label>
    <input type="text" name='doorNbr' value={this.state.doorNbr} onChange={this.handleState}   className="form-control"  aria-describedby="emailHelp" placeholder="Enter door No"/>
  </div>
  <div className="form-group col-lg-3 pt-3  pb-5">
    <label >Building Name</label>
    <input  name='buildName' value={this.state.buildName} onChange={this.handleState}  className="form-control"  placeholder="Enter Building Name"/>
  </div>
  <div className="form-group col-lg-3 pt-3  pb-5">
    <label>Street</label>
    <input  name='street' value={this.state.street} onChange={this.handleState} className="form-control"  placeholder="Enter Street"/>
  </div>
  <div className="form-group col-lg-3 pt-3  pb-5">
    <label>Area</label>
    <input  name='area' value={this.state.area} onChange={this.handleState} className="form-control"  placeholder="Enter Area"/>
  </div>
  <div className="form-group col-lg-3  pb-5">
    <label>City</label>
    <input  name='city' value={this.state.city} onChange={this.handleState}  className="form-control"  placeholder="Enter City"/>
  </div>
  <div className="form-group col-lg-3 pb-5">
    <label>State</label>
    <input  name='state' value={this.state.state} onChange={this.handleState}  className="form-control"  placeholder="Enter State"/>
  </div>
  <div className="form-group col-lg-3 pb-5">
    <label>Zipcode</label>
    <input  name='zipcode' value={this.state.zipcode} onChange={this.handleState}  className="form-control"  placeholder="Enter Zipcode"/>
  </div>
  <div className="form-group col-lg-3 pb-5">
    <label>Country</label>
    <input name='country' value={this.state.country} onChange={this.handleState}  className="form-control"  placeholder="Enter Country"/>
  </div>
          </div>
      <div className='row container'>
      
      {     
          this.state.directionFetch &&(
      <div className='col-lg-4 pt-3'>
          <strong>Please Enter the Destination Coordinates:</strong>
          </div>
          )
  }
      {     
          this.state.directionFetch &&(
            <div className="form-group col-lg-3">
            <label >Latitude</label>
            <input type="text" name='destLat' value={this.state.destLat} onChange={this.handleState}   className="form-control"  aria-describedby="emailHelp" placeholder="Enter door No"/>
          </div>
          )
  }
  {     
          this.state.directionFetch &&(
            <div className="form-group col-lg-3">
            <label >Longitude</label>
            <input type="text" name='destLng' value={this.state.destLng} onChange={this.handleState}   className="form-control"  aria-describedby="emailHelp" placeholder="Enter door No"/>
          </div>
          )
  }
      </div>
    <div className='row'>
      <div className=' btnCont col-lg-12 d-flex justify-content-center'>
    <div className="text-center mt-3 col-lg-3 ">
        <button type="submit" className="btn btn-primary" onClick={this.getLocation}>Get Loction</button>
        </div>
        <div className="text-center mt-3 col-lg-3">
        <button type="submit" className="btn btn-primary" disabled={this.state.location ===""}  onClick={this.getElevation}>Get Elevation</button>
        </div>
        {
        !this.state.directionFetch && (
        <div className="text-center mt-3 col-lg-3">
        <button type="submit" className="btn btn-primary" disabled={this.state.location ===""} onClick={this.setDirection}>Get Direction</button>
        </div>
        )
  }
        {
        this.state.directionFetch && (
        <div className="text-center mt-3 col-lg-3">
        <button type="submit" className="btn btn-primary" onClick={this.getDirection}>Fetch Direction</button> 
        </div>
        )
  }

        <div className="text-center mt-3 col-lg-3">
        <button type="submit" className="btn btn-primary" disabled={!this.state.location} onClick={this.similarPlaces}>Find Similar Places </button> 
        </div>
        </div>
        <div className=" resetBlk text-center mt-3 d-flex justify-content-center">
        <button type="submit" className="btn btn-primary" onClick={this.reset}>Reset</button> 
        </div>
    </div>
    <div className='row container'>
    {     
          this.state.location !=="" &&(
            <div className='col-lg-6 p-3'>
          <strong>The Coordinates of your location search is {this.state.location.lat},{this.state.location.lng}</strong>
          </div>
          )
  }
     
     {     
          this.state.elevation !=="" &&(
            <div className='col-lg-6 p-3'>
          <strong>{this.state.elevation.elevate}</strong>
          </div>
          )
  }
          </div>

    </div>
    <Map nearbyPlaces={this.state.nearbyPlaces} location={this.state.location} directions={this.state.directionRes} zoomFactor={this.state.zoomFactor} elevation={this.state.elevation} elevator={this.state.elevateFetch} />
    </section>

  );

}

}


export default App;
