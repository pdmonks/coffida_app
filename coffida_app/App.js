import 'react-native-gesture-handler';

import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import WelcomeScreen from './components/welcome-screen';
import Login from './components/login-screen';
import NewAccount from './components/new-account';
//import HomeScreen from './components/home-screen';
import Home from './components/home.js';
//import UserAccount from './components/user-account';
import Location from './components/location';

const Stack = createStackNavigator();

class App extends Component {

  render() {

    return (

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
          <Stack.Screen name="NewAccount" component={NewAccount} options={{headerShown: false}}/>
          <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
          <Stack.Screen name="Location" component={Location} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>

    );

  }

}


export default App;

