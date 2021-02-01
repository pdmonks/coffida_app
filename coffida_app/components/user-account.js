import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

class UserAccount extends Component {

    render() {

        const navigation = this.props.navigation;

        return(

            <View>
                <Text>User Account Details</Text>

                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Welcome')}
                    >
                    <Text>Log out and go back to Welcome Screen</Text>
                    </TouchableOpacity>
                </View>

            </View>

            

        );

    }

}

export default UserAccount;