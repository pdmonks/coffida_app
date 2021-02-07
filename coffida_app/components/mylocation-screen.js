import React, { Component } from 'react';
<<<<<<< HEAD
import {
  Text, View, Alert, PermissionsAndroid, StyleSheet,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

async function requestLocationPermission() {
  try {
=======
import { Text, View, Alert, Button, PermissionsAndroid, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

async function requestLocationPermission() {
  try{
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app requires access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
<<<<<<< HEAD
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
=======
    if(granted === PermissionsAndroid.RESULTS.GRANTED) {
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
      console.log('You can access location');
      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch(err) {
    console.warn(err);
  }
}

<<<<<<< HEAD
class MyLocation extends Component {
=======
class MyLocationScreen extends Component {
  
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      locationPermission: false,
<<<<<<< HEAD
      isLoading: true,
=======
      isLoading: true
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
    };
    this.findCoordinates = this.findCoordinates.bind(this);
  }

<<<<<<< HEAD
  componentDidMount() {
    this.findCoordinates();
  }

  findCoordinates = () => {
    console.log('State: ' + this.state);
    if (!this.state.locationPermission) {
      console.log('Asking for permission...');
      this.state.locationPermission = requestLocationPermission();
    }

    /* this.setState({
=======
  findCoordinates = () => {
    console.log("State: " + this.state);
    if(!this.state.locationPermission) {
      console.log("Asking for permission...");
      this.state.locationPermission = requestLocationPermission();
    }

    /*this.setState({
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
      location: {
        longitude: -2.242631,
        latitude: 53.480759
      },
      isLoading: false
<<<<<<< HEAD
    }) */

    Geolocation.getCurrentPosition((position) => {
      console.log(position);
      console.log(JSON.stringify(position));
      this.setState({
        location: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        },
      });
      this.setState({ isLoading: false });
    },
    (error) => {
      Alert.alert(error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    });
  };

  render() {
    if (this.state.isLoading) {
=======
    })*/
    
    Geolocation.getCurrentPosition((position) => {
        console.log(position);
        console.log(JSON.stringify(position));
        this.setState({location: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        }});
        this.setState({isLoading: false});
      },
      (error) => {
        Alert.alert(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  };

  componentDidMount() {
    this.findCoordinates();
  }

  render(){

    if(this.state.isLoading){
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
      return (
        <View>
          <Text>Loading...</Text>
        </View>
<<<<<<< HEAD
      );
    } else {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}  // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: this.state.location.latitude,
            longitude: this.state.location.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
        >
          <Marker
            coordinate={this.state.location}
            title="My location"
            description="Here I am"
          />
        </MapView>
          
      </View>
    );  
=======
      )
    } else {

    return (
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}  // remove if not using Google Maps
            style={styles.map}
            region={{
              latitude: this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
          >
            <Marker
              coordinate={this.state.location}
              title="My location"
              description="Here I am"
            />

          </MapView>
          
        </View>
    );
    
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
    }
  }
}

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MyLocation;
=======
    flex: 1
  },
  map: {
    flex: 1
  }
})

export default MyLocationScreen

>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
