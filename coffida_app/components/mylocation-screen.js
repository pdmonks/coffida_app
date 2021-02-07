import React, { Component } from 'react';
import {
  Text, View, Alert, PermissionsAndroid, StyleSheet,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

async function requestLocationPermission() {
  try {
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
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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

class MyLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      locationPermission: false,
      isLoading: true,
    };
    this.findCoordinates = this.findCoordinates.bind(this);
  }

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
      location: {
        longitude: -2.242631,
        latitude: 53.480759
      },
      isLoading: false
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
      return (
        <View>
          <Text>Loading...</Text>
        </View>
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
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MyLocation;
