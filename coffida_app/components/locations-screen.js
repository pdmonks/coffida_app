import React, { Component } from 'react';
import {
  View, TouchableOpacity, FlatList, ActivityIndicator, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container, Content, Form, Item, Input, Text, Button, Header, Label,
} from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';

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
    //this.getData();
    this.filteredLocationList();
  }

  getToken = async () => {
    try {
      // const readId = await AsyncStorage.getItem('@id');
      const readToken = await AsyncStorage.getItem('@token');
      if (readToken !== null) {
        // alert("ID: " + readId + " Token: " + readToken);
        console.log('getToken: ' + readToken);
        return readToken;
      }
    } catch (e) {
      console.log('Something broke...');
    }
  }

  getData = async (pList) => {
    const token = await this.getToken();
    this.setState({ isLoading: true });
    // const param = pList;
    // console.log(param);
    return fetch('http://10.0.2.2:3333/api/1.0.0/find/' + pList,
      {
        method: 'GET',
        headers: { 'X-Authorization': token },
      }) // need to code IS LOADING
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
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
    let parameterList = '?';
    const { qValue } = this.state;
    const { overallRatingValue } = this.state;
    const { priceRatingValue } = this.state;
    const { qualityRatingValue } = this.state;
    const { clenlinessRatingValue } = this.state;
    const { searchInValue } = this.state;
    const { limitValue } = this.state;

    if (qValue !== '') {
      parameterList += 'q=' + qValue + '&';
    }
    if (overallRatingValue !== '') {
      parameterList += 'overall_rating=' + overallRatingValue + '&';
    }
    if (priceRatingValue !== '') {
      parameterList += 'price_rating=' + priceRatingValue + '&';
    }
    if (qualityRatingValue !== '') {
      parameterList += 'quality_rating=' + qualityRatingValue + '&';
    }
    if (clenlinessRatingValue !== '') {
      parameterList += 'clenliness_rating=' + clenlinessRatingValue + '&';
    }
    if (searchInValue !== '') {
      parameterList += 'search_in=' + searchInValue + '&';
    }
    if (limitValue !== '') {
      parameterList += 'limit=' + limitValue + '&';
    }
    console.log(parameterList.substring(0, (parameterList.length - 1)));
    this.getData(parameterList.substring(0, (parameterList.length - 1))); // remove last '?' from string
  }

  async selectLocation(id) {
    const { navigation } = this.props;
    // Alert.alert(id);
    console.log('Selected Location ID: ' + id);
    await AsyncStorage.setItem('@selectedLocationId', id.toString());
    navigation.navigate('LocationNav');
  }

  // https://github.com/GeekyAnts/NativeBase/issues/2947
  // moved flatlist out from content tabs to prevent error warning

  render() {
    const { navigation } = this.props;
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
