<<<<<<< HEAD
import React, { Component } from 'react';
import { ToastAndroid, View, ActivityIndicator } from 'react-native';
=======
import React, {Component} from 'react';
import {Text, TextInput, Button, View, TouchableOpacity, ScrollView, Alert} from 'react-native';
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container, Content, Form, Item, Input, Text, Button,
} from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';

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

  /* componentDidMount() {
    this.getData();
  } */

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@token');
    const { navigation } = this.props;
    // console.log('Token: ' + value);
    if (value == null) {
      navigation.navigate('Login');
      // this.navigation.navigate('Login');
    } else {
      navigation.navigate('HomeNav');
      // this.navigation.navigate('HomeNav');
    }
  }

  // handles logout attempt
  logout = async () => {
    const { navigation } = this.props;
    const token = await this.getToken();
    console.log('logout: ' + token);
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/logout',
      {
        method: 'POST',
        headers: { 'X-Authorization': token },
      })
      .then(async (response) => {
        if (response.status === 200) {
          // Alert.alert('Logged out: ' + response.status);
          ToastAndroid.show('Logged out: ' + response.status, ToastAndroid.SHORT);
          await AsyncStorage.setItem('@token', ''); // reset token
          // navigation.navigate('Welcome');
        } else if (response.status === 401) {
          throw 'Unauthorised request';
        } else if (response.status === 500) {
          throw 'Server error';
        }
      })
      /* .then(async (response) => {
        Alert.alert('Logged out: ' + response.status);
        await AsyncStorage.setItem('@token', ''); // reset token
        navigation.navigate('Welcome');
      }) */
      // .then(await AsyncStorage.setItem('@token', '')) // reset token
      .then(navigation.navigate('Welcome')) // go back to welcome screen whether or not request is authorised
      .catch((error) => {
        // console.error(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  getToken = async () => {
    try {
      const readId = await AsyncStorage.getItem('@id');
      const readToken = await AsyncStorage.getItem('@token');
      if (readId !== null && readToken !== null) {
        // alert("ID: " + readId + " Token: " + readToken);
        console.log('getName: ' + readToken);
        return readToken;
      }
    } catch (e) {
      console.log('Something broke...')
    }
  }

  getId = async () => {
    try {
      const readId = await AsyncStorage.getItem('@id');
      // const readToken = await AsyncStorage.getItem('@token')
      if (readId !== null) {
        // alert("ID: " + readId + " Token: " + readToken);
        console.log('getName: ' + readId);
        return readId;
      }
    } catch (e) {
      console.log('Something broke...');
    }
  }

  getData = async () => {
    const token = await this.getToken();
    const id = await this.getId();
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + id,
      {
        method: 'GET',
        headers: { 'X-Authorization': token },
      }) // need to code IS LOADING
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
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

  updateItem = async () => {
    const { origFirstName } = this.state;
    const { origLastName } = this.state;
    const { origEmail } = this.state;
    const { origPassword } = this.state;
    const { firstNameValue } = this.state;
    const { lastNameValue } = this.state;
    const { emailValue } = this.state;
    const { passwordValue } = this.state;
    const toSend = {};

    console.log(emailValue);

    if (firstNameValue !== origFirstName) {
      console.log(firstNameValue);
      toSend['first_name'] = firstNameValue;
    }
    if (lastNameValue !== origLastName) {
      console.log(lastNameValue);
      toSend['last_name'] = lastNameValue;
    }
    if (emailValue !== origEmail) {
      console.log(emailValue);
      toSend['email'] = (emailValue);
    }
    if (passwordValue !== origPassword) {
      console.log(passwordValue);
      toSend['password'] = (passwordValue);
    }

    console.log(toSend);

    const token = await this.getToken();
    const id = await this.getId();

    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Updated!', ToastAndroid.SHORT);
          this.getData();
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
        // console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  unsubscribe() {
    this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

<<<<<<< HEAD
  render() {
    // const { navigation } = this.props;
    const { origFirstName } = this.state;
    const { origLastName } = this.state;
    const { origEmail } = this.state;
    const { firstNameValue } = this.state;
    const { lastNameValue } = this.state;
    const { emailValue } = this.state;
    const { passwordValue } = this.state;
=======
    render() {

        const navigation = this.props.navigation;

        return(

            <View>
                <Text>User Account Details</Text>

                <View>
                    <TouchableOpacity
                        onPress={() => this.logout()}
                    >
                    <Text>Log out and go back to Welcome Screen</Text>
                    </TouchableOpacity>
                </View>

                <Text></Text>

                <View>
                    <Text>First name: {this.state.orig_first_name}</Text>
                    <Text>Last name: {this.state.orig_last_name}</Text>
                    <Text>Email: {this.state.orig_email}</Text>
                    <Text></Text>
                </View>

                <Text></Text>

                    <Text>Update User information</Text>

                    <TextInput
                        placeholder="Enter new first name..."
                        onChangeText={(first_name) => this.setState({first_name})}
                        value={this.state.first_name}
                    />
                    <TextInput
                        placeholder="Enter new last name..."
                        onChangeText={(last_name) => this.setState({last_name})}
                        value={this.state.last_name}
                    />
                    <TextInput
                        placeholder="Enter new email..."
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                    />
                    <TextInput
                        placeholder="Enter new password..."
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        secureTextEntry
                    />
                    <Button
                        title="Update"
                        onPress={() => this.updateItem()}
                    />

            </View>

            

        );
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2

    if(this.state.isLoading) {
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

            <Button block onPress={() => this.updateItem()}>
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
    // popToTop: PropTypes.func.isRequired,
    // goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default UserAccount;
