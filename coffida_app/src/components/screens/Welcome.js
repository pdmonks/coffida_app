import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Icon, H1 } from 'native-base';
import PropTypes from 'prop-types';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import { ButtonBlock } from '../shared/Buttons';

class Welcome extends Component {
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    console.log('** Welcome Screen **');
    if (!await checkUserLogin(this.props)) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('NavigatorTab');
    }
  }

  render() {
    const styles = StyleSheet.create({
      flexContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      viewOne: {
        flex: 1,
        justifyContent: 'flex-end',
      },
      viewTwo: {
        flex: 1,
      },
    });

    return (

      <View style={styles.flexContainer}>

        <View style={styles.viewOne}>
          <Icon name="cafe" style={{ fontSize: 75 }} />
        </View>

        <View style={styles.viewTwo}>
          <H1>Welcome to CoffiDa</H1>
          <Text>{' '}</Text>
          <ButtonBlock buttonFunction={() => this.checkLoggedIn()} buttonText="Enter" />
        </View>

      </View>
    );
  }
}

Welcome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default Welcome;
