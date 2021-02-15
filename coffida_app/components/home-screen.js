import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { checkUserLogin } from '../src/utilities/UtilityFunctions';

class Home extends Component {
  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      // this.checkLoggedIn();
      console.log('** Home Screen **');
      checkUserLogin(this.props);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribe() {
    const { navigation } = this.props;
    navigation.addListener('focus', () => {
      // this.checkLoggedIn();
    });
  }

  render() {
    const { navigation } = this.props;

    return (

      <View>

        <Text>CoffiDa Home Screen</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text>Temporary back to Welcome Screen</Text>
        </TouchableOpacity>

      </View>

    );
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default Home;
