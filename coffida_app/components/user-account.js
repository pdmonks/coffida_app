import React, { Component } from 'react';
import { ToastAndroid, StyleSheet } from 'react-native';
import {
  Container, Content, Form, Text, Button, H1, View
} from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { getRequest, patchRequest, postRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilityFunctions/UtilityFunctions';
import { getAsyncItem, setAsyncItem } from '../src/asyncStorage/AsyncUtilities';
import IsLoadingIndicator from '../src/components/shared/IsLoadingIndicator';
import FormUser from '../src/components/shared/FormUser';
import { ButtonBlock } from '../src/components/shared/Buttons';

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
      console.log('** User Account Screen **');
      checkUserLogin(this.props);
      this.getUser();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // handles logout attempt
  logout = async () => {
    const pathStr = 'user/logout';
    const contentType = null;
    const bodyData = null;
    this.postLogout(pathStr, contentType, bodyData);
  }

  postLogout = async (path, type, data) => {
    const { navigation } = this.props;
    return postRequest(path, type, data)
      .then(async (response) => {
        if (response.status === 200) {
          ToastAndroid.show('Logged out: ' + response.status, ToastAndroid.SHORT);
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

  getUser = async () => {
    const userId = await getAsyncItem('@id');
    const path = 'user/' + userId;
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
    const { passwordCheckValue } = this.state;
    const bodyDataStr = {};
    let cleared = false;

    if (firstNameValue !== origFirstName
      && firstNameValue.trim().length > 0) {
      bodyDataStr['first_name'] = firstNameValue;
      cleared = true;
    }
    if (lastNameValue !== origLastName
      && lastNameValue.trim().length > 0) {
      bodyDataStr['last_name'] = lastNameValue;
      cleared = true;
    }
    if (emailValue !== origEmail
      && emailValue.trim().length > 0) {
      bodyDataStr['email'] = (emailValue);
      cleared = true;
    }
    if (passwordValue !== origPassword
      && passwordValue.trim().length > 0) {
      if (passwordValue === passwordCheckValue) {
        bodyDataStr['password'] = (passwordValue);
        cleared = true;
      } else {
        ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      }
    }
    if (cleared) {
      const bodyData = JSON.stringify(bodyDataStr);
      this.patchUser(pathStr, contentType, bodyData);
    }
  }

  patchUser = async (path, type, data) => {
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
    const { passwordCheckValue } = this.state;

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
        //justifyContent: 'space-around',
        alignSelf: 'stretch',
        backgroundColor: '#f5f5f5',
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
          <H1>Your Account details</H1>
        </View>

        <View style={styles.viewTwo}>
          <ScrollView>
            <FormUser
              onChangeTextFirstName={(firstNameValue) => this.setState({ firstNameValue })} valueFirstName={firstNameValue}
              onChangeTextLastName={(lastNameValue) => this.setState({ lastNameValue })} valueLastName={lastNameValue}
              onChangeTextEmail={(emailValue) => this.setState({ emailValue })} valueEmail={emailValue}
              onChangeTextPassword={(passwordValue) => this.setState({ passwordValue })} valuePassword={passwordValue}
              onChangeTextPasswordCheck={(passwordCheckValue) => this.setState({ passwordCheckValue })} valuePasswordCheck={passwordCheckValue}
              buttonPress={() => this.updateUser()}
              buttonLabel="Update"
            />
            <ButtonBlock buttonFunction={() => this.logout()} buttonText="Log out and go back to Welcome Screen" />
          </ScrollView>
        </View>

      </View>

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
