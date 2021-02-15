import React, { Component } from 'react';
import {
  View, TouchableOpacity, FlatList, ActivityIndicator, Alert,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container, Content, Form, Item, Input, Text, Button, Header, Label,
} from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { getRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilityFunctions/UtilityFunctions';
import { setAsyncItem } from '../src/asyncStorage/AsyncUtilities';

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

  /* componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.filteredLocationList();
    });
  } */

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      // this.checkLoggedIn();
      console.log('** Locations Screen **');
      checkUserLogin(this.props);
      this.filteredLocationList();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  /* getToken = async () => {
    try {
      const readToken = await AsyncStorage.getItem('@token');
      if (readToken !== null) {
        return readToken;
      }
    } catch (e) {
      console.log('Something broke...');
    }
  } */

  getLocations = async (path) => {
    // const token = await this.getToken();
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
    // await AsyncStorage.setItem('@selectedLocationId', id.toString());
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

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    }

    return (

      <Container>

        <Header>
          <Text>Locations List</Text>
          <Button block onPress={() => this.filteredLocationList()}>
            <Text>Search for a location</Text>
          </Button>
        </Header>

        <ScrollView>

          <Text>Search filters:</Text>
          <Form>
            <Item fixedLabel>
              <Label>Loc. name:</Label>
              <Input
                placeholder="Query string..."
                onChangeText={(qValue) => this.setState({ qValue })}
                value={qValue}
              />
            </Item>
            <Item fixedLabel>
              <Label>Overall rating: </Label>
              <Input
                placeholder="0 - 5"
                onChangeText={(overallRatingValue) => this.setState({ overallRatingValue })}
                value={overallRatingValue}
              />
            </Item>
            <Item>
              <Label>Price rating:</Label>
              <Input
                placeholder="0 - 5"
                onChangeText={(priceRatingValue) => this.setState({ priceRatingValue })}
                value={priceRatingValue}
              />
            </Item>
            <Item>
              <Label>Quality rating:</Label>
              <Input
                placeholder="0 - 5"
                onChangeText={(qualityRatingValue) => this.setState({ qualityRatingValue })}
                value={qualityRatingValue}
              />
            </Item>
            <Item>
              <Label>Cleanliness rating:</Label>
              <Input
                placeholder="0 - 5"
                onChangeText={(clenlinessRatingValue) => this.setState({ clenlinessRatingValue })}
                value={clenlinessRatingValue}
              />
            </Item>
            <Item>
              <Label>Search in:</Label>
              <Input
                placeholder="fav or rev"
                onChangeText={(searchInValue) => this.setState({ searchInValue })}
                value={searchInValue}
              />
            </Item>
            <Item last>
              <Label>Limit:</Label>
              <Input
                placeholder="20"
                onChangeText={(limitValue) => this.setState({ limitValue })}
                value={limitValue}
              />
            </Item>
          </Form>

        </ScrollView>

        <Text>Search results:</Text>

        <FlatList
          data={this.state.locationListData}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.location_name}
                {item.location_id}
              </Text>
              <Button block onPress={() => this.selectLocation(item.location_id.toString())}>
                <Text>Select</Text>
              </Button>
            </View>
          )}
          keyExtractor={({ location_id }, index) => location_id.toString()}
        />

      </Container>

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
