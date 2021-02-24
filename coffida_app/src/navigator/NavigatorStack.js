import 'react-native-gesture-handler';

import React, { PureComponent } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Welcome from '../components/screens/Welcome';
import Login from '../components/screens/Login';
import NewAccount from '../components/screens/NewAccount';
import NavigatorTab from './NavigatorTab';
import Location from '../components/screens/Location';
import ReviewCreate from '../components/screens/ReviewCreate';
import ReviewUpdate from '../components/screens/ReviewUpdate';
import ReviewPhoto from '../components/screens/ReviewPhoto';

const Stack = createStackNavigator();

// stack navigator showing all pages in the Coffida app stack

class NavigatorStack extends PureComponent {
  render() {
    return (

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="NewAccount" component={NewAccount} options={{ headerShown: false }} />
          <Stack.Screen name="NavigatorTab" component={NavigatorTab} options={{ headerShown: false }} />
          <Stack.Screen name="Location" component={Location} options={{ headerShown: true }} />
          <Stack.Screen name="ReviewCreate" component={ReviewCreate} options={{ headerShown: true }} />
          <Stack.Screen name="ReviewUpdate" component={ReviewUpdate} options={{ headerShown: true }} />
          <Stack.Screen name="ReviewPhoto" component={ReviewPhoto} options={{ headerShown: true }} />

        </Stack.Navigator>
      </NavigationContainer>

    );
  }
}

export default NavigatorStack;

// <Stack.Screen name="LocationNav" component={LocationNav} options={{ headerShown: false }} />
