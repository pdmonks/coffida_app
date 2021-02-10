import React, { Component } from 'react';
import { View, TouchableOpacity, Image, FlatList, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container, Content, Form, Item, Input, Text, Button, Card, CardItem,
} from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';

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
    this.getLocationInfo();
  }

  getLocationInfo = async () => {
    const locationId = await AsyncStorage.getItem('@selectedLocationId');
    console.log(locationId);
    this.getData(locationId);
  }

  getData = async (locId) => {
    const token = await AsyncStorage.getItem('@token');
    this.setState({ isLoading: true });
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locId,
      {
        method: 'GET',
        headers: { 'X-Authorization': token },
      }) // need to code IS LOADING
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 404) {
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
        console.log(error);
      });
  }

  likeReview = async (revId) => {
    console.log('Like: ' + revId);
    const locId = await AsyncStorage.getItem('@selectedLocationId');
    const token = await AsyncStorage.getItem('@token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locId + '/review/' + revId + '/like',
      {
        method: 'POST',
        headers: { 'X-Authorization': token },
      }) // need to code IS LOADING
      .then((response) => {
        if (response.status === 200) {
          //return response.json();
          console.log('review liked');
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
      /* .then((responseJson) => {
        this.setState({
          isLoading: false,
          locationIdValue: responseJson.location_id,
          locationNameValue: responseJson.location_name,

        });
        // console.log(this.photoPathValue);
      }) */
      .catch((error) => {
        console.log(error);
      });
  }

  unlikeReview = async (revId) => {
    console.log('Unlike: ' + revId);
    const locId = await AsyncStorage.getItem('@selectedLocationId');
    const token = await AsyncStorage.getItem('@token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locId + '/review/' + revId + '/like',
      {
        method: 'DELETE',
        headers: { 'X-Authorization': token },
      }) // need to code IS LOADING
      .then((response) => {
        if (response.status === 200) {
          //return response.json();
          console.log('review unliked');
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
      /* .then((responseJson) => {
        this.setState({
          isLoading: false,
          locationIdValue: responseJson.location_id,
          locationNameValue: responseJson.location_name,

        });
        // console.log(this.photoPathValue);
      }) */
      .catch((error) => {
        console.log(error);
      });
  }

  addFavourite = async () => {
    console.log("fav");
    const locId = await AsyncStorage.getItem('@selectedLocationId');
    console.log(locId);
    const token = await AsyncStorage.getItem('@token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locId + '/favourite',
      {
        method: 'POST',
        headers: { 'X-Authorization': token },
      }) // need to code IS LOADING
      .then((response) => {
        if (response.status === 200) {
          //return response.json();
          console.log('location added to favourites');
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
      /* .then((responseJson) => {
        this.setState({
          isLoading: false,
          locationIdValue: responseJson.location_id,
          locationNameValue: responseJson.location_name,

        });
        // console.log(this.photoPathValue);
      }) */
      .catch((error) => {
        console.log(error);
      });
  }

  deleteFavourite = async () => {
    console.log("unfav");
    const locId = await AsyncStorage.getItem('@selectedLocationId');
    console.log(locId);
    const token = await AsyncStorage.getItem('@token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locId + '/favourite',
      {
        method: 'DELETE',
        headers: { 'X-Authorization': token },
      }) // need to code IS LOADING
      .then((response) => {
        if (response.status === 200) {
          //return response.json();
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
      /* .then((responseJson) => {
        this.setState({
          isLoading: false,
          locationIdValue: responseJson.location_id,
          locationNameValue: responseJson.location_name,

        });
        // console.log(this.photoPathValue);
      }) */
      .catch((error) => {
        console.log(error);
      });
  }

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
    const { latitudeValue } = this.state;
    const { longitudeValue } = this.state;
    // const { photoPathValue } = this.state;
    const { avgOverallRatingValue } = this.state;
    const { avgPriceRatingValue } = this.state;
    const { avgQualityRatingValue } = this.state;
    const { avgClenlinessRatingValue } = this.state;
    const { locationReviews } = this.state;

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }

    return (

      <Container>
        <Text>Location</Text>

        <Button block onPress={() => navigation.navigate('ReviewCreate')}>
          <Text>Create a new review</Text>
        </Button>

        <Button block onPress={() => navigation.navigate('ReviewPhoto')}>
          <Text>Take a photo</Text>
        </Button>

        <Button block onPress={() => this.addFavourite()}>
          <Text>add to favourites</Text>
        </Button>

        <Button block onPress={() => this.deleteFavourite()}>
          <Text>delete from favourites</Text>
        </Button>

        <ScrollView>

          <Text>Location ID: {locationIdValue} </Text>
          <Text>Name: {locationNameValue} </Text>
          <Text>Town: {locationTownValue} </Text>
          <Text>Latitude: {latitudeValue} </Text>
          <Text>Longitude: {longitudeValue} </Text>
          <Text>Average Overall Rating: {avgOverallRatingValue} </Text>
          <Text>Average Price Rating: {avgPriceRatingValue} </Text>
          <Text>Average Quality Rating: {avgQualityRatingValue} </Text>
          <Text>Average Cleanliness Rating: {avgClenlinessRatingValue} </Text>

          <Card>
            <CardItem cardBody>
              <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{ width: 100, height: 100 }} />
            </CardItem>
          </Card>

        </ScrollView>

        <FlatList
          data={locationReviews}
          renderItem={({ item }) => (
            <View>
              <Text>Review ID: {item.review_id} </Text>
              <Text>Overall rating: {item.overall_rating} </Text>
              <Text>Price rating: {item.price_rating} </Text>
              <Text>Quality rating: {item.quality_rating} </Text>
              <Text>Cleanliness rating: {item.clenliness_rating} </Text>
              <Text>Review body: {item.review_body} </Text>
              <Text>Likes: {item.likes} </Text>
              <Button block onPress={() => this.likeReview(item.review_id.toString())}>
                <Text>Like Review</Text>
              </Button>
              <Button block onPress={() => this.unlikeReview(item.review_id.toString())}>
                <Text>Unlike Review</Text>
              </Button>
            </View>
          )}
          keyExtractor={({ review_id }, index) => review_id.toString()}
        />

      </Container>

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
