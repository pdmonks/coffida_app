import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container, Content, Form, Item, Input, Text, Button, Label,
} from 'native-base';
import PropTypes from 'prop-types';

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

  createReview = async () => {
    const { navigation } = this.props;
    const { overallRatingValue } = this.state;
    const { priceRatingValue } = this.state;
    const { qualityRatingValue } = this.state;
    const { clenlinessRatingValue } = this.state;
    const { reviewBodyValue } = this.state;
    const toSend = {
      overall_rating: parseInt(overallRatingValue),
      price_rating: parseInt(priceRatingValue),
      quality_rating: parseInt(qualityRatingValue),
      clenliness_rating: parseInt(clenlinessRatingValue),
      review_body: reviewBodyValue,
    };
    const locId = await AsyncStorage.getItem('@selectedLocationId');
    const token = await AsyncStorage.getItem('@token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locId + '/review',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify(toSend),
      })
      .then((response) => {
        if (response.status === 201) {
          ToastAndroid.show('Review created!', ToastAndroid.SHORT);
          navigation.navigate('Location');
          //return response.json();
        } else if (response.status === 400) {
          throw 'Invalid details entered, please try again';
        } else if (response.status === 500) {
          throw 'Sorry, we are unable to create your account at the moment, please try again later';
        } else {
          throw 'There was a problem, please try again later';
        }
      })
      // .then((responseJson) => {
      // console.log('baby');
      // Alert.alert('Review created with ID: ' + responseJson.id + ' !');
      // navigation.goBack();
      // })
      .catch((error) => {
        // console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  async submitReview() {
    const { overallRatingValue } = this.state;
    const { priceRatingValue } = this.state;
    const { qualityRatingValue } = this.state;
    const { clenlinessRatingValue } = this.state;
    const { reviewBodyValue } = this.state;
    console.log(overallRatingValue);
    if ((overallRatingValue >= 0 && overallRatingValue <= 5)
      && (priceRatingValue >= 0 && priceRatingValue <= 5)
      && (qualityRatingValue >= 0 && qualityRatingValue <= 5)
      && (clenlinessRatingValue >= 0 && clenlinessRatingValue <= 5)
      && (reviewBodyValue !== '')) {
      console.log('yo');
      this.createReview();
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
