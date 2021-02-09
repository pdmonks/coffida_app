import React, { Component } from 'react';
import {
  Alert, ScrollView, ToastAndroid, Console,
} from 'react-native';
import {
  Container, Content, Form, Item, Input, Text, Button,
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component {
  constructor(props) {
    // inherit properties of Component superclass
    super(props);

    // create state fields for email and password
    this.state = {
      emailValue: '',
      passwordValue: '',
    };
  }

  // handle email input
  handleEmail = (emailInput) => {
    this.setState({ emailValue: emailInput });
  }

  // handle password input
  handlePassword = (passwordInput) => {
    this.setState({ passwordValue: passwordInput });
  }

  // handles login attempt
  login = () => {
    const { navigation } = this.props;
    const { emailValue } = this.state;
    const { passwordValue } = this.state;
    if (emailValue.trim().length > 0 && passwordValue.trim().length > 0) {
      const toSend = {
        email: emailValue,
        password: passwordValue,
      };
      fetch('http://10.0.2.2:3333/api/1.0.0/user/login', // 'return' keyword deleted from the start of this line
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toSend),
        })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 400) {
            throw 'Incorrect login details, please try again';
          } else if (response.status === 500) {
            throw 'Sorry, we are unable to log you in at the moment, please try again later';
          } else {
            throw 'There was a problem, please try again later';
          }
        })
        .then((responseJson) => {
          this.saveName(responseJson.id, responseJson.token);
          navigation.navigate('HomeNav');
        })
        .catch((error) => {
          // console.error(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    } else {
      Alert.alert('Please enter email and password');
    }
  }

  saveName = async (id, token) => {
    try {
      await AsyncStorage.setItem('@id', id.toString());
      console.log('ID: ' + id.toString());
      await AsyncStorage.setItem('@token', token);
      console.log('Token: ' + token);
      ToastAndroid.show('ID and token saved!', ToastAndroid.SHORT);
    } catch (e) {
      console.log('Something broke...');
      console.log(e);
    }
  }

  checkResponseCode = (status) => {
    console.log(status);
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

            <Button block onPress={() => this.login()}>
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
