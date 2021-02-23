import React, { Component } from 'react';
import {
  FlatList, StyleSheet, ToastAndroid,
} from 'react-native';
import {
  Text, H1, View, Card, CardItem,
} from 'native-base';
import PropTypes from 'prop-types';
import { getRequest, deleteRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';
import { ButtonBlock } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { responseStatusMessage } from '../../api/ApiStatus';
import StarFixed from '../shared/StarFixed';

// screen which list user favourite locations, allowing selection of individual locations
class LocationsFavourite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      locationListData: [],
    };
  }

  // page setup; check user is logged in and reload page information

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** Locations Screen **');
      checkUserLogin(this.props);
      this.favouriteLocationList();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // get request for list of user favourite locations
  getLocations = async (path) => {
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
        this.setState({
          isLoading: false,
          locationListData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // construct URI for delete favourite location request
  deleteFavourite = async (locId) => {
    const pathStr = 'location/' + locId + '/favourite';
    this.deleteFavouriteData(pathStr);
  }

  // delete request to remove location from user favourites
  deleteFavouriteData = async (path) => {
    const { navigation } = this.props;
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Removed from favourites', ToastAndroid.SHORT);
          this.favouriteLocationList();
        } else if (response.status === 401) {
          navigation.navigate('Login');
          throw 'Unauthorised request';
        } else {
          throw responseStatusMessage(response.status);
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  // navigate to selected location page with location ID parameter
  async selectLocation(id) {
    const { navigation } = this.props;
    navigation.navigate('Location', { locationId: id });
  }

  // construct URI for favourite location get request
  async favouriteLocationList() {
    const pathStr = 'find?search_in=favourite';
    this.getLocations(pathStr);
  }

  render() {
    const { isLoading, locationListData } = this.state;

    const styles = StyleSheet.create({
      viewTitle: {
        flex: 2,
      },
      viewLocations: {
        flex: 15,
        alignSelf: 'stretch',
      },
    });

    if (isLoading) {
      return (
        <IsLoadingIndicator />
      );
    }

    return (

      <View style={commonStyles.background}>

        <View style={styles.viewTitle}>
          <H1>My Favourite Locations</H1>
        </View>

        <View style={styles.viewLocations}>
          <FlatList
            data={locationListData}
            renderItem={({ item }) => (
              <Card>
                <Text>
                  {item.location_name}
                  {', '}
                  {item.location_town}
                </Text>

                <CardItem>
                  <Text>Overall </Text>
                  <StarFixed rating={item.avg_overall_rating} />
                  <Text> Price </Text>
                  <StarFixed rating={item.avg_price_rating} />
                </CardItem>

                <CardItem>
                  <Text>Quality </Text>
                  <StarFixed rating={item.avg_quality_rating} />
                  <Text> Cleanliness </Text>
                  <StarFixed rating={item.avg_clenliness_rating} />
                </CardItem>

                <ButtonBlock
                  buttonFunction={() => this.selectLocation(item.location_id.toString())}
                  buttonText="View Location"
                />
                <ButtonBlock
                  buttonFunction={() => this.deleteFavourite(item.location_id.toString())}
                  buttonText="Remove From My Favourite Locations"
                />
              </Card>
            )}
            keyExtractor={({ location_id }, index) => location_id.toString()}
          />
        </View>

      </View>

    );
  }
}

LocationsFavourite.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default LocationsFavourite;
