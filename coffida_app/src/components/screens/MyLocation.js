import React, { Component } from 'react';
import {
  View, Alert, PermissionsAndroid, StyleSheet, Button,
} from 'react-native';
import PropTypes from 'prop-types';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { getDistance } from 'geolib';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';
import { getRequest } from '../../api/ApiRequests';
import { responseStatusMessage } from '../../api/ApiStatus';

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
      coffeeLocation: {
        longitude: 0,
        latitude: 0,
        name: '',
        town: '',
        id: '',
      },
    };
    this.findCoordinates = this.findCoordinates.bind(this);
  }

  // page setup; check user is logged in and reload page information
  async componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** My Location Screen **');
      checkUserLogin(this.props);
      this.findCoordinates();
      this.getLocations();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // refresh the map when button is tapped
  refreshMap = () => {
    console.log('Refreshing map');
    this.findCoordinates();
    this.getLocations();
  }

  // get the current location of the user
  findCoordinates = async () => {
    const { locationPermission } = this.state;
    if (!locationPermission) {
      console.log('Asking for location permission...');
      this.state.locationPermission = requestLocationPermission();
    }
    Geolocation.getCurrentPosition((position) => {
      console.log('My current position:', position);
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

  // get coordinates of all locations
  getLocations = async () => {
    const path = 'find';
    const { navigation } = this.props;
    this.setState({ isLoading: true });
    return getRequest(path)
      .then((response) => {
        if (response.status !== 200) {
          if (response.status === 401) {
            navigation.navigate('Login');
            throw 'Unauthorised Request';
          } else {
            throw responseStatusMessage(response.status);
          }
        } else {
          return response.json();
        }
      })
      .then((responseJson) => {
        if (responseJson.length === 0) {
          console.log('nothing returned');
          this.setState({
            searchMessage: 'No results',
          });
        }
        this.findClosestLocation(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // calculate distance between current location and all coffee locations to find nearest
  findClosestLocation = (responseJson) => {
    const { location } = this.state;
    const latitude = location.latitude;
    const longitude = location.longitude;
    const current = { latitude, longitude };
    const closest = responseJson.map((location) => {
      const coord = location;
      return { coord, dist: getDistance(current, coord) };
    })
      .sort((a, b) => a.dist - b.dist)[0]; // sort by distance to find shortest
    console.log('Closest location:', closest);
    this.setState({
      coffeeLocation: {
        longitude: closest.coord.longitude,
        latitude: closest.coord.latitude,
        name: closest.coord.location_name,
        town: closest.coord.location_town,
        id: closest.coord.location_id,
      },
    });
  }

  render() {
    const { navigation } = this.props;
    const { isLoading, location, coffeeLocation } = this.state;

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
            latitudeDelta: 0.010,
            longitudeDelta: 0.002,
          }}
        >
          <Marker
            coordinate={location}
            title="My current postion"
            description="I am here!"
          />
          <Marker
            coordinate={coffeeLocation}
            onPress={() => {
              console.log('Go to location');
              navigation.navigate('Location', { locationId: coffeeLocation.id });
            }}
            pinColor="#0000ff"
            title={coffeeLocation.name}
            description={coffeeLocation.town}
          />
        </MapView>

        <Button title="Refresh" onPress={this.refreshMap.bind(this)} />

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
