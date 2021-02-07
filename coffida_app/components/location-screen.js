import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

class Location extends Component {

    render() {

        const navigation = this.props.navigation;

        return(

            <View>
                <Text>Location</Text>

                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ReviewCreate')}
                    >
                    <Text>Create a new review</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ReviewUpdate')}
                    >
                    <Text>Update an existing review</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ReviewPhoto')}
                    >
                    <Text>Take a photo</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                    <Text>Back to Locations List</Text>
                    </TouchableOpacity>
                </View>

            </View>

            

        );

    }

}

export default Location;
