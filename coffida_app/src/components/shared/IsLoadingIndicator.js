import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

class IsLoadingIndicator extends Component {
  render() {

    const styles = StyleSheet.create({
      flexContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      },
      viewOne: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      },
    });

    return (
      <View style={styles.flexContainer}>
        <View style={styles.viewOne}>
        <ActivityIndicator size="large" color="#000080" />
        </View>
      </View>
    );
  }
}

export default IsLoadingIndicator;
