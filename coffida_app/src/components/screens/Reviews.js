import React, { Component } from 'react';
import {
  View, FlatList, ToastAndroid, StyleSheet,
} from 'react-native';
import {
  Text, H1, Card, CardItem, Icon,
} from 'native-base';
import PropTypes from 'prop-types';
import { getRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import { getAsyncItem } from '../../asyncStorage/AsyncUtilities';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';
import { ButtonBlock } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { responseStatusMessage } from '../../api/ApiStatus';
import StarFixed from '../shared/StarFixed';

// screen which lists all reviews created by the user and allows
// selection of single review for updating
class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userReviews: [],
    };
  }

  // page setup; check user is logged in and reload page information

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

  // get request for all review information
  getReviews = async () => {
    const { navigation } = this.props;
    const userId = await getAsyncItem('@id');
    const path = 'user/' + userId;
    this.setState({ isLoading: true });
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
        this.setState({
          isLoading: false,
          userReviews: responseJson.reviews,
        });
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  // navigate to selected review update screen, passing relevent review
  // information as parameters meaning additional DB read is not required
  updateReview = async (revId, locId, name, town, overall, price, quality, clenliness, body) => {
    const { navigation } = this.props;
    navigation.navigate('ReviewUpdate', {
      locationId: locId,
      reviewId: revId,
      locationName: name,
      locationTown: town,
      reviewOverall: overall,
      reviewPrice: price,
      reviewQuality: quality,
      reviewClenliness: clenliness,
      reviewBody: body,
    });
  }

  render() {
    const { isLoading, userReviews } = this.state;

    const styles = StyleSheet.create({
      viewTitle: {
        flex: 2,
      },
      viewReviews: {
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
          <H1>Reviews I have posted</H1>
        </View>

        <View style={styles.viewReviews}>
          <FlatList
            data={userReviews}
            renderItem={({ item }) => (
              <Card>
                <Text>
                  {item.location.location_name}
                  {', '}
                  {item.location.location_town}
                </Text>
                <Text>{item.review.review_id}</Text>

                <CardItem>
                  <Text>Overall </Text>
                  <StarFixed rating={item.review.overall_rating} />
                  <Text> Price </Text>
                  <StarFixed rating={item.review.price_rating} />
                </CardItem>
                <CardItem>
                  <Text>Quality </Text>
                  <StarFixed rating={item.review.quality_rating} />
                  <Text> Cleanliness </Text>
                  <StarFixed rating={item.review.clenliness_rating} />
                </CardItem>
                <CardItem>
                  <Text>
                    {'"'}
                    {item.review.review_body}
                    {'"'}
                  </Text>
                </CardItem>
                <CardItem>
                  <Icon name="thumbs-up" style={{ fontSize: 20, color: 'gold' }} />
                  <Text>
                    {item.review.likes}
                  </Text>
                </CardItem>

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
