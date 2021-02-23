import React, { Component } from 'react';
import { ToastAndroid, StyleSheet } from 'react-native';
import { Text, H1, View } from 'native-base';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { getRequest, patchRequest, postRequest } from '../../api/ApiRequests';
import { checkUserLogin, validEmailFormat } from '../../utilityFunctions/UtilityFunctions';
import { getAsyncItem, setAsyncItem } from '../../asyncStorage/AsyncUtilities';
import IsLoadingIndicator from '../shared/IsLoadingIndicator';
import FormUser from '../shared/FormUser';
import { ButtonBlock } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { responseStatusMessage } from '../../api/ApiStatus';

// screen to allow user to update account information or logout
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
      passwordCheckValue: '',
    };
  }

  // page setup; check user is logged in and reload page information
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

  // get request for user information and state setting
  getUser = async () => {
    const { navigation } = this.props;
    const userId = await getAsyncItem('@id');
    const path = 'user/' + userId;
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
          passwordCheckValue: '',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // check update information entered to construct patch request URI
  updateUser = async () => {
    const userId = await getAsyncItem('@id');
    const pathStr = 'user/' + userId;
    const contentType = 'application/json';
    const {
      origFirstName,
      origLastName,
      origEmail,
      origPassword,
      firstNameValue,
      lastNameValue,
      emailValue,
      passwordValue,
      passwordCheckValue,
    } = this.state;
    const bodyDataStr = {};
    let updateRequired = false;

    if (firstNameValue !== origFirstName
      && firstNameValue.trim().length > 0) {
      bodyDataStr['first_name'] = firstNameValue;
      updateRequired = true;
    }
    if (lastNameValue !== origLastName
      && lastNameValue.trim().length > 0) {
      bodyDataStr['last_name'] = lastNameValue;
      updateRequired = true;
    }
    if (emailValue !== origEmail
      && emailValue.trim().length > 0) {
      if (validEmailFormat(emailValue)) {
        bodyDataStr['email'] = (emailValue);
        updateRequired = true;
      } else {
        ToastAndroid.show('Not a valid email address', ToastAndroid.SHORT);
      }
    }
    if (passwordValue !== origPassword
      && passwordValue.trim().length > 0) {
      if (passwordValue === passwordCheckValue) {
        bodyDataStr['password'] = (passwordValue);
        updateRequired = true;
      } else {
        ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      }
    }
    if (updateRequired) {
      const bodyData = JSON.stringify(bodyDataStr);
      this.patchUser(pathStr, contentType, bodyData);
    }
  }

  // patch request for user account information update
  patchUser = async (path, type, data) => {
    const { navigation } = this.props;
    return patchRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Account updated!', ToastAndroid.SHORT);
          this.getUser();
        } else if (response.status === 401) {
          navigation.navigate('Login');
          throw 'Unauthorised request';
        } else {
          throw responseStatusMessage(response.status);
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  // construct logout post request URI
  logout = async () => {
    const pathStr = 'user/logout';
    const contentType = null;
    const bodyData = null;
    this.postLogout(pathStr, contentType, bodyData);
  }

  // post request for user logout
  postLogout = async (path, type, data) => {
    const { navigation } = this.props;
    return postRequest(path, type, data)
      .then(async (response) => {
        if (response.status === 200) {
          ToastAndroid.show('Logged out', ToastAndroid.SHORT);
          await setAsyncItem('@token', ''); // reset token for next login
        } else if (response.status === 401) {
          navigation.navigate('Login');
          throw 'Unauthorised request';
        } else {
          throw responseStatusMessage(response.status);
        }
      })
      .then(navigation.navigate('Welcome')) // go back to welcome screen whether or not request is authorised
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  // unsubscribe function for page setup functions above
  unsubscribe() {
    const { navigation } = this.props;
    navigation.addListener('focus', () => {
    });
  }

  render() {
    const {
      isLoading,
      firstNameValue,
      lastNameValue,
      emailValue,
      passwordValue,
      passwordCheckValue,
    } = this.state;

    const styles = StyleSheet.create({
      viewTitle: {
        flex: 2,
      },
      viewForm: {
        flex: 15,
        alignSelf: 'stretch',
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
          <H1>Update My Account Details</H1>
        </View>

        <View style={styles.viewForm}>
          <ScrollView>
            <FormUser
              onChangeTextFirstName={(firstNameValue) => this.setState({ firstNameValue })}
              valueFirstName={firstNameValue}
              onChangeTextLastName={(lastNameValue) => this.setState({ lastNameValue })}
              valueLastName={lastNameValue}
              onChangeTextEmail={(emailValue) => this.setState({ emailValue })}
              valueEmail={emailValue}
              onChangeTextPassword={(passwordValue) => this.setState({ passwordValue })}
              valuePassword={passwordValue}
              onChangeTextPasswordCheck={(passwordCheckValue) => this.setState({ passwordCheckValue })}
              valuePasswordCheck={passwordCheckValue}
              buttonPress={() => this.updateUser()}
              buttonLabel="Update"
            />
            <Text />
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
