import React, { Component } from 'react';
import { ScrollView, ToastAndroid, StyleSheet } from 'react-native';
import {
  Container, Content, Text, H1, View
} from 'native-base';
import PropTypes from 'prop-types';
import { postRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import { getAsyncItem } from '../../asyncStorage/AsyncUtilities';
import FormReview from '../shared/FormReview';
import { ButtonBlock, ButtonLight } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { profanityFilter } from '../../utilityFunctions/ProfanityFilter';

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
      console.log('** Review Create Screen **');
      checkUserLogin(this.props);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  postReview = async (path, type, data) => {
    const { navigation } = this.props;
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

  submitReview = async (overall, price, quality, clenliness, review) => {
    const locId = await getAsyncItem('@selectedLocationId');
    const pathStr = 'location/' + locId + '/review';
    const contentType = 'application/json';
    let bodyDataStr = '';
    //const reviewFiltered = await profanityFilter(review);

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
        review_body: await profanityFilter(review),
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
          <ScrollView>
            <FormReview
              onChangeTextOverall={(overallRatingValue) => this.setState({ overallRatingValue })} valueOverall={overallRatingValue}
              onChangeTextPrice={(priceRatingValue) => this.setState({ priceRatingValue })} valuePrice={priceRatingValue}
              onChangeTextQuality={(qualityRatingValue) => this.setState({ qualityRatingValue })} valueQuality={qualityRatingValue}
              onChangeTextClenliness={(clenlinessRatingValue) => this.setState({ clenlinessRatingValue })} valueClenliness={clenlinessRatingValue}
              onChangeTextReview={(reviewBodyValue) => this.setState({ reviewBodyValue })} valueReview={reviewBodyValue}
              buttonPress={() => this.submitReview(overallRatingValue, priceRatingValue, qualityRatingValue, clenlinessRatingValue, reviewBodyValue)}
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
};

export default ReviewCreate;
