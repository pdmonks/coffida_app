import React, { Component } from 'react';
import { View, Text } from 'native-base';
import StarRating from 'react-native-star-rating';

class StarFixed extends Component {
  render() {
    return (
      <View>
        <StarRating
          emptyStarColor={'gold'}
          fullStarColor={'gold'}
          maxStars={5}
          rating={this.props.rating}
          starSize={20}
        />
      </View>
    );
  }
}

export default StarFixed;
