import React, {Component} from 'react';
import {ScrollView, Text, TextInput, View, TouchableOpacity, Button} from 'react-native';

class NewAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        };
    }

    createAccount() {
        alert(this.state.first_name + " " + this.state.last_name + " " + this.state.email + " " + this.state.password);
        let to_send = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        };
        return fetch('http://10.0.2.2:3333/api/1.0.0/user',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(to_send)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            alert("Account created with ID: " + responseJson.id + " !");
        })
        .then(this.props.navigation.goBack())   // back to log in screen
        .catch((error) => {
            console.error(error);
        });
    }

    render() {

        const navigation = this.props.navigation;

        return(

            <View>
                <Text>New Account Screen</Text>

                <View>
                    <TouchableOpacity
                        onPress={() => navigation.popToTop()}
                    >
                    <Text>Back to Welcome Screen</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <TextInput placeholder="First name..." onChangeText={(first_name) => this.setState({first_name})} value={this.state.first_name}/>
                    <TextInput placeholder="Last name..." onChangeText={(last_name) => this.setState({last_name})} value={this.state.last_name}/>
                    <TextInput placeholder="Email address..." onChangeText={(email) => this.setState({email})} value={this.state.email}/>
                    <TextInput placeholder="Password..." onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry/>
                    <Button title="Add" onPress={this.createAccount.bind(this)} />
                </ScrollView>

            </View>

            

        );

    }

}

export default NewAccount;