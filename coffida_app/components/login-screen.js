import React, {Component} from 'react';
import {Text, TextInput, View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component {

  constructor(props) {
    // inherit properties of Component superclass
    super(props);

    // create state fields for email and password
    this.state = {
        email: "",
        password: "",
        //id: "",
        //token: ""
    }
  }

  // handle email input
  handleEmail = (email) => {
      this.setState({email: email});
  }

  // handle password input
  handlePassword = (password) => {
      this.setState({password: password});
  }

  // handles login attempt
  login = () => {
    if(this.state.email.trim().length > 0 && this.state.password.trim().length > 0) {
      let to_send = {
        email: this.state.email,
        password: this.state.password
      };
      return fetch('http://10.0.2.2:3333/api/1.0.0/user/login',
      {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(to_send)
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //alert("Logged in with ID: " + responseJson.id + " and session token: " + responseJson.token);
        //this.setState({
        //  id: responseJson.id,
        //  token: responseJson.token
        //});
        //alert("ID: " + this.state.id + "Token: " + this.state.token);
        //this.saveName(this.state.id, this.state.token)
        this.saveName(responseJson.id, responseJson.token)
      })
      .then(this.props.navigation.navigate('Home'))
      .catch((error) => {
          console.error(error);
      });
    } else {
        alert("Please enter email and password");
    }
  }

  saveName = async (id, token) => {
    try {
        //alert(id + " " + token)
        await AsyncStorage.setItem('@id', id.toString())
        await AsyncStorage.setItem('@token', token)
        //alert(this.state.token)
        //ToastAndroid.show("ID and token saved!", ToastAndroid.SHORT);
        this.getName()
      } catch (e) {
        console.log("Something broke...");
        console.log(e);
      }
  }

  getName = async () => {
    try {
        const idRead = await AsyncStorage.getItem('@id')
        const tokenRead = await AsyncStorage.getItem('@token')
        //if(value !== null) {
            alert("ID: " + idRead + " Token: " + tokenRead + " final answer")
        //}
      } catch (e) {
        console.log("Something broke...")
      }
  }
  
  render() {

    const navigation = this.props.navigation;

    return(

      <View>

        <Text style={styles.title}>Login</Text>

        <View style={StyleSheet.formItem}>
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
                placeholder="Enter email address..."
                style={styles.formInput}
                onChangeText={this.handleEmail}
                value={this.state.email}
            />
        </View>

        <View style={StyleSheet.formItem}>
            <Text style={styles.formLabel}>Password:</Text>
            <TextInput
                placeholder="Enter password..."
                style={styles.formInput}
                secureTextEntry
                onChangeText={this.handlePassword}
                value={this.state.password}
            />
        </View>

        <View style={styles.formItem}>
            <TouchableOpacity
                style={styles.formTouch}
                onPress={() => this.login()}
            >
                <Text style={styles.formTouchText}>Log in</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.formItem}>
            <TouchableOpacity
                style={styles.formTouch}
                onPress={() => navigation.navigate('NewAccount')}
            >
                <Text style={styles.formTouchText}>Create New Account</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.formItem}>
            <TouchableOpacity
                style={styles.formTouch}
                onPress={() => navigation.popToTop()}
            >
                <Text style={styles.formTouchText}>Back to Welcome Screen</Text>
            </TouchableOpacity>
        </View>

      </View>

    );  

  }

}

const styles = StyleSheet.create({
  title: {
    color:'steelblue',
    backgroundColor:'lightblue',
    padding:10,
    fontSize:25
  },
  formItem: {
    padding:20
  },
  formLabel: {
    fontSize:15,
    color:'steelblue'
  },
  formInput: {
    borderWidth:1,
    borderColor: 'lightblue',
    borderRadius:5
  },
  formTouch: {
    backgroundColor:'lightblue',
    padding:10,
    alignItems:'center'
  },
  formTouchText: {
    fontSize:20,
    fontWeight:'bold',
    color:'steelblue'
  }
})

export default Login;