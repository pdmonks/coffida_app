import React, { Component } from 'react';
import {
  View, FlatList, StyleSheet,
} from 'react-native';
import {
  Container, Form, Text, Header, H3, Picker, Item, Icon,
} from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { getRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilityFunctions/UtilityFunctions';
import { setAsyncItem } from '../src/asyncStorage/AsyncUtilities';
import IsLoadingIndicator from '../src/components/shared/IsLoadingIndicator';
import FormItem from '../src/components/shared/FormItem';
import { ButtonBlock, ButtonInfo } from '../src/components/shared/Buttons';

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      locationListData: [],
      qValue: '',
      overallRatingValue: '',
      priceRatingValue: '',
      qualityRatingValue: '',
      clenlinessRatingValue: '',
      searchInValue: '',
      limitValue: '',
      offsetValue: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** Locations Screen **');
      checkUserLogin(this.props);
      this.filteredLocationList();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getLocations = async (path) => {
    this.setState({ isLoading: true });
    return getRequest(path)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'There was a problem, please try again later';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          locationListData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async filteredLocationList() {
    let pathStr = 'find/?';
    const { qValue } = this.state;
    const { overallRatingValue } = this.state;
    const { priceRatingValue } = this.state;
    const { qualityRatingValue } = this.state;
    const { clenlinessRatingValue } = this.state;
    const { searchInValue } = this.state;
    const { limitValue } = this.state;

    if (qValue !== '') {
      pathStr += 'q=' + qValue + '&';
    }
    if (overallRatingValue !== '') {
      pathStr += 'overall_rating=' + overallRatingValue + '&';
    }
    if (priceRatingValue !== '') {
      pathStr += 'price_rating=' + priceRatingValue + '&';
    }
    if (qualityRatingValue !== '') {
      pathStr += 'quality_rating=' + qualityRatingValue + '&';
    }
    if (clenlinessRatingValue !== '') {
      pathStr += 'clenliness_rating=' + clenlinessRatingValue + '&';
    }
    if (searchInValue !== '') {
      pathStr += 'search_in=' + searchInValue + '&';
    }
    if (limitValue !== '') {
      pathStr += 'limit=' + limitValue + '&';
    }
    // remove '?' or last '&' from string
    pathStr = pathStr.substring(0, (pathStr.length - 1));
    this.getLocations(pathStr);
  }

  async selectLocation(id) {
    const { navigation } = this.props;
    await setAsyncItem('@selectedLocationId', id.toString());
    navigation.navigate('LocationNav');
  }

  // https://github.com/GeekyAnts/NativeBase/issues/2947
  // moved flatlist out from content tabs to prevent error warning

  render() {
    const { isLoading } = this.state;
    const { qValue } = this.state;
    const { overallRatingValue } = this.state;
    const { priceRatingValue } = this.state;
    const { qualityRatingValue } = this.state;
    const { clenlinessRatingValue } = this.state;
    const { searchInValue } = this.state;
    const { limitValue } = this.state;

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
        alignSelf: 'stretch',
        backgroundColor: '#f5f5f5',
      },
      viewThree: {
        flex: 5,
        alignSelf: 'stretch',
        backgroundColor: '#f5f5f5',
      },
      viewFour: {
        flex: 15,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
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
          <H3>Coffida Search</H3>
        </View>

        <View style={styles.viewTwo}>
          <ScrollView>
            <Form>
              <FormItem label="Name or town" placeholder="Name or location" onChangeText={(qValue) => this.setState({ qValue })} value={qValue} />
              <FormItem label="Overall rating" placeholder="0 - 5" onChangeText={(overallRatingValue) => this.setState({ overallRatingValue })} value={overallRatingValue} />
              <FormItem label="Price rating" placeholder="0 - 5" onChangeText={(priceRatingValue) => this.setState({ priceRatingValue })} value={priceRatingValue} />
              <FormItem label="Quality rating" placeholder="0 - 5" onChangeText={(qualityRatingValue) => this.setState({ qualityRatingValue })} value={qualityRatingValue} />
              <FormItem label="Cleanliness rating" placeholder="0 - 5" onChangeText={(clenlinessRatingValue) => this.setState({ clenlinessRatingValue })} value={clenlinessRatingValue} />
              <FormItem label="Search in" placeholder="fav or rev" onChangeText={(searchInValue) => this.setState({ searchInValue })} value={searchInValue} />
              <FormItem label="Limit" placeholder="20" onChangeText={(limitValue) => this.setState({ limitValue })} value={limitValue} />
            </Form>
          </ScrollView>
        </View>

        <View style={styles.viewThree}>
          <ButtonBlock buttonFunction={() => this.filteredLocationList()} buttonText="Search" />
          <Text>    Search results:</Text>
        </View>

        <View style={styles.viewFour}>
          <FlatList
            data={this.state.locationListData}
            renderItem={({ item }) => (
              <View>
                <ButtonInfo buttonFunction={() => this.selectLocation(item.location_id.toString())} buttonText={item.location_name + ', ' + item.location_town + item.location_id} />
              </View>
            )}
            keyExtractor={({ location_id }, index) => location_id.toString()}
          />
        </View>

      </View>

    );
  }
}

Locations.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default Locations;
