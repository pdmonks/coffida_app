import React, { Component } from 'react';
import {
  View, Image, FlatList, ToastAndroid, StyleSheet,
} from 'react-native';
import { Text, Card, CardItem } from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { deleteRequest, getRequest, postRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';
import { ButtonBlock } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { responseStatusMessage } from '../../api/ApiStatus';
import StarFixed from '../shared/StarFixed';

// screen which shows a single location and all associated reviews
class Location extends Component {
  constructor(props) {
    super(props);
    const { locationId } = this.props.route.params;
    this.state = {
      selectedLocation: locationId,
      isLoading: true,
      locationIdValue: 0,
      locationNameValue: '',
      locationTownValue: '',
      photoPathValue: '',
      avgOverallRatingValue: 0,
      avgPriceRatingValue: 0,
      avgQualityRatingValue: 0,
      avgClenlinessRatingValue: 0,
      locationReviews: [],
    };
  }

  // page setup; check user is logged in and reload page information

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** Location Screen **');
      checkUserLogin(this.props);
      this.getLocationInfo();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // get request for selected location information
  getLocationInfo = async () => {
    const { navigation } = this.props;
    const { selectedLocation } = this.state;
    // const locId = selectedLocation;
    const path = 'location/' + selectedLocation;
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
          locationIdValue: responseJson.location_id,
          locationNameValue: responseJson.location_name,
          locationTownValue: responseJson.location_town,
          photoPathValue: responseJson.photo_path,
          avgOverallRatingValue: responseJson.avg_overall_rating,
          avgPriceRatingValue: responseJson.avg_price_rating,
          avgQualityRatingValue: responseJson.avg_quality_rating,
          avgClenlinessRatingValue: responseJson.avg_clenliness_rating,
          locationReviews: responseJson.location_reviews,
        });
        console.log(this.photoPathValue);
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  // construct URI for post request to like a review
  likeReview = async (revId) => {
    const { selectedLocation } = this.state;
    // const locId = selectedLocation;
    const pathStr = 'location/' + selectedLocation + '/review/' + revId + '/like';
    const contentType = null;
    const bodyData = null;
    this.postLikeReview(pathStr, contentType, bodyData);
  }

  // post request to like a review
  postLikeReview = async (path, type, data) => {
    const { navigation } = this.props;
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Review liked', ToastAndroid.SHORT);
          this.getLocationInfo();
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

  // construct URI for delete request to unlike a review
  unlikeReview = async (revId) => {
    // const locId = await getAsyncItem('@selectedLocationId');
    const { selectedLocation } = this.state;
    // const locId = selectedLocation;
    const pathStr = 'location/' + selectedLocation + '/review/' + revId + '/like';
    this.deleteLikeReview(pathStr);
  }

  // delete request to unlike a review
  deleteLikeReview = async (path) => {
    const { navigation } = this.props;
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Review unliked', ToastAndroid.SHORT);
          this.getLocationInfo();
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

  // construct URI for post request to add location to user favourites
  addFavouriteLocation = async () => {
    // const locId = await getAsyncItem('@selectedLocationId');
    const { selectedLocation } = this.state;
    // const locId = selectedLocation;
    const pathStr = 'location/' + selectedLocation + '/favourite';
    const contentType = null;
    const bodyData = null;
    this.postFavouriteLocation(pathStr, contentType, bodyData);
  }

  // post request to add location to user favourites
  postFavouriteLocation = async (path, type, data) => {
    const { navigation } = this.props;
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Added to favourite locations', ToastAndroid.SHORT);
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

  render() {
    const { navigation } = this.props;
    const {
      isLoading,
      locationIdValue,
      locationNameValue,
      locationTownValue,
      photoPathValue,
      avgOverallRatingValue,
      avgPriceRatingValue,
      avgQualityRatingValue,
      avgClenlinessRatingValue,
      locationReviews,
      selectedLocation,
    } = this.state;

    const styles = StyleSheet.create({
      viewLocation: {
        flex: 1,
        alignSelf: 'stretch',
      },
      viewReviews: {
        flex: 1,
        alignSelf: 'stretch',
        borderTopWidth: 1,
      },
    });

    if (isLoading) {
      return (
        <IsLoadingIndicator />
      );
    }

    return (

      <View style={commonStyles.background}>

        <ScrollView style={styles.viewLocation}>
          <Card>
            <CardItem>
              <Image source={{ uri: photoPathValue }} style={{ width: 100, height: 100 }} />
            </CardItem>
            <CardItem>
              <Text>
                {locationNameValue}
                {', '}
                {locationTownValue}
                {locationIdValue}
              </Text>
            </CardItem>
            <CardItem>
              <Text>Overall </Text>
              <StarFixed rating={avgOverallRatingValue} />
              <Text> Price </Text>
              <StarFixed rating={avgPriceRatingValue} />
            </CardItem>
            <CardItem>
              <Text>Quality </Text>
              <StarFixed rating={avgQualityRatingValue} />
              <Text> Cleanliness </Text>
              <StarFixed rating={avgClenlinessRatingValue} />
            </CardItem>
            <ButtonBlock buttonFunction={() => this.addFavouriteLocation()} buttonText="Add to My Favourites" />
            <ButtonBlock buttonFunction={() => navigation.navigate('ReviewCreate', { locationId: selectedLocation })} buttonText="Post a review" />
          </Card>
        </ScrollView>

        <View style={styles.viewReviews}>
          <Text>Reviews:</Text>
          <FlatList
            data={locationReviews}
            renderItem={({ item }) => (
              <Card>
                <CardItem>
                  <Text>Overall </Text>
                  <StarFixed rating={item.overall_rating} />
                  <Text> Price </Text>
                  <StarFixed rating={item.price_rating} />
                </CardItem>
                <CardItem>
                  <Text>Quality </Text>
                  <StarFixed rating={item.quality_rating} />
                  <Text> Cleanliness </Text>
                  <StarFixed rating={item.clenliness_rating} />
                </CardItem>
                <CardItem>
                  <Text>
                    {'"'}
                    {item.review_body}
                    {'"'}
                  </Text>
                </CardItem>
                <CardItem>
                  <Text>
                    {'Likes: '}
                    {item.likes}
                  </Text>
                </CardItem>
                <ButtonBlock buttonFunction={() => this.likeReview(item.review_id.toString())} buttonText="like review" />
                <ButtonBlock buttonFunction={() => this.unlikeReview(item.review_id.toString())} buttonText="unlike review" />
              </Card>
            )}
            keyExtractor={({ review_id }, index) => review_id.toString()}
          />
        </View>

      </View>

    );
  }
}

Location.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};

export default Location;
