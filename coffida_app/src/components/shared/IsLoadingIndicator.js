import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { commonStyles } from '../../styles/CommonStyles';

class IsLoadingIndicator extends Component {
  render() {

    return (
      <View style={commonStyles.backgroundCentered}>
        <View>
        <ActivityIndicator size="large" color="#ff0000" />
        </View>
      </View>
    );
  }
}

export default IsLoadingIndicator;
