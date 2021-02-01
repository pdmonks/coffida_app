import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

class WelcomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }

    render() {

        const navigation = this.props.navigation;

        return(

            <View>
                
                <Text>Welcome to CoffiDa</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text >Log into Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text >Temporary link to the home screen</Text>
                </TouchableOpacity>

            </View>

        );

    }

}

export default WelcomeScreen;