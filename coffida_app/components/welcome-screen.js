import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container, Content, Button, Text, Icon, H1,
} from 'native-base';
import PropTypes from 'prop-types';
// import { getAsyncItem } from '../src/asyncStorage/AsyncUtilities';
import { checkUserLogin } from '../src/utilities/UtilityFunctions';

class Welcome extends Component {
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    /* const token = await getAsyncItem('@token');
    const { navigation } = this.props;
    if (token == null) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('HomeNav');
    } */
    console.log('** Welcome Screen **');
    if (!await checkUserLogin(this.props)) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('HomeNav');
    }
  }

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
