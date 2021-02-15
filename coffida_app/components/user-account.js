import React, { Component } from 'react';
import { ToastAndroid, View, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container, Content, Form, Item, Input, Text, Button,
} from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { getRequest, patchRequest, postRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilities/UtilityFunctions';
import { getAsyncItem, setAsyncItem } from '../src/asyncStorage/AsyncUtilities';

class UserAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      origFirstName: '',
      origLastName: '',
      origEmail: '',
      origPassword: '',
      firstNameValue: '',
      lastNameValue: '',
      emailValue: '',
      passwordValue: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      // this.checkLoggedIn();
      console.log('** User Account Screen **');
      checkUserLogin(this.props);
      this.getUser();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  /* checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@token');
    const { navigation } = this.props;
    if (value == null) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('HomeNav');
    }
  } */

  // handles logout attempt
  logout = async () => {
    const pathStr = 'user/logout';
    const contentType = null;
    const bodyData = null;
    this.postLogout(pathStr, contentType, bodyData);
  }

  postLogout = async (path, type, data) => {
    const { navigation } = this.props;
    // const token = await getAsyncItem('@token');
    return postRequest(path, type, data)
      .then(async (response) => {
        if (response.status === 200) {
          ToastAndroid.show('Logged out: ' + response.status, ToastAndroid.SHORT);
          // await AsyncStorage.setItem('@token', ''); // reset token
          await setAsyncItem('@token', ''); // reset token
        } else if (response.status === 401) {
          throw 'Unauthorised request';
        } else if (response.status === 500) {
          throw 'Server error';
        }
      })
      .then(navigation.navigate('Welcome')) // go back to welcome screen whether or not request is authorised
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  /* getToken = async () => {
    try {
      const readId = await AsyncStorage.getItem('@id');
      const readToken = await AsyncStorage.getItem('@token');
      if (readId !== null && readToken !== null) {
        return readToken;
      }
    } catch (e) {
      console.log('Something broke...')
    }
  }

  getId = async () => {
    try {
      const readId = await AsyncStorage.getItem('@id');
      if (readId !== null) {
        return readId;
      }
    } catch (e) {
      console.log('Something broke...');
    }
  } */

  getUser = async () => {
    // const userId = await this.getId();
    const userId = await getAsyncItem('@id');
    const path = 'user/' + userId;
    // const token = await this.getToken();
    // const token = await getAsyncItem('@token');
    this.setState({ isLoading: true });
    return getRequest(path)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'There was a problem, please try again later';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          origFirstName: responseJson.first_name,
          origLastName: responseJson.last_name,
          origEmail: responseJson.email,
          origPassword: responseJson.password,
          firstNameValue: responseJson.first_name,
          lastNameValue: responseJson.last_name,
          emailValue: responseJson.email,
          passwordValue: responseJson.password,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateUser = async () => {
    //const userId = await this.getId();
    const userId = await getAsyncItem('@id');
    const pathStr = 'user/' + userId;
    const contentType = 'application/json';
    const { origFirstName } = this.state;
    const { origLastName } = this.state;
    const { origEmail } = this.state;
    const { origPassword } = this.state;
    const { firstNameValue } = this.state;
    const { lastNameValue } = this.state;
    const { emailValue } = this.state;
    const { passwordValue } = this.state;
    const bodyDataStr = {};

    if (firstNameValue !== origFirstName) {
      bodyDataStr['first_name'] = firstNameValue;
    }
    if (lastNameValue !== origLastName) {
      bodyDataStr['last_name'] = lastNameValue;
    }
    if (emailValue !== origEmail) {
      bodyDataStr['email'] = (emailValue);
    }
    if (passwordValue !== origPassword) {
      bodyDataStr['password'] = (passwordValue);
    }
    const bodyData = JSON.stringify(bodyDataStr);
    this.patchUser(pathStr, contentType, bodyData);
  }

  patchUser = async (path, type, data) => {
    // const token = await getAsyncItem('@token');
    return patchRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Updated!', ToastAndroid.SHORT);
          this.getUser();
        } else if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Forbidden';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server error';
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  unsubscribe() {
    const { navigation } = this.props;
    navigation.addListener('focus', () => {
      // this.checkLoggedIn();
    });
  }

  render() {
    const { isLoading } = this.state;
    const { origFirstName } = this.state;
    const { origLastName } = this.state;
    const { origEmail } = this.state;
    const { firstNameValue } = this.state;
    const { lastNameValue } = this.state;
    const { emailValue } = this.state;
    const { passwordValue } = this.state;

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    }

    return (

      <Container>
        <Content>
          <Text>User Account Details</Text>
          <ScrollView>

            <Text>
              {origFirstName} {origLastName}
            </Text>
            <Text>
              Email:
              {origEmail}
            </Text>

            <Text />

            <Form>
              <Text>Update User Information</Text>
              <Item>
                <Input
                  placeholder="Enter new first name..."
                  onChangeText={(firstNameValue) => this.setState({ firstNameValue })}
                  value={firstNameValue}
                />
              </Item>
              <Item>
                <Input
                  placeholder="Enter new last name..."
                  onChangeText={(lastNameValue) => this.setState({ lastNameValue })}
                  value={lastNameValue}
                />
              </Item>
              <Item>
                <Input
                  placeholder="Enter new email address..."
                  onChangeText={(emailValue) => this.setState({ emailValue })}
                  value={emailValue}
                />
              </Item>
              <Item last>
                <Input
                  placeholder="Enter new password..."
                  secureTextEntry
                  onChangeText={(passwordValue) => this.setState({ passwordValue })}
                  value={passwordValue}
                />
              </Item>
            </Form>

            <Button block onPress={() => this.updateUser()}>
              <Text>Update</Text>
            </Button>

            <Button block onPress={() => this.logout()}>
              <Text>Log out and go back to Welcome Screen</Text>
            </Button>
          </ScrollView>

        </Content>
      </Container>

    );
  }
}

UserAccount.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default UserAccount;
