import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

class LocationsScreen extends Component {

    render() {

        const navigation = this.props.navigation;

        return(

            <View>
                <Text>Locations List</Text>

                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Location')}
                    >
                    <Text>Example Location</Text>
                    </TouchableOpacity>
                </View>

            </View>

            

        );

    }

}

export default LocationsScreen;