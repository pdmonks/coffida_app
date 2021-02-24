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
      // locations of three closest coffee shops; 0 is the closest
      coffee0Location: {
        longitude: 0, latitude: 0, name: '', town: '', id: '',
      },
      coffee1Location: {
        longitude: 0, latitude: 0, name: '', town: '', id: '',
      },
      coffee2Location: {
        longitude: 0, latitude: 0, name: '', town: '', id: '',
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
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // refresh the map when button is tapped
  refreshMap = () => {
    console.log('Refreshing map');
    this.findCoordinates();
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
      // now get the three closest coffee locations
      this.getCoffeeLocations();
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
  getCoffeeLocations = async () => {
    const path = 'find?';
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
  findClosestLocation = async (responseJson) => {
    const { location } = this.state;
    const latitude = location.latitude;
    const longitude = location.longitude;
    const current = { latitude, longitude };

    // find the three closest locations and set state of coords
    const closestLocations = ['coffee0Location', 'coffee1Location', 'coffee2Location'];
    const closestThree = [];
    for (let i = 0; i < closestLocations.length; i += 1) {
      closestThree[i] = responseJson.map((locationCoord) => {
        const coords = locationCoord;
        return { coords, dist: getDistance(current, coords) };
      })
        .sort((a, b) => a.dist - b.dist)[i]; // sort by distance to find locations by distance
      console.log('Closest location', i, ':', closestThree[i]);
      this.setState({
        [closestLocations[i]]: {
          longitude: closestThree[i].coords.longitude,
          latitude: closestThree[i].coords.latitude,
          name: closestThree[i].coords.location_name,
          town: closestThree[i].coords.location_town,
          id: closestThree[i].coords.location_id,
        },
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const {
      isLoading, location, coffee0Location, coffee1Location, coffee2Location,
    } = this.state;

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
            coordinate={coffee0Location}
            onPress={() => {
              console.log('Go to location');
              navigation.navigate('Location', { locationId: coffee0Location.id });
            }}
            pinColor="#0000ff"
            title={coffee0Location.name}
            description={coffee0Location.town}
          />
          <Marker
            coordinate={coffee1Location}
            onPress={() => {
              console.log('Go to location');
              navigation.navigate('Location', { locationId: coffee1Location.id });
            }}
            pinColor="#0000ff"
            title={coffee1Location.name}
            description={coffee1Location.town}
          />
          <Marker
            coordinate={coffee2Location}
            onPress={() => {
              console.log('Go to location');
              navigation.navigate('Location', { locationId: coffee2Location.id });
            }}
            pinColor="#0000ff"
            title={coffee2Location.name}
            description={coffee2Location.town}
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
