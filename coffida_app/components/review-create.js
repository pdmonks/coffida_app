import React, { Component } from 'react';
import { ScrollView, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container, Content, Form, Item, Input, Text, Button, Label,
} from 'native-base';
import PropTypes from 'prop-types';
import { postRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilityFunctions/UtilityFunctions';
import { getAsyncItem } from '../src/asyncStorage/AsyncUtilities';

class ReviewCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overallRatingValue: '',
      priceRatingValue: '',
      qualityRatingValue: '',
      clenlinessRatingValue: '',
      reviewBodyValue: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      // this.checkLoggedIn();
      console.log('** Review Create Screen **');
      checkUserLogin(this.props);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  postReview = async (path, type, data) => {
    const { navigation } = this.props;
    // const token = await AsyncStorage.getItem('@token');
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status === 201) {
          ToastAndroid.show('Review created!', ToastAndroid.SHORT);
          navigation.navigate('Location');
        } else if (response.status === 400) {
          throw 'Invalid details entered, please try again';
        } else if (response.status === 500) {
          throw 'Sorry, we are unable to create your account at the moment, please try again later';
        } else {
          throw 'There was a problem, please try again later';
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  submitReview = async () => {
    // const locId = await AsyncStorage.getItem('@selectedLocationId');
    const locId = await getAsyncItem('@selectedLocationId');
    const pathStr = 'location/' + locId + '/review';
    const contentType = 'application/json';
    let bodyDataStr = '';
    const { overallRatingValue } = this.state;
    const { priceRatingValue } = this.state;
    const { qualityRatingValue } = this.state;
    const { clenlinessRatingValue } = this.state;
    const { reviewBodyValue } = this.state;
    if ((overallRatingValue >= 0 && overallRatingValue <= 5)
      && (priceRatingValue >= 0 && priceRatingValue <= 5)
      && (qualityRatingValue >= 0 && qualityRatingValue <= 5)
      && (clenlinessRatingValue >= 0 && clenlinessRatingValue <= 5)
      && (reviewBodyValue !== '')) {
      bodyDataStr = {
        overall_rating: parseInt(overallRatingValue),
        price_rating: parseInt(priceRatingValue),
        quality_rating: parseInt(qualityRatingValue),
        clenliness_rating: parseInt(clenlinessRatingValue),
        review_body: reviewBodyValue,
      };
      const bodyData = JSON.stringify(bodyDataStr);
      this.postReview(pathStr, contentType, bodyData);
    } else {
      console.log('missing data');
    }
  }

  render() {
    const { navigation } = this.props;
    const { overallRatingValue } = this.state;
    const { priceRatingValue } = this.state;
    const { qualityRatingValue } = this.state;
    const { clenlinessRatingValue } = this.state;
    const { reviewBodyValue } = this.state;

    return (

      <Container>
        <Content>
          <Text>Create a Review Screen</Text>
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

            <Button block onPress={() => this.submitReview()}>
              <Text>Submit review</Text>
            </Button>

            <Button block onPress={() => navigation.goBack()}>
              <Text>Cancel</Text>
            </Button>
          </ScrollView>

        </Content>
      </Container>

    );
  }
}

ReviewCreate.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default ReviewCreate;
