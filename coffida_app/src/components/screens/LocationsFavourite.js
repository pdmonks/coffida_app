import React, { Component } from 'react';
import {
  FlatList, StyleSheet, ToastAndroid,
} from 'react-native';
import {
  Container, Form, Text, Header, H3, Picker, Item, Icon, H1, View, Card,
} from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { getRequest, deleteRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import { setAsyncItem } from '../../asyncStorage/AsyncUtilities';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';
import FormItem from '../shared/FormItem';
import { ButtonBlock, ButtonInfo } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';

class LocationsFavourite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      locationListData: [],
      qValue: '',
      overallRatingValue: '',
      priceRatingValue: '',
      qualityRatingValue: '',
      clenlinessRatingValue: '',
      searchInValue: '',
      limitValue: '',
      offsetValue: '',
    };
  }

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

  getLocations = async (path) => {
    this.setState({ isLoading: true });
    return getRequest(path)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'There was a problem, please try again later';
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

  // MOVE THIS TO MY LOCATIONS PAGE
  deleteFavourite = async (locId) => {
    // const locId = await getAsyncItem('@selectedLocationId');
    const pathStr = 'location/' + locId + '/favourite';
    this.deleteFavouriteData(pathStr);
  }

  deleteFavouriteData = async (path) => {
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          console.log('location removed from favourites');
          this.favouriteLocationList();
        } else if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'There was a problem, please try again later';
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  async selectLocation(id) {
    const { navigation } = this.props;
    await setAsyncItem('@selectedLocationId', id.toString());
    navigation.navigate('Location');
  }

  async favouriteLocationList() {
    const pathStr = 'find?search_in=favourite';
    this.getLocations(pathStr);
  }

  render() {
    const { isLoading } = this.state;
    const { locationListData } = this.state;

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
                <Text>{item.location_name}, {item.location_town} </Text>
                <Text>Overall {item.avg_overall_rating} </Text>
                <Text>Price {item.avg_price_rating} </Text>
                <Text>Quality {item.avg_quality_rating} </Text>
                <Text>Cleanliness {item.avg_clenliness_rating} </Text>
                <ButtonBlock
                  buttonFunction={() => this.selectLocation(item.location_id.toString())}
                  buttonText="View Location"
                />
                <ButtonBlock
                  buttonFunction={() => this.deleteFavourite(item.location_id.toString())}
                  buttonText="Remove From Favourites"
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
