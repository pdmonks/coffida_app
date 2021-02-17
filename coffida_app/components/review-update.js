import React, { Component } from 'react';
import { ScrollView, ToastAndroid, Image, StyleSheet } from 'react-native';
import {
  Container, Content, Text, View, H1,
} from 'native-base';
import PropTypes from 'prop-types';
import { deleteRequest, getRequest, patchRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilityFunctions/UtilityFunctions';
import { getAsyncItem, setAsyncItem } from '../src/asyncStorage/AsyncUtilities';
import IsLoadingIndicator from '../src/components/shared/IsLoadingIndicator';
import FormReview from '../src/components/shared/FormReview';
import { ButtonBlock, ButtonLight } from '../src/components/shared/Buttons';

class ReviewUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false, // set this back to true when get request put back in
      nameValue: '',
      townValue: '',
      origOverallRating: '',
      origPriceRating: '',
      origQualityRating: '',
      origClenlinessRating: '',
      origReviewBody: '',
      overallRatingValue: '',
      priceRatingValue: '',
      qualityRatingValue: '',
      clenlinessRatingValue: '',
      reviewBodyValue: '',
      photoPath: 'https://reactnative.dev/img/tiny_logo.png',           // photo_path with placeholder image
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** Review Update Screen **');
      checkUserLogin(this.props);
      this.loadScreen();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // can retrieve review data from storage rather than db, as only the user can update
  loadScreen = async () => {
    this.setState({
      nameValue: await getAsyncItem('@reviewName'),
      townValue: await getAsyncItem('@reviewTown'),
      origOverallRating: await getAsyncItem('@reviewOverallRating'),
      origPriceRating: await getAsyncItem('@reviewPriceRating'),
      origQualityRating: await getAsyncItem('@reviewQualityRating'),
      origClenlinessRating: await getAsyncItem('@reviewClenlinessRating'),
      origReviewBody: await getAsyncItem('@reviewBody'),
      overallRatingValue: await getAsyncItem('@reviewOverallRating'),
      priceRatingValue: await getAsyncItem('@reviewPriceRating'),
      qualityRatingValue: await getAsyncItem('@reviewQualityRating'),
      clenlinessRatingValue: await getAsyncItem('@reviewClenlinessRating'),
      reviewBodyValue: await getAsyncItem('@reviewBody'),
    });
    this.getPhoto();
  }

  getPhoto = async () => {
    const locId = await getAsyncItem('@reviewLocId');
    const revId = await getAsyncItem('@reviewRevId');
    const path = 'location/' + locId + '/review/' + revId + '/photo';
    return getRequest(path)
      .then((response) => {
        if (response.status === 200) {
          return response;
        } else if (response.status === 404) {
          this.setState({photoPath: 'https://reactnative.dev/img/tiny_logo.png'});
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'There was a problem, please try again later';
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

  updateReview = async () => {
    const locId = await getAsyncItem('@reviewLocId');
    const revId = await getAsyncItem('@reviewRevId');
    const pathStr = 'location/' + locId + '/review/' + revId;
    const contentType = 'application/json';
    const { origOverallRating } = this.state;
    const { origPriceRating } = this.state;
    const { origQualityRating } = this.state;
    const { origClenlinessRating } = this.state;
    const { origReviewBody } = this.state;
    const { overallRatingValue } = this.state;
    const { priceRatingValue } = this.state;
    const { qualityRatingValue } = this.state;
    const { clenlinessRatingValue } = this.state;
    const { reviewBodyValue } = this.state;
    const bodyDataStr = {};

    if (overallRatingValue !== origOverallRating) {
      bodyDataStr['overall_rating'] = parseInt(overallRatingValue);
      await setAsyncItem('@reviewOverallRating', overallRatingValue);
    }
    if (priceRatingValue !== origPriceRating) {
      bodyDataStr['price_rating'] = parseInt(priceRatingValue);
      await setAsyncItem('@reviewPriceRating', priceRatingValue);
    }
    if (qualityRatingValue !== origQualityRating) {
      bodyDataStr['quality_rating'] = parseInt(qualityRatingValue);
      await setAsyncItem('@reviewQualityRating', qualityRatingValue);
    }
    if (clenlinessRatingValue !== origClenlinessRating) {
      bodyDataStr['clenliness_rating'] = parseInt(clenlinessRatingValue);
      await setAsyncItem('@reviewClenlinessRating', clenlinessRatingValue);
    }
    if (reviewBodyValue !== origReviewBody) {
      bodyDataStr['review_body'] = reviewBodyValue;
      await setAsyncItem('@reviewBody', reviewBodyValue);
    }
    const bodyData = JSON.stringify(bodyDataStr);
    this.patchReview(pathStr, contentType, bodyData);
  }

  patchReview = async (path, type, data) => {
    return patchRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Updated!', ToastAndroid.SHORT);
        } else if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server error';
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  deleteReview = async () => {
    const locId = await getAsyncItem('@reviewLocId');
    const revId = await getAsyncItem('@reviewRevId');
    const pathStr = 'location/' + locId + '/review/' + revId;
    this.deleteReviewData(pathStr);
  }

  deleteReviewData = async (path) => {
    const { navigation } = this.props;
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Deleted!', ToastAndroid.SHORT);
          navigation.goBack();
        } else if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server error';
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  addPhoto = () => {
    const { navigation } = this.props;
    navigation.navigate('ReviewPhoto');
  }

  deletePhoto = async () => {
    const locId = await getAsyncItem('@reviewLocId');
    const revId = await getAsyncItem('@reviewRevId');
    const pathStr = 'location/' + locId + '/review/' + revId + '/photo';
    this.deletePhotoData(pathStr);
  }

  deletePhotoData = async (path) => {
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Deleted!', ToastAndroid.SHORT);
          this.getPhoto();
        } else if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server error';
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  render() {
    const { navigation } = this.props;
    const { isLoading } = this.state;
    const { nameValue } = this.state;
    const { townValue } = this.state;
    const { overallRatingValue } = this.state;
    const { priceRatingValue } = this.state;
    const { qualityRatingValue } = this.state;
    const { clenlinessRatingValue } = this.state;
    const { reviewBodyValue } = this.state;

    const styles = StyleSheet.create({
      flexContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      },
      viewOne: {
        flex: 4,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      },
      viewTwo: {
        flex: 15,
        //justifyContent: 'space-around',
        alignSelf: 'stretch',
        backgroundColor: '#f5f5f5',
      },
    });

    if (isLoading) {
      return (
        <IsLoadingIndicator />
      );
    }

    return (

      <View style={styles.flexContainer}>

        <View style={styles.viewOne}>
          <H1>Update Your Review for...</H1>
          <Text>
            {nameValue}
            ,
            {' '}
            {townValue}
          </Text>
        </View>



          <View style={styles.viewTwo}>
          <ScrollView>
          <Image source={{ uri: this.state.photoPath }} style={{ width: 100, height: 100 }} />
            <FormReview title="Update Review"
              onChangeTextOverall={(overallRatingValue) => this.setState({ overallRatingValue })} valueOverall={overallRatingValue}
              onChangeTextPrice={(priceRatingValue) => this.setState({ priceRatingValue })} valuePrice={priceRatingValue}
              onChangeTextQuality={(qualityRatingValue) => this.setState({ qualityRatingValue })} valueQuality={qualityRatingValue}
              onChangeTextClenliness={(clenlinessRatingValue) => this.setState({ clenlinessRatingValue })} valueClenliness={clenlinessRatingValue}
              onChangeTextReview={(reviewBodyValue) => this.setState({ reviewBodyValue })} valueReview={reviewBodyValue}
              buttonPress={() => this.updateReview()}
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
};

export default ReviewUpdate;
