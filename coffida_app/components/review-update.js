import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

class ReviewUpdate extends Component {

    render() {

        const navigation = this.props.navigation;

        return(

            <View>
                <Text>Update a Review</Text>

                <View>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                    <Text>Back to Location</Text>
                    </TouchableOpacity>
                </View>

            </View>

            

        );

    }

}

export default ReviewUpdate;