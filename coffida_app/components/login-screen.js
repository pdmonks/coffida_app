import React, { Component } from 'react';
import { ScrollView, ToastAndroid } from 'react-native';
import {
  Container, Content, Form, Item, Input, Text, Button,
} from 'native-base';
import PropTypes from 'prop-types';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { postRequest } from '../src/api/ApiRequests';
import { setAsyncItem } from '../src/asyncStorage/AsyncUtilities';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValue: '',
      passwordValue: '',
    };
  }

  handleEmail = (emailInput) => {
    this.setState({ emailValue: emailInput });
  }

  handlePassword = (passwordInput) => {
    this.setState({ passwordValue: passwordInput });
  }

  handleLogin = () => {
    const pathStr = 'user/login';
    const contentType = 'application/json';
    const { emailValue } = this.state;
    const { passwordValue } = this.state;
    if (emailValue.trim().length > 0 && passwordValue.trim().length > 0) {
      const bodyDataStr = {
        email: emailValue,
        password: passwordValue,
      };
      const bodyData = JSON.stringify(bodyDataStr);
      this.postLogin(pathStr, contentType, bodyData);
    } else {
      ToastAndroid.show('Please enter email and password', ToastAndroid.SHORT);
    }
  }

  postLogin = (path, type, data) => {
    const { navigation } = this.props;
    // const token = null;
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          throw 'Incorrect login details, please try again';
        } else if (response.status === 500) {
          throw 'Sorry, we are unable to log you in at the moment, please try again later';
        } else {
          throw 'There was a problem, please try again later';
        }
      })
      .then((responseJson) => {
        return this.saveUser(responseJson.id, responseJson.token);
        // navigation.navigate('HomeNav');
      })
      .then((resp) => {
        if (resp === 1) {
          navigation.navigate('HomeNav'); // waits for async storage save before going to home screen
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  saveUser = async (id, token) => {
    try {
      // await AsyncStorage.setItem('@id', id.toString());
      await setAsyncItem('@id', id.toString());
      // await AsyncStorage.setItem('@token', token);
      await setAsyncItem('@token', token);
      return 1;
    } catch (e) {
      console.log('Something broke...');
      console.log(e);
    }
  }

  render() {
    const { navigation } = this.props;
    const { emailValue } = this.state;
    const { passwordValue } = this.state;

    return (

      <Container>
        <Content>
          <Text>Login</Text>
          <ScrollView>
            <Form>
              <Item>
                <Input
                  placeholder="Enter email address..."
                  onChangeText={this.handleEmail}
                  value={emailValue}
                />
              </Item>
              <Item last>
                <Input
                  placeholder="Enter password..."
                  secureTextEntry
                  onChangeText={this.handlePassword}
                  value={passwordValue}
                />
              </Item>
            </Form>

            <Button block onPress={() => this.handleLogin()}>
              <Text>Log in</Text>
            </Button>

            <Button block onPress={() => navigation.navigate('NewAccount')}>
              <Text>Create New Account</Text>
            </Button>

            <Button block onPress={() => navigation.popToTop()}>
              <Text>Back to Welcome Screen</Text>
            </Button>
          </ScrollView>

        </Content>
      </Container>

    );
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    popToTop: PropTypes.func.isRequired,
  }).isRequired,
};

export default Login;
