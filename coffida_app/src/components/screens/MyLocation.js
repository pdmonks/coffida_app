import React, { Component } from 'react';
import {
  View, Alert, PermissionsAndroid, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';

// request location permission from user if not already obtained
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

// screen which shows the current location of the user
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

  // page setup; check user is logged in and reload page information
  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** My Location Screen **');
      checkUserLogin(this.props);
      this.findCoordinates();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // get the current location of the user
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
    const { isLoading, location } = this.state;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
      map: {
        flex: 1,
      },
    });

    if (isLoading) {
      return (
        <IsLoadingIndicator />
      );
    }
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
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
            title="My current postion"
            description="I am here!"
          />
        </MapView>

      </View>
    );
  }
}

MyLocation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default MyLocation;
