import React, { Component } from 'react';
import {
  View, Image, FlatList, ToastAndroid, StyleSheet,
} from 'react-native';
import { Text, Card, CardItem, Icon } from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { deleteRequest, getRequest, postRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';
import { ButtonBlock } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { responseStatusMessage } from '../../api/ApiStatus';
import StarFixed from '../shared/StarFixed';
import { getAsyncItem } from '../../asyncStorage/AsyncUtilities';

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
      favouriteLocations: [],
      likedReviews: [],
      reviewPhotos: [],
    };
  }

  // page setup; check user is logged in and reload page information

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** Location Screen **');
      checkUserLogin(this.props);
      this.getLocationInfo();
      // this.getLikedReviews();
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
        this.getUserInfo(); // to obtain favourite locations and liked reviews
        this.setState({
          // isLoading: false,
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
        this.getPhotoInfo(this.state.locationReviews); // find out which reviews have photos posted
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  // add review IDs to array where photos have been posted to reviews;
  // used to decide whether or not to render photos in reviews flatlist
  getPhotoInfo = async (locationReviews) => {
    console.log('Getting photo info...');
    const photos = [];
    for (let i = 0; i < locationReviews.length; i += 1) {
      console.log(locationReviews[i].review_id);
      const path = 'location/' + this.state.selectedLocation + '/review/' + locationReviews[i].review_id + '/photo?timestamp=' + Date.now();
      const response = await this.getPhoto(path); // response is status code from photo get requests
      if (response === 200) {
        photos.push(locationReviews[i].review_id);
      }
    }
    console.log(photos);
    this.setState({ reviewPhotos: photos });
  }

  // get request for each review; returns 200 to getPhotoInfo if photo exists,
  // to be added to photos array
  getPhoto = async (path) => {
    return getRequest(path)
      .then((response) => {
        if (response.status === 200) {
          return 200;
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  // get all user information to allow liked reviews to be extracted
  getUserInfo = async () => {
    console.log('Getting user info...');
    const { navigation } = this.props;
    const userId = await getAsyncItem('@id');
    const path = 'user/' + userId;
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
        this.extractUserInfo(responseJson);
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  extractUserInfo = async (responseJson) => {
    await this.extractFavouriteLocations(responseJson.favourite_locations);
    await this.extractLikedReviews(responseJson.liked_reviews);
    this.setState({ isLoading: false });
  }

  extractFavouriteLocations = async (favLocations) => {
    console.log('Getting favourite locations...');
    // console.log(favLocations);
    const favLocationIds = [];
    for (let i = 0; i < favLocations.length; i += 1) {
      favLocationIds[i] = favLocations[i].location_id;
    }
    this.setState({ favouriteLocations: favLocationIds });
  }

  // extract user liked review IDs to determine if like/unlike review button rendered
  extractLikedReviews = async (likedReviews) => {
    console.log('Getting liked reviews...');
    // console.log(responseJson.liked_reviews);
    // const likedReviews = responseJson.liked_reviews;
    const likedReviewIds = [];
    for (let i = 0; i < likedReviews.length; i += 1) {
      // console.log(jsonsource[i].review.review_id);
      likedReviewIds[i] = likedReviews[i].review.review_id;
    }
    // console.log(savedLikes);
    this.setState({ likedReviews: likedReviewIds });
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

  deleteFavouriteLocation = async () => {
    const { selectedLocation } = this.state;
    // const locId = await getAsyncItem('@selectedLocationId');
    const pathStr = 'location/' + selectedLocation + '/favourite';
    this.deleteFavouriteLocationData(pathStr);
  }

  deleteFavouriteLocationData = async (path) => {
    const { navigation } = this.props;
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Removed from Favourite Locations', ToastAndroid.SHORT);
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
      favouriteLocations,
      likedReviews,
      reviewPhotos,
    } = this.state;

    const styles = StyleSheet.create({
      viewLocation: {
        flex: 1,
        alignSelf: 'stretch',
      },
      viewReviews: {
        flex: 0.6,
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
              <Text>
                {' '}
                {locationNameValue}
                {', '}
                {locationTownValue}
                {locationIdValue}
              </Text>
              {favouriteLocations.includes(locationIdValue)
              && <Icon name="heart" style={{ fontSize: 20, color: 'red' }} /> }
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

            {favouriteLocations.includes(locationIdValue)
            && <ButtonBlock buttonFunction={() => this.deleteFavouriteLocation()} buttonText="Remove from My Favourite Locations" /> }
            {!favouriteLocations.includes(locationIdValue)
            && <ButtonBlock buttonFunction={() => this.addFavouriteLocation()} buttonText="Add to My Favourite Locations" /> }

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
                  {reviewPhotos.includes(item.review_id)
                  && <Image source={{ uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + selectedLocation + '/review/' + item.review_id + '/photo?timestamp=' + Date.now() }} style={{ width: 100, height: 100 }} /> }
                </CardItem>
                <CardItem>
                  <Text>Overall {item.review_id} {selectedLocation}</Text>
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
                  <Icon name="thumbs-up" style={{ fontSize: 20, color: 'gold' }} />
                  <Text>
                    {item.likes}
                  </Text>
                </CardItem>

                {likedReviews.includes(item.review_id)
                && <ButtonBlock buttonFunction={() => this.unlikeReview(item.review_id.toString())} buttonText="Unlike review" /> }
                {!likedReviews.includes(item.review_id)
                && <ButtonBlock buttonFunction={() => this.likeReview(item.review_id.toString())} buttonText="Like review" /> }

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
