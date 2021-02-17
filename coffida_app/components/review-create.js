import React, { Component } from 'react';
import { ScrollView, ToastAndroid, StyleSheet } from 'react-native';
import {
  Container, Content, Text, H1, View
} from 'native-base';
import PropTypes from 'prop-types';
import { postRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilityFunctions/UtilityFunctions';
import { getAsyncItem } from '../src/asyncStorage/AsyncUtilities';
import FormReview from '../src/components/shared/FormReview';
import { ButtonBlock, ButtonLight } from '../src/components/shared/Buttons';

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

  submitReview = async () => {
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

    const styles = StyleSheet.create({
      flexContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      },
      viewOne: {
        flex: 1,
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

    return (

      <View style={styles.flexContainer}>

        <View style={styles.viewOne}>
          <H1>Post Your Review</H1>
        </View>

        <View style={styles.viewTwo}>
          <ScrollView>
            <FormReview
              onChangeTextOverall={(overallRatingValue) => this.setState({ overallRatingValue })} valueOverall={overallRatingValue}
              onChangeTextPrice={(priceRatingValue) => this.setState({ priceRatingValue })} valuePrice={priceRatingValue}
              onChangeTextQuality={(qualityRatingValue) => this.setState({ qualityRatingValue })} valueQuality={qualityRatingValue}
              onChangeTextClenliness={(clenlinessRatingValue) => this.setState({ clenlinessRatingValue })} valueClenliness={clenlinessRatingValue}
              onChangeTextReview={(reviewBodyValue) => this.setState({ reviewBodyValue })} valueReview={reviewBodyValue}
              buttonPress={() => this.submitReview()}
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
