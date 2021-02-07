import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

class Locations extends Component {

    render() {

        const navigation = this.props.navigation;

        return(

            <View>
                <Text>Locations List</Text>

                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LocationNav')}
                    >
                    <Text>Example Location</Text>
                    </TouchableOpacity>
                </View>

            </View>

            

        );

    }

}

export default Locations;
