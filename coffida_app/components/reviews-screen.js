import React, { Component } from 'react';
import { View, FlatList, ToastAndroid, StyleSheet } from 'react-native';
import {
  Container, Text, Button, H1, Card, CardItem,
} from 'native-base';
import PropTypes from 'prop-types';
import { getRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilityFunctions/UtilityFunctions';
import { getAsyncItem, setAsyncItem } from '../src/asyncStorage/AsyncUtilities';
import IsLoadingIndicator from '../src/components/shared/IsLoadingIndicator';
import { ButtonBlock } from '../src/components/shared/Buttons';

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userReviews: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** Reviews Screen **');
      checkUserLogin(this.props);
      this.getReviews();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getReviews = async () => {
    const userId = await getAsyncItem('@id');
    const path = 'user/' + userId;
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
    await setAsyncItem('@reviewRevId', revId);
    await setAsyncItem('@reviewLocId', locId);
    await setAsyncItem('@reviewName', name);
    await setAsyncItem('@reviewTown', town);
    await setAsyncItem('@reviewOverallRating', overall);
    await setAsyncItem('@reviewPriceRating', price);
    await setAsyncItem('@reviewQualityRating', quality);
    await setAsyncItem('@reviewClenlinessRating', clenliness);
    await setAsyncItem('@reviewBody', body);
    await setAsyncItem('@reviewLikes', likes);
    navigation.navigate('ReviewUpdate');
  }

  render() {
    const { isLoading } = this.state;
    const { userReviews } = this.state;

    const styles = StyleSheet.create({
      flexContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      },
      viewOne: {
        flex: 2,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      },
      viewTwo: {
        flex: 15,
        //justifyContent: 'space-around',
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
          <H1>My Reviews</H1>
        </View>

        <View style={styles.viewTwo}>
          <FlatList
            data={userReviews}
            renderItem={({ item }) => (
              <Card>
                <Text>{item.location.location_name}, {item.location.location_town} </Text>
                <Text>Overall {item.review.overall_rating} </Text>
                <Text>Price {item.review.price_rating} </Text>
                <Text>Quality {item.review.quality_rating} </Text>
                <Text>Cleanliness {item.review.clenliness_rating} </Text>
                <Text>"{item.review.review_body}"</Text>
                <Text>Likes: {item.review.likes} </Text>
                <ButtonBlock
                  buttonFunction={() => this.updateReview(
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
                  buttonText="Update Review"
                />
              </Card>
            )}
            keyExtractor={({ review }, index) => review.review_id.toString()}
          />
        </View>

      </View>

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
