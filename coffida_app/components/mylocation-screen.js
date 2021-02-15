import React, { Component } from 'react';
import {
  Text, View, Alert, PermissionsAndroid, StyleSheet, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { checkUserLogin } from '../src/utilityFunctions/UtilityFunctions';

async function requestLocationPermission() {
  let permissionFlag = false;
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
      console.log('Location permission granted');
      permissionFlag = true;
    } else {
      console.log('Location permission denied');
      permissionFlag = false;
    }
  } catch(err) {
    console.warn(err);
  }
  return permissionFlag;
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

  /* componentDidMount() {
    this.findCoordinates();
  } */

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      // this.checkLoggedIn();
      console.log('** My Location Screen **');
      checkUserLogin(this.props);
      this.findCoordinates();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  findCoordinates = () => {
    const { locationPermission } = this.state;
    if (!locationPermission) {
      console.log('Asking for location permission...');
      this.state.locationPermission = requestLocationPermission();
    }
    Geolocation.getCurrentPosition((position) => {
      console.log('Current position:', position);
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
    const { isLoading } = this.state;
    const { location } = this.state;

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
        >
          <Marker
            coordinate={location}
            title="My location"
            description="Here I am"
          />
        </MapView>

      </View>
    );
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

MyLocation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default MyLocation;
