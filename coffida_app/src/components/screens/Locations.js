import React, { Component } from 'react';
import {
  View, FlatList, StyleSheet,
} from 'react-native';
import {
  Form, Text, H3, ListItem, Left, Right, Radio,
} from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { getRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';
import FormItem from '../shared/FormItem';
import { ButtonBlock, ButtonInfo } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { responseStatusMessage } from '../../api/ApiStatus';
import StarEditable from '../shared/StarEditable';

// screen which allows the user to search for locations based on required criteria
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
      limitValue: '3',
      incrementValue: 3,
      offsetValue: '0', // requires pagination code
      searchMessage: '',
    };
  }

  // page setup; check user is logged in and reload page information

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** Locations Screen **');
      checkUserLogin(this.props);
      this.setState({ offsetValue: '0' }); // reset offset value for search results
      this.filteredLocationList();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // get request for list of searched locations
  getLocations = async (path) => {
    const { navigation } = this.props;
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
        if (responseJson.length === 0) {
          console.log('nothing returned');
          this.setState({
            searchMessage: 'No results',
          });
        }
        this.setState({
          isLoading: false,
          locationListData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // handler for all star rating inputs on search form
  onStarRatingPress = (rating, name) => {
    console.log(name, rating);
    const stateObject = () => {
      const returnObj = {};
      returnObj[name] = rating.toString();
      return returnObj;
    };
    this.setState(stateObject);
  }

  // reset offset value in URI parameter, before running a new locations search
  searchLocations = async () => {
    await this.setState({ offsetValue: 0 });
    console.log('offset value:', this.state.offsetValue);
    this.filteredLocationList(this.state.offsetValue);
  }

  // increase offset result value in URI parameter, before searching for further locations
  previousResults = async () => {
    if (this.state.offsetValue > 0) {
      await this.setState({ offsetValue: (parseInt(this.state.offsetValue) - this.state.incrementValue) });
    }
    console.log('offset value: ', this.state.offsetValue);
    this.filteredLocationList(this.state.offsetValue);
  }

  // increase offset result value in URI parameter, before searching for further locations
  nextResults = async () => {
    await this.setState({ offsetValue: (parseInt(this.state.offsetValue) + this.state.incrementValue) });
    console.log('offset value: ', this.state.offsetValue);
    this.filteredLocationList(this.state.offsetValue);
  }

  // constructs URI from checked search criteria
  async filteredLocationList(offset) {
    await this.setState({ searchMessage: '' });
    let pathStr = 'find/?';
    const {
      qValue,
      overallRatingValue,
      priceRatingValue,
      qualityRatingValue,
      clenlinessRatingValue,
      searchInValue,
      limitValue,
    } = this.state;
    // add each criteria to search URI if selected
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
    if (offset > 0) {
      pathStr += 'offset=' + offset + '&';
    }
    // remove '?' or last '&' from string
    pathStr = pathStr.substring(0, (pathStr.length - 1));
    this.getLocations(pathStr);
  }

  // navigate to selected location page with location ID parameter
  async selectLocation(id) {
    const { navigation } = this.props;
    console.log(id);
    navigation.navigate('Location', { locationId: id });
  }

  // https://github.com/GeekyAnts/NativeBase/issues/2947
  // moved flatlist out from content tabs to prevent error warning

  render() {
    const {
      isLoading,
      qValue,
      overallRatingValue,
      priceRatingValue,
      qualityRatingValue,
      clenlinessRatingValue,
      searchInValue,
      locationListData,
      searchMessage,
    } = this.state;

    const styles = StyleSheet.create({
      viewTitle: {
        flex: 2,
      },
      viewForm: {
        flex: 15,
        alignSelf: 'stretch',
      },
      viewButton: {
        flex: 5,
        alignSelf: 'stretch',
      },
      viewResults: {
        flex: 15,
        flexDirection: 'row',
        // alignSelf: 'stretch',
        borderTopWidth: 1,
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
          <H3>Search for great coffee...</H3>
        </View>

        <View style={styles.viewForm}>
          <ScrollView>
            <Form>
              <ListItem>
                <FormItem label="Name or town" placeholder="Name or location" onChangeText={(qValue) => this.setState({ qValue })} value={qValue} />
              </ListItem>
              <ListItem>
                <Left><Text>Overall rating</Text></Left>
                <Right>
                  <StarEditable
                    rating={overallRatingValue}
                    selectedStar={(rating) => this.onStarRatingPress(rating, 'overallRatingValue')}
                  />
                </Right>
              </ListItem>
              <ListItem>
                <Left><Text>Price rating</Text></Left>
                <Right>
                  <StarEditable
                    rating={priceRatingValue}
                    selectedStar={(rating) => this.onStarRatingPress(rating, 'priceRatingValue')}
                  />
                </Right>
              </ListItem>
              <ListItem>
                <Left><Text>Quality rating</Text></Left>
                <Right>
                  <StarEditable
                    rating={qualityRatingValue}
                    selectedStar={(rating) => this.onStarRatingPress(rating, 'qualityRatingValue')}
                  />
                </Right>
              </ListItem>
              <ListItem>
                <Left><Text>Cleanliness rating</Text></Left>
                <Right>
                  <StarEditable
                    rating={clenlinessRatingValue}
                    selectedStar={(rating) => this.onStarRatingPress(rating, 'clenlinessRatingValue')}
                  />
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text>Search all locations</Text>
                </Left>
                <Right>
                  <Radio
                    onPress={() => this.setState({ searchInValue: '' })}
                    selected={searchInValue === ''}
                  />
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text>Only favourites</Text>
                </Left>
                <Right>
                  <Radio
                    onPress={() => this.setState({ searchInValue: 'favourite' })}
                    selected={searchInValue === 'favourite'}
                  />
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text>Only reviewed</Text>
                </Left>
                <Right>
                  <Radio
                    onPress={() => this.setState({ searchInValue: 'reviewed' })}
                    selected={searchInValue === 'reviewed'}
                  />
                </Right>
              </ListItem>

            </Form>
          </ScrollView>
        </View>

        <View style={styles.viewButton}>
          <ButtonBlock buttonFunction={() => this.searchLocations()} buttonText="Search" />
          <Text>
            {'    Search results: '}
            {searchMessage}
          </Text>
        </View>

        <View style={styles.viewResults}>
          <FlatList
            data={locationListData.sort((a, b) => (a.location_id > b.location_id) ? 1 : -1)}
            renderItem={({ item }) => (
              <View>
                <ButtonInfo buttonFunction={() => this.selectLocation(item.location_id.toString())} buttonText={item.location_name + ', ' + item.location_town + item.location_id} />
              </View>
            )}
            keyExtractor={({ location_id }, index) => location_id.toString()}
          />
          <ButtonBlock buttonFunction={() => this.previousResults()} buttonText="Prev" />
          <ButtonBlock buttonFunction={() => this.nextResults()} buttonText="Next" />
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
