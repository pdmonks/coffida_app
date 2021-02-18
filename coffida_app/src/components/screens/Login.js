import React, { Component } from 'react';
import { ScrollView, ToastAndroid, StyleSheet, View } from 'react-native';
import {
  Form, Text, H1, Icon,
} from 'native-base';
import PropTypes from 'prop-types';
import { postRequest } from '../../api/ApiRequests';
import { setAsyncItem } from '../../asyncStorage/AsyncUtilities';
import FormItem from '../shared/FormItem';
import FormItemSecure from '../shared/FormItemSecure';
import { ButtonBlock, ButtonLight } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';
import { requestStatusMessage } from '../../api/ApiStatus';

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
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status !== 200) {
          if (response.status === 400) {
            throw 'Incorrect login details, please try again';
          } else {
            throw requestStatusMessage(response.status);
          }
        } else {
          return response.json();
        }
      })
      .then((responseJson) => {
        return this.saveUser(responseJson.id, responseJson.token);
      })
      .then((resp) => {
        if (resp === 1) {
          navigation.navigate('NavigatorTab'); // waits for async storage save before going to home screen
        }
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  saveUser = async (id, token) => {
    try {
      await setAsyncItem('@id', id.toString());
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

    const styles = StyleSheet.create({
      viewIcon: {
        flex: 25,
        justifyContent: 'flex-end',
      },
      viewTitle: {
        flex: 10,
      },
      viewForm: {
        flex: 75,
        alignSelf: 'stretch',
      },
    });

    return (
      <View style={commonStyles.background}>

        <View style={styles.viewIcon}>
          <Icon name="cafe" style={{ fontSize: 75 }} />
        </View>

        <View style={styles.viewTitle}>
          <H1>Login</H1>
        </View>

        <View style={styles.viewForm}>
          <ScrollView>
            <Form>
              <FormItem label="Email" placeholder="Email address" onChangeText={this.handleEmail} value={emailValue} />
              <FormItemSecure label="Password" placeholder="Password" onChangeText={this.handlePassword} value={passwordValue} />
            </Form>
            <Text>{' '}</Text>
            <ButtonBlock buttonFunction={() => this.handleLogin()} buttonText="Login" />
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <ButtonBlock buttonFunction={() => navigation.navigate('NewAccount')} buttonText="Register a new account" />
            <Text>{' '}</Text>
            <ButtonLight buttonFunction={() => navigation.popToTop()} buttonText="Cancel" />
            <Text>{' '}</Text>
          </ScrollView>
        </View>

      </View>

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
