import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, H1, H3 } from 'native-base';
import PropTypes from 'prop-types';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import { ButtonBlock } from '../shared/Buttons';
import { commonStyles } from '../../styles/CommonStyles';

class Home extends Component {
  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
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
    });
  }

  render() {
    const { navigation } = this.props;

    const styles = StyleSheet.create({
      viewIcon: {
        flex: 1,
        justifyContent: 'flex-end',
      },
      viewContent: {
        flex: 1,
        flexDirection: 'row',
      },
    });

    return (

      <View style={commonStyles.background}>

        <View style={styles.viewIcon}>
          <Icon name="cafe" style={{ fontSize: 75 }} />
        </View>

        <View style={styles.viewContent}>
          <H1>CoffiDa</H1>
        </View>

        <View style={styles.viewContent}>
          <H3>discover great coffee</H3>
        </View>

        <View style={styles.viewContent}>
          <ButtonBlock buttonFunction={() => navigation.navigate('Welcome')} buttonText="Back Welcome Screen (temp)" />
        </View>

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
