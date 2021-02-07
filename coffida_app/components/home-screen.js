import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

class Home extends Component {

    render() {

        const navigation = this.props.navigation;

        return(

            <View>
                
                <Text>CoffiDa Home Screen</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Welcome')}
                >
                    <Text >Temporary back to Welcome Screen</Text>
                </TouchableOpacity>

            </View>

        );

    }

}

export default Home;