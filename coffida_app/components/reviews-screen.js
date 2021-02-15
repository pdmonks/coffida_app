import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container, Content, Form, Item, Input, Text, Button, Card, CardItem,
} from 'native-base';
import PropTypes from 'prop-types';
import { getRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilities/UtilityFunctions';
import { getAsyncItem } from '../src/asyncStorage/AsyncUtilities';

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userReviews: [],
    };
  }

  /* componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.getReviews();
    });
  } */

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      // this.checkLoggedIn();
      console.log('** Reviews Screen **');
      checkUserLogin(this.props);
      this.getReviews();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getReviews = async () => {
    // const userId = await AsyncStorage.getItem('@id');
    const userId = await getAsyncItem('@id');
    const path = 'user/' + userId;
    // const token = await AsyncStorage.getItem('@token');
    this.setState({ isLoading: true });
    return getRequest(path)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'There was a problem, please try again later';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userReviews: responseJson.reviews,
        });
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  updateReview = async (revId, locId, name, town, overall, price, quality, clenliness, body, likes) => {
    const { navigation } = this.props;
    await AsyncStorage.setItem('@reviewRevId', revId);
    await AsyncStorage.setItem('@reviewLocId', locId);
    await AsyncStorage.setItem('@reviewName', name);
    await AsyncStorage.setItem('@reviewTown', town);
    await AsyncStorage.setItem('@reviewOverallRating', overall);
    await AsyncStorage.setItem('@reviewPriceRating', price);
    await AsyncStorage.setItem('@reviewQualityRating', quality);
    await AsyncStorage.setItem('@reviewClenlinessRating', clenliness);
    await AsyncStorage.setItem('@reviewBody', body);
    await AsyncStorage.setItem('@reviewLikes', likes);
    navigation.navigate('ReviewUpdate');
  }

  render() {
    const { isLoading } = this.state;
    const { userReviews } = this.state;

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }

    return (

      <Container>
        <Text>My Reviews List</Text>
        <FlatList
          data={userReviews}
          renderItem={({ item }) => (
            <View>
              <Text>
                Review ID:
                {' '}
                {item.review.review_id}
              </Text>
              <Text>Location ID: {item.location.location_id}</Text>
              <Text>Name: {item.location.location_name} </Text>
              <Text>Town: {item.location.location_town} </Text>
              <Text>Overall rating: {item.review.overall_rating} </Text>
              <Text>Price rating: {item.review.price_rating} </Text>
              <Text>Quality rating: {item.review.quality_rating} </Text>
              <Text>Cleanliness rating: {item.review.clenliness_rating} </Text>
              <Text>Review body: {item.review.review_body} </Text>
              <Text>Likes: {item.review.likes} </Text>
              <Button
                block
                onPress={() => this.updateReview(
                  item.review.review_id.toString(),
                  item.location.location_id.toString(),
                  item.location.location_name,
                  item.location.location_town,
                  item.review.overall_rating.toString(),
                  item.review.price_rating.toString(),
                  item.review.quality_rating.toString(),
                  item.review.clenliness_rating.toString(),
                  item.review.review_body,
                  item.review.likes.toString(),
                )}
              >
                <Text>Update Review</Text>
              </Button>
            </View>
          )}
          keyExtractor={({ review }, index) => review.review_id.toString()}
        />

      </Container>

    );
  }
}

Reviews.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default Reviews;
