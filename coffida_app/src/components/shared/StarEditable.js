import React, { Component } from 'react';
import { View, Text } from 'native-base';
import StarRating from 'react-native-star-rating';

class StarEditable extends Component {
  render() {
    return (
      <View>
        <StarRating
          disabled={false}
          emptyStarColor={'gold'}
          fullStarColor={'gold'}
          maxStars={5}
          rating={parseInt(this.props.rating)}
          selectedStar={this.props.selectedStar}
          starSize={30}
        />
      </View>
    );
  }
}

export default StarEditable;
