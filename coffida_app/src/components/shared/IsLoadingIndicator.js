import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { commonStyles } from '../../styles/CommonStyles';

// shared component for loading indicator on all required screens

class IsLoadingIndicator extends Component {
  render() {

    return (
      <View style={commonStyles.background}>
        <View>
        <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    );
  }
}

export default IsLoadingIndicator;
