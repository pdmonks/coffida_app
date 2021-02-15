import React, { Component } from 'react';
import { ScrollView, ToastAndroid, Image, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container, Content, Form, Item, Input, Text, Button, Label,
} from 'native-base';
import PropTypes from 'prop-types';
import { deleteRequest, getRequest, patchRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilities/UtilityFunctions';

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

  /* componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.loadScreen();
    });
  } */

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      // this.checkLoggedIn();
      console.log('** Review Update Screen **');
      checkUserLogin(this.props);
      this.loadScreen();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // can retrieve review data from storage rather than db, as only the user can update
  // but probably need to change to get data from db as needed when screen is refreshed??
  loadScreen = async () => {
    this.setState({
      nameValue: await AsyncStorage.getItem('@reviewName'),
      townValue: await AsyncStorage.getItem('@reviewTown'),
      origOverallRating: await AsyncStorage.getItem('@reviewOverallRating'),
      origPriceRating: await AsyncStorage.getItem('@reviewPriceRating'),
      origQualityRating: await AsyncStorage.getItem('@reviewQualityRating'),
      origClenlinessRating: await AsyncStorage.getItem('@reviewClenlinessRating'),
      origReviewBody: await AsyncStorage.getItem('@reviewBody'),
      overallRatingValue: await AsyncStorage.getItem('@reviewOverallRating'),
      priceRatingValue: await AsyncStorage.getItem('@reviewPriceRating'),
      qualityRatingValue: await AsyncStorage.getItem('@reviewQualityRating'),
      clenlinessRatingValue: await AsyncStorage.getItem('@reviewClenlinessRating'),
      reviewBodyValue: await AsyncStorage.getItem('@reviewBody'),
    });
    this.getPhoto();
  }

  getPhoto = async () => {
    const locId = await AsyncStorage.getItem('@reviewLocId');
    const revId = await AsyncStorage.getItem('@reviewRevId');
    const path = 'location/' + locId + '/review/' + revId + '/photo';
    // const token = await AsyncStorage.getItem('@token');
    // this.setState({ isLoading: true });  // PUT THIS BACK IN WHEN GET REQUEST DONE
    return getRequest(path)
      .then((response) => {
        if (response.status === 200) {
          return response;
        } else if (response.status === 404) {
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
    const locId = await AsyncStorage.getItem('@reviewLocId');
    const revId = await AsyncStorage.getItem('@reviewRevId');
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
      await AsyncStorage.setItem('@reviewOverallRating', overallRatingValue);
    }
    if (priceRatingValue !== origPriceRating) {
      bodyDataStr['price_rating'] = parseInt(priceRatingValue);
      await AsyncStorage.setItem('@reviewPriceRating', priceRatingValue);
    }
    if (qualityRatingValue !== origQualityRating) {
      bodyDataStr['quality_rating'] = parseInt(qualityRatingValue);
      await AsyncStorage.setItem('@reviewQualityRating', qualityRatingValue);
    }
    if (clenlinessRatingValue !== origClenlinessRating) {
      bodyDataStr['clenliness_rating'] = parseInt(clenlinessRatingValue);
      await AsyncStorage.setItem('@reviewClenlinessRating', clenlinessRatingValue);
    }
    if (reviewBodyValue !== origReviewBody) {
      bodyDataStr['review_body'] = reviewBodyValue;
      await AsyncStorage.setItem('@reviewBody', reviewBodyValue);
    }
    const bodyData = JSON.stringify(bodyDataStr);
    this.patchReview(pathStr, contentType, bodyData);
  }

  patchReview = async (path, type, data) => {
    // const token = await AsyncStorage.getItem('@token');
    return patchRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Updated!', ToastAndroid.SHORT);
          // this.getData();
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
    const locId = await AsyncStorage.getItem('@reviewLocId');
    const revId = await AsyncStorage.getItem('@reviewRevId');
    const pathStr = 'location/' + locId + '/review/' + revId;
    this.deleteReviewData(pathStr);
  }

  deleteReviewData = async (path) => {
    // const token = await AsyncStorage.getItem('@token');
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Deleted!', ToastAndroid.SHORT);
          // this.getData();
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
    const locId = await AsyncStorage.getItem('@reviewLocId');
    const revId = await AsyncStorage.getItem('@reviewRevId');
    const pathStr = 'location/' + locId + '/review/' + revId + '/photo';
    this.deletePhotoData(pathStr);
  }

  deletePhotoData = async (path) => {
    // const token = await AsyncStorage.getItem('@token');
    return deleteRequest(path)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Deleted!', ToastAndroid.SHORT);
          // this.getData();
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

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    }

    return (

      <Container>
        <Content>
          <Text>Update a Review for:</Text>
          <Text>
            {nameValue}
            ,
            {' '}
            {townValue}
          </Text>
          <Image source={{ uri: this.state.photoPath }} style={{ width: 100, height: 100 }} />
          <ScrollView>
            <Form>
              <Item fixedLabel>
                <Label>Overall rating: </Label>
                <Input
                  placeholder="0 - 5"
                  onChangeText={(overallRatingValue) => this.setState({ overallRatingValue })}
                  value={overallRatingValue}
                />
              </Item>
              <Item fixedLabel>
                <Label>Price rating: </Label>
                <Input
                  placeholder="0 - 5"
                  onChangeText={(priceRatingValue) => this.setState({ priceRatingValue })}
                  value={priceRatingValue}
                />
              </Item>
              <Item fixedLabel>
                <Label>Quality rating: </Label>
                <Input
                  placeholder="0 - 5"
                  onChangeText={(qualityRatingValue) => this.setState({ qualityRatingValue })}
                  value={qualityRatingValue}
                />
              </Item>
              <Item fixedLabel>
                <Label>Cleanliness rating: </Label>
                <Input
                  placeholder="0 - 5"
                  onChangeText={(clenlinessRatingValue) => this.setState({ clenlinessRatingValue })}
                  value={clenlinessRatingValue}
                />
              </Item>
              <Item last>
                <Label>Review:</Label>
                <Input
                  placeholder="Review text..."
                  onChangeText={(reviewBodyValue) => this.setState({ reviewBodyValue })}
                  value={reviewBodyValue}
                />
              </Item>
            </Form>

            <Button block onPress={() => this.updateReview()}>
              <Text>Update review</Text>
            </Button>

            <Button block onPress={() => this.addPhoto()}>
              <Text>Add a photo to this review</Text>
            </Button>

            <Button block onPress={() => this.deletePhoto()}>
              <Text>Delete photo</Text>
            </Button>

            <Button block onPress={() => this.deleteReview()}>
              <Text>Delete review</Text>
            </Button>

            <Button block onPress={() => navigation.goBack()}>
              <Text>Back</Text>
            </Button>
          </ScrollView>
        </Content>
      </Container>
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
