import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container, Content, Button, Text, Icon, H1,
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Welcome extends Component {
  /* constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  } */

  /* componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  } */

  /* componentWillUnmount() {
    this.unsubscribe();
  } */

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@token');
    const { navigation } = this.props;
    console.log('Token: ' + value);
    if (value == null) {
      navigation.navigate('Login');
      // this.navigation.navigate('Login');
    } else {
      navigation.navigate('HomeNav');
      // this.navigation.navigate('HomeNav');
    }
  }

  /* unsubscribe() {
    this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  } */

  render() {
    const styles = StyleSheet.create({
      flexContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      viewOne: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
      },
      viewTwo: {
        flex: 0,
      },
    });

    return (
      <Container style={styles.flexContainer}>

        <View style={styles.viewOne}>
          <Content padder>
            <Icon name="cafe" style={{ fontSize: 100 }} />
            <H1>Welcome to CoffiDa</H1>
            <Button block onPress={() => this.checkLoggedIn()}>
              <Text>Enter</Text>
            </Button>
          </Content>
        </View>

      </Container>

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
