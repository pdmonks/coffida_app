import React, { Component } from 'react';
import {
  ScrollView, Alert, ToastAndroid,
} from 'react-native';
import {
  Container, Content, Form, Item, Input, Text, Button,
} from 'native-base';
import PropTypes from 'prop-types';

class NewAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstNameValue: '',
      lastNameValue: '',
      emailValue: '',
      passwordValue: '',
    };
  }

  createAccount() {
    const { navigation } = this.props;
    const { firstNameValue } = this.state;
    const { lastNameValue } = this.state;
    const { emailValue } = this.state;
    const { passwordValue } = this.state;
    const toSend = {
      first_name: firstNameValue,
      last_name: lastNameValue,
      email: emailValue,
      password: passwordValue,
    };
    return fetch('http://10.0.2.2:3333/api/1.0.0/user',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSend),
      })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          throw 'Invalid details entered, please try again';
        } else if (response.status === 500) {
          throw 'Sorry, we are unable to create your account at the moment, please try again later';
        } else {
          throw 'There was a problem, please try again later';
        }
      })
      .then((responseJson) => {
        Alert.alert('Account created with ID: ' + responseJson.id + ' !');
        navigation.goBack();
      })
      .catch((error) => {
        // console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  render() {
    const { navigation } = this.props;
    const { firstNameValue } = this.state;
    const { lastNameValue } = this.state;
    const { emailValue } = this.state;
    const { passwordValue } = this.state;

    return (

      <Container>
        <Content>
          <Text>New Account Screen</Text>
          <ScrollView>
            <Form>
              <Item>
                <Input
                  placeholder="Enter first name..."
                  onChangeText={(firstNameValue) => this.setState({ firstNameValue })}
                  value={firstNameValue}
                />
              </Item>
              <Item>
                <Input
                  placeholder="Enter last name..."
                  onChangeText={(lastNameValue) => this.setState({ lastNameValue })}
                  value={lastNameValue}
                />
              </Item>
              <Item>
                <Input
                  placeholder="Enter email address..."
                  onChangeText={(emailValue) => this.setState({ emailValue })}
                  value={emailValue}
                />
              </Item>
              <Item last>
                <Input
                  placeholder="Enter password..."
                  secureTextEntry
                  onChangeText={(passwordValue) => this.setState({ passwordValue })}
                  value={passwordValue}
                />
              </Item>
            </Form>

            <Button block onPress={() => this.createAccount()}>
              <Text>Submit</Text>
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

NewAccount.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    popToTop: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default NewAccount;
