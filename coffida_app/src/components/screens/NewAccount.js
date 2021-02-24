import React, { Component } from 'react';
import {
  ScrollView, ToastAndroid, StyleSheet, View,
} from 'react-native';
import { Text, H1 } from 'native-base';
import PropTypes from 'prop-types';
import { postRequest } from '../../api/ApiRequests';
import FormUser from '../shared/FormUser';
import { ButtonLight } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { responseStatusMessage } from '../../api/ApiStatus';
import { validEmailFormat } from '../../utilityFunctions/UtilityFunctions';

// screen to allow new users to create an account
class NewAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstNameValue: '',
      lastNameValue: '',
      emailValue: '',
      passwordValue: '',
      passwordCheckValue: '',
    };
  }

  // check information entered into new user account form
  createAccountCheck = () => {
    const { firstNameValue } = this.state;
    const { lastNameValue } = this.state;
    const { emailValue } = this.state;
    const { passwordValue } = this.state;
    const { passwordCheckValue } = this.state;
    if (firstNameValue.trim().length > 0
      && lastNameValue.trim().length > 0
      && emailValue.trim().length > 0
      && passwordValue.trim().length >= 8
      && passwordCheckValue.trim().length >= 8) {
      if (validEmailFormat(emailValue)) {
        if (passwordValue === passwordCheckValue) {
          this.createAccount(firstNameValue, lastNameValue, emailValue, passwordValue);
        } else {
          ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show('Not a valid email address', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Please complete all information', ToastAndroid.SHORT);
    }
  }

  // create URI for new account post request
  createAccount = async (firstNameValue, lastNameValue, emailValue, passwordValue) => {
    const pathStr = 'user';
    const contentType = 'application/json';
    const bodyDataStr = {
      first_name: firstNameValue,
      last_name: lastNameValue,
      email: emailValue,
      password: passwordValue,
    };
    const bodyData = JSON.stringify(bodyDataStr);
    this.postAccount(pathStr, contentType, bodyData);
  }

  // post request for new account creation
  postAccount = async (path, type, data) => {
    const { navigation } = this.props;
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status !== 201) {
          if (response.status === 400) {
            throw 'Invalid details entered, please try again';
          } else {
            throw responseStatusMessage(response.status);
          }
        } else {
          return response.json();
        }
      })
      .then((responseJson) => {
        ToastAndroid.show('Account created!', ToastAndroid.SHORT);
        navigation.goBack();
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  render() {
    const { navigation } = this.props;
    const {
      firstNameValue, lastNameValue, emailValue, passwordValue, passwordCheckValue,
    } = this.state;

    const styles = StyleSheet.create({
      viewTitle: {
        flex: 1,
        justifyContent: 'center',
      },
      viewForm: {
        flex: 9,
        alignSelf: 'stretch',
      },
    });

    return (

      <View style={commonStyles.background}>

        <View style={styles.viewTitle}>
          <H1>Register Your Account</H1>
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
              buttonPress={() => this.createAccountCheck()}
              buttonLabel="Submit"
            />
            <Text>{''}</Text>
            <ButtonLight buttonFunction={() => navigation.popToTop()} buttonText="Cancel" />
          </ScrollView>
        </View>

      </View>

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
