import React, { Component } from 'react';
import { View } from 'native-base';
import StarRating from 'react-native-star-rating';

// shared component for all star ratings which are non-editable

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
