import React, { Component } from 'react';
import { View, Image, FlatList, ToastAndroid, StyleSheet } from 'react-native';
import {
  Container, Text, Card, CardItem, H3,
} from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { deleteRequest, getRequest, postRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import { getAsyncItem } from '../../asyncStorage/AsyncUtilities';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';
import { ButtonBlock } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      locationIdValue: 0,           // location_id
      locationNameValue: '',        // location_name
      locationTownValue: '',        // location_town
      latitudeValue: 0,             // latitude
      longitudeValue: 0,            // longitude
      photoPathValue: '',           // photo_path               ** NEED TO IMPLEMENT THIS
      avgOverallRatingValue: 0,     // avg_overall_rating
      avgPriceRatingValue: 0,       // avg_price_rating
      avgQualityRatingValue: 0,     // avg_quality_rating
      avgClenlinessRatingValue: 0,  // avg_clenliness_rating
      locationReviews: [],          // location_reviews
    };
  }

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

  getLocationInfo = async () => {
    const locId = await getAsyncItem('@selectedLocationId');
    const path = 'location/' + locId;
    this.setState({ isLoading: true });
    return getRequest(path)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 404) {
          throw 'No locations found';
        } else if (response.status === 500) {
          throw 'Sorry, we could not process your request. Please try again later';
        } else {
          throw 'There was a problem, please try again later';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          locationIdValue: responseJson.location_id,
          locationNameValue: responseJson.location_name,
          locationTownValue: responseJson.location_town,
          latitudeValue: responseJson.latitude,
          longitudeValue: responseJson.longitude,
          // photoPathValue: responseJson.photo_path,
          avgOverallRatingValue: responseJson.avg_overall_rating,
          avgPriceRatingValue: responseJson.avg_price_rating,
          avgQualityRatingValue: responseJson.avg_quality_rating,
          avgClenlinessRatingValue: responseJson.avg_clenliness_rating,
          locationReviews: responseJson.location_reviews,
        });
        // console.log(this.photoPathValue);
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  likeReview = async (revId) => {
    const locId = await getAsyncItem('@selectedLocationId');
    const pathStr = 'location/' + locId + '/review/' + revId + '/like';
    const contentType = null;
    const bodyData = null;
    this.postLike(pathStr, contentType, bodyData);
  }

  postLike = async (path, type, data) => {
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Review liked', ToastAndroid.SHORT);
          this.getLocationInfo();
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

  unlikeReview = async (revId) => {
    const locId = await getAsyncItem('@selectedLocationId');
    const pathStr = 'location/' + locId + '/review/' + revId + '/like';
    this.deleteLike(pathStr);
  }

  deleteLike = async (path) => {
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Review unliked', ToastAndroid.SHORT);
          this.getLocationInfo();
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

  addFavourite = async () => {
    const locId = await getAsyncItem('@selectedLocationId');
    const pathStr = 'location/' + locId + '/favourite';
    const contentType = null;
    const bodyData = null;
    this.postFavourite(pathStr, contentType, bodyData);
  }

  postFavourite = async (path, type, data) => {
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Added to favourite locations', ToastAndroid.SHORT);
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

  /* / MOVE THIS TO MY LOCATIONS PAGE
  deleteFavourite = async () => {
    const locId = await getAsyncItem('@selectedLocationId');
    const pathStr = 'location/' + locId + '/favourite';
    this.deleteFavouriteData(pathStr);
  }

  deleteFavouriteData = async (path) => {
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          console.log('location removed from favourites');
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
  } */

  /* favouriteLocation = () => {
    if (this.state.favouriteLabel === 'add to favourites') {
      this.setState({ favouriteLabel: 'remove from favourites' });
    } else {
      this.setState({ favouriteLabel: 'add to favourites' });
    }
    // Alert.alert(this.state.favouriteLabel);
    // this.getLocationInfo;
  } */

  render() {
    const { navigation } = this.props;
    const { isLoading } = this.state;
    const { locationIdValue } = this.state;
    const { locationNameValue } = this.state;
    const { locationTownValue } = this.state;
    // const { photoPathValue } = this.state;
    const { avgOverallRatingValue } = this.state;
    const { avgPriceRatingValue } = this.state;
    const { avgQualityRatingValue } = this.state;
    const { avgClenlinessRatingValue } = this.state;
    const { locationReviews } = this.state;

    const styles = StyleSheet.create({
      viewLocation: {
        flex: 1,
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
          <View>
            <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{ width: 100, height: 100 }} />
            <Text>{locationNameValue}, {locationTownValue} {locationIdValue}</Text>
            <Text>Overall: {avgOverallRatingValue} Price: {avgPriceRatingValue} </Text>
            <Text>Quality: {avgQualityRatingValue} Cleanliness: {avgClenlinessRatingValue} </Text>
          </View>
          <View>
            <ButtonBlock buttonFunction={() => this.addFavourite()} buttonText="Add to My Favourites" />
            <ButtonBlock buttonFunction={() => navigation.navigate('ReviewCreate')} buttonText="Post a review" />
          </View>
        </ScrollView>

        <View style={styles.viewReviews}>
          <Text>Reviews:</Text>
          <FlatList
            data={locationReviews}
            renderItem={({ item }) => (
              <Card>
                <Text>Overall rating {item.overall_rating} Price rating {item.price_rating} </Text>
                <Text>Quality rating {item.quality_rating} Cleanliness rating {item.clenliness_rating} </Text>
                <Text>"{item.review_body}" </Text>
                <Text>Likes: {item.likes} </Text>
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
};

export default Location;
