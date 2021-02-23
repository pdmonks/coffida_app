import React, { Component } from 'react';
import {
  ScrollView, ToastAndroid, Image, StyleSheet,
} from 'react-native';
import { Text, View, H1 } from 'native-base';
import PropTypes from 'prop-types';
import { deleteRequest, getRequest, patchRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';
import FormReview from '../shared/FormReview';
import { ButtonBlock, ButtonLight } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { profanityFilter } from '../../utilityFunctions/ProfanityFilter';
import { responseStatusMessage } from '../../api/ApiStatus';

// screen which allows the user to update an existing review, including image
class ReviewUpdate extends Component {
  // takes parameters from reviews list screen to allow updating of single reviews
  constructor(props) {
    super(props);
    const {
      locationId,
      reviewId,
      locationName,
      locationTown,
      reviewOverall,
      reviewPrice,
      reviewQuality,
      reviewClenliness,
      reviewBody,
    } = this.props.route.params;
    this.state = {
      isLoading: true,
      locationId: locationId,
      reviewId: reviewId,
      nameValue: locationName,
      townValue: locationTown,
      origOverallRating: reviewOverall,
      origPriceRating: reviewPrice,
      origQualityRating: reviewQuality,
      origClenlinessRating: reviewClenliness,
      origReviewBody: reviewBody,
      overallRatingValue: reviewOverall,
      priceRatingValue: reviewPrice,
      qualityRatingValue: reviewQuality,
      clenlinessRatingValue: reviewClenliness,
      reviewBodyValue: reviewBody,
      photoPath: 'https://reactnative.dev/img/tiny_logo.png', // photo_path with placeholder image
      defaultPhotoPath: 'https://reactnative.dev/img/tiny_logo.png', // would set these as Coffida website logo if it was real!
    };
  }

  // page setup; check user is logged in and reload page information
  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** Review Update Screen **');
      checkUserLogin(this.props);
      this.getPhoto();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // get request for review image; default image loaded if no existing image
  getPhoto = async () => {
    const { locationId, reviewId } = this.state;
    // force loading of image from server with timestamp suffix on URI
    const path = 'location/' + locationId + '/review/' + reviewId + '/photo?timestamp=' + Date.now();
    return getRequest(path)
      .then((response) => {
        if (response.status !== 200) {
          if (response.status === 404) {
            this.setState({ isLoading: false, photoPath: this.state.defaultPhotoPath });
            console.log('No photo');
          } else {
            throw responseStatusMessage(response.status);
          }
        } else {
          return response;
        }
      })
      .then((responsePhoto) => {
        this.setState({
          photoPath: responsePhoto.url,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // check inputs to construct URI for user review patch request
  updateReview = async (overall, price, quality, clenliness, review) => {
    const { locationId, reviewId } = this.state;
    const pathStr = 'location/' + locationId + '/review/' + reviewId;
    const contentType = 'application/json';
    const {
      origOverallRating,
      origPriceRating,
      origQualityRating,
      origClenlinessRating,
      origReviewBody,
    } = this.state;
    const bodyDataStr = {};
    let updateRequired = false;

    if (overall !== origOverallRating) {
      bodyDataStr['overall_rating'] = parseInt(overall);
      updateRequired = true;
    }
    if (price !== origPriceRating) {
      bodyDataStr['price_rating'] = parseInt(price);
      updateRequired = true;
    }
    if (quality !== origQualityRating) {
      bodyDataStr['quality_rating'] = parseInt(quality);
      updateRequired = true;
    }
    if (clenliness !== origClenlinessRating) {
      bodyDataStr['clenliness_rating'] = parseInt(clenliness);
      updateRequired = true;
    }
    if (review !== origReviewBody) {
      if (review.trim().length > 0) {
        const filteredReview = await profanityFilter(review);
        bodyDataStr['review_body'] = filteredReview;
        updateRequired = true;
      } else {
        ToastAndroid.show('Please add review text', ToastAndroid.SHORT);
      }
    }
    if (updateRequired) {
      const bodyData = JSON.stringify(bodyDataStr);
      this.patchReview(pathStr, contentType, bodyData);
    }
  }

  // patch request for user review update
  patchReview = async (path, type, data) => {
    const { navigation } = this.props;
    return patchRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Review updated!', ToastAndroid.SHORT);
          navigation.goBack();
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

  // construct URI for delete review request
  deleteReview = async () => {
    const { locationId, reviewId } = this.state;
    const pathStr = 'location/' + locationId + '/review/' + reviewId;
    this.deleteReviewData(pathStr);
  }

  // delete request for user review
  deleteReviewData = async (path) => {
    const { navigation } = this.props;
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Review deleted!', ToastAndroid.SHORT);
          navigation.goBack();
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

  // navigate to review photo screen to allow user to capture image for review
  addPhoto = () => {
    const { navigation } = this.props;
    const { locationId, reviewId } = this.state;
    navigation.navigate('ReviewPhoto', { locationId: locationId, reviewId: reviewId, returnToPage: 'ReviewUpdate', pageParams: '' });
  }

  // construct URI for delete review photo request
  deletePhoto = async () => {
    const { locationId, reviewId } = this.state;
    const pathStr = 'location/' + locationId + '/review/' + reviewId + '/photo';
    this.deletePhotoData(pathStr);
  }

  // delete photo request for review image
  deletePhotoData = async (path) => {
    const { navigation } = this.props;
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Photo deleted!', ToastAndroid.SHORT);
          // this.getPhoto();
          navigation.goBack();
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
      isLoading,
      nameValue,
      townValue,
      overallRatingValue,
      priceRatingValue,
      qualityRatingValue,
      clenlinessRatingValue,
      reviewBodyValue,
      photoPath,
    } = this.state;

    const styles = StyleSheet.create({
      viewTitle: {
        flex: 4,
        justifyContent: 'center',
      },
      viewForm: {
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
          <H1>Update Your Review for...</H1>
          <Text>
            {nameValue}
            ,
            {' '}
            {townValue}
          </Text>
        </View>

        <View style={styles.viewForm}>
          <ScrollView>
            <Image source={{ uri: photoPath }} style={{ width: 100, height: 100 }} />

            <FormReview
              title="Update Review"
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
              buttonPress={() => this.updateReview(
                overallRatingValue, priceRatingValue,
                qualityRatingValue, clenlinessRatingValue, reviewBodyValue,
              )}
              buttonLabel="Update Review"
            />
            <ButtonBlock buttonFunction={() => this.addPhoto()} buttonText="Add/update photo" />
            <ButtonBlock buttonFunction={() => this.deletePhoto()} buttonText="Delete photo" />
            <ButtonBlock buttonFunction={() => this.deleteReview()} buttonText="Delete review" />
            <ButtonLight buttonFunction={() => navigation.goBack()} buttonText="Cancel" />
          </ScrollView>
        </View>

      </View>

    );
  }
}

ReviewUpdate.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};

export default ReviewUpdate;
