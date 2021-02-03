import React, {Component} from 'react';
import {Text, TextInput, Button, View, TouchableOpacity, ScrollView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orig_first_name: '',
            orig_last_name: '',
            orig_email: '',
            orig_password: '',
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        };
    }

    // handles logout attempt
    logout = async () => {
        const token = await this.getToken();
        console.log("logout: " + token);
        return fetch('http://10.0.2.2:3333/api/1.0.0/user/logout',
        {
            method: 'POST',
            headers: {'X-Authorization': token}
        })
        .then((response) => {
            alert("Logged out: " + response.status);
        })
        .then(this.props.navigation.navigate('Welcome'))
        .catch((error) => {
            console.error(error);
        });
    }

    getToken = async () => {
        try {
            const readId = await AsyncStorage.getItem('@id')
            const readToken = await AsyncStorage.getItem('@token')
            if(readId !== null && readToken !== null) {
                //alert("ID: " + readId + " Token: " + readToken);
                console.log("getName: " + readToken);
                return readToken
            }
        } catch (e) {
            console.log("Something broke...")
        }
    }

    getId = async () => {
        try {
            const readId = await AsyncStorage.getItem('@id')
            //const readToken = await AsyncStorage.getItem('@token')
            if(readId !== null) {
                //alert("ID: " + readId + " Token: " + readToken);
                console.log("getName: " + readId);
                return readId
            }
        } catch (e) {
            console.log("Something broke...")
        }
    }

    getData = async () => {
        const token  = await this.getToken();
        const id = await this.getId();
        return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + id,
            {
                method: 'GET',
                headers: {'X-Authorization': token}
            }) // need to code this
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              //isLoading: false,
              orig_first_name: responseJson.first_name,
              orig_last_name: responseJson.last_name,
              orig_email: responseJson.email,
              orig_password: responseJson.password,
              first_name: responseJson.first_name,
              last_name: responseJson.last_name,
              email: responseJson.email,
              password: responseJson.password,
            })
            //, alert(responseJson.item_name + " : " + this.state.orig_item_name);
          })
          .catch((error) => {
            console.log(error);
          });
      }

    updateItem = async () => {
        let to_send = {};

        console.log(this.state.email);

        if(this.state.first_name != this.state.orig_first_name) {
            console.log(this.state.first_name);
            to_send['first_name'] = this.state.first_name;
        }
        if(this.state.last_name != this.state.orig_last_name) {
            console.log(this.state.last_name);
            to_send['last_name'] = this.state.last_name;
        }
        if(this.state.email != this.state.orig_email) {
            console.log(this.state.email);
            to_send['email'] = (this.state.email);
        }
        if(this.state.password != this.state.orig_password) {
            console.log(this.state.password);
            to_send['password'] = (this.state.password);
        }

        console.log(to_send);

        const token = await this.getToken();
        const id = await this.getId();

        return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
            Alert.alert("Item updated");
            this.getData();
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
        this.getData();
    }

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

    }

}

export default UserAccount;