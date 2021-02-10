import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Welcome from './components/welcome-screen';
import Login from './components/login-screen';
import NewAccount from './components/new-account';
import HomeNav from './components/home';
import LocationNav from './components/location';
import ReviewUpdate from './components/review-update';
import ReviewPhoto from './components/review-photo';

const Stack = createStackNavigator();

class App extends Component {

  render() {

    return (

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="NewAccount" component={NewAccount} options={{ headerShown: false }} />
          <Stack.Screen name="HomeNav" component={HomeNav} options={{ headerShown: false }} />
          <Stack.Screen name="LocationNav" component={LocationNav} options={{ headerShown: false }} />
          <Stack.Screen name="ReviewUpdate" component={ReviewUpdate} options={{ headerShown: false }}/>
          <Stack.Screen name="ReviewPhoto" component={ReviewPhoto} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>

    );

  }

}

export default App;
