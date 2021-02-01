import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

class ReviewCreate extends Component {

    render() {

        const navigation = this.props.navigation;

        return(

            <View>
                <Text>Create a Review</Text>

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

export default ReviewCreate;