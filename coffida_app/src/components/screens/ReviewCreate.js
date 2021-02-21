import React, { Component } from 'react';
import { ScrollView, ToastAndroid, StyleSheet, Alert } from 'react-native';
import { Text, H1, View } from 'native-base';
import PropTypes from 'prop-types';
import { getRequest, postRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import FormReview from '../shared/FormReview';
import { ButtonLight } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { profanityFilter } from '../../utilityFunctions/ProfanityFilter';
import { responseStatusMessage } from '../../api/ApiStatus';
import { getAsyncItem } from '../../asyncStorage/AsyncUtilities';

// screen to allow the user to create a review for a location
class ReviewCreate extends Component {
  // takes parameter of location ID
  constructor(props) {
    super(props);
    const { locationId } = this.props.route.params;
    this.state = {
      selectedLocation: locationId,
      overallRatingValue: '',
      priceRatingValue: '',
      qualityRatingValue: '',
      clenlinessRatingValue: '',
      reviewBodyValue: '',
    };
  }

  // page setup; check user is logged in and reload page information

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** Review Create Screen **');
      checkUserLogin(this.props);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // construct URI from checked input values for new review post request
  submitReview = async (overall, price, quality, clenliness, review) => {
    const { selectedLocation } = this.state;
    // const locId = selectedLocation;
    const pathStr = 'location/' + selectedLocation + '/review';
    const contentType = 'application/json';
    let bodyDataStr = '';
    if ((overall >= 0 && overall <= 5)
      && (price >= 0 && price <= 5)
      && (quality >= 0 && quality <= 5)
      && (clenliness >= 0 && clenliness <= 5)
      && (review !== '')) {
      bodyDataStr = {
        overall_rating: parseInt(overall),
        price_rating: parseInt(price),
        quality_rating: parseInt(quality),
        clenliness_rating: parseInt(clenliness),
        review_body: await profanityFilter(review), // replace profanities with '***'
      };
      const bodyData = JSON.stringify(bodyDataStr);
      this.postReview(pathStr, contentType, bodyData);
    } else {
      console.log('missing data');
    }
  }

  // post request to create a new review
  postReview = async (path, type, data) => {
    const { navigation } = this.props;
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status === 201) {
          ToastAndroid.show('Review created!', ToastAndroid.SHORT);
          // navigation.navigate('Location');
          this.addPhotoAlert();
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

  // alert which asks user if photo needed for newly created review
  addPhotoAlert = () => {
    const { navigation } = this.props;
    Alert.alert(
      'Review Created!',
      'Add photo to your review?',
      [
        {
          text: 'No',
          onPress: () => navigation.navigate('Location'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.getReviewId() },
      ],
      { cancelable: false },
    );
  }

  // get the review ID from the latest review posted by the user (ie the one just posted)
  getReviewId = async () => {
    console.log('Yes Pressed');
    const { navigation } = this.props;
    const { selectedLocation } = this.state;
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
        // sort the response reviews data by review ID decrementally
        responseJson.reviews.sort((a, b) => (a.review.review_id > b.review.review_id) ? -1 : 1);
        // retrieve the first review ID found, ie the one just posted
        const revId = responseJson.reviews[0].review.review_id;
        console.log('latest review for this user:', revId);
        return revId;
      })
      .then((revId) => {
        console.log('location: ', selectedLocation, ' review: ', revId);
        navigation.navigate('ReviewPhoto', { locationId: selectedLocation, reviewId: revId, returnToPage: 'Location', pageParams: '{ locationId: ' + selectedLocation + ' }' });
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  // handler for all star rating inputs on review form
  onStarRatingPress = (rating, name) => {
    console.log(name, rating);
    const stateObject = () => {
      const returnObj = {};
      returnObj[name] = rating.toString();
      return returnObj;
    };
    this.setState(stateObject);
  }

  render() {
    const { navigation } = this.props;
    const {
      overallRatingValue,
      priceRatingValue,
      qualityRatingValue,
      clenlinessRatingValue,
      reviewBodyValue,
    } = this.state;

    const styles = StyleSheet.create({
      viewTitle: {
        flex: 1,
      },
      viewForm: {
        flex: 15,
        alignSelf: 'stretch',
      },
    });

    return (

      <View style={commonStyles.background}>

        <View style={styles.viewTitle}>
          <H1>Post Your Review</H1>
        </View>

        <View style={styles.viewForm}>
          <Text />
          <ScrollView>
            <FormReview
              overallStarRatingValue={(overallRatingValue)}
              selectedOverallRatingStar={(rating) => this.onStarRatingPress(rating, 'overallRatingValue')}
              priceStarRatingValue={(priceRatingValue)}
              selectedPriceRatingStar={(rating) => this.onStarRatingPress(rating, 'priceRatingValue')}
              qualityStarRatingValue={(qualityRatingValue)}
              selectedQualityRatingStar={(rating) => this.onStarRatingPress(rating, 'qualityRatingValue')}
              clenlinessStarRatingValue={(clenlinessRatingValue)}
              selectedClenlinessRatingStar={(rating) => this.onStarRatingPress(rating, 'clenlinessRatingValue')}
              onChangeTextReview={(reviewBodyValue) => this.setState({ reviewBodyValue })}
              valueReview={reviewBodyValue}
              buttonPress={() => this.submitReview(overallRatingValue, priceRatingValue,
                qualityRatingValue, clenlinessRatingValue, reviewBodyValue)}
              buttonLabel="Submit Review"
            />
            <Text />
            <ButtonLight buttonFunction={() => navigation.goBack()} buttonText="Cancel" />

          </ScrollView>
        </View>

      </View>

    );
  }
}

ReviewCreate.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};

export default ReviewCreate;
