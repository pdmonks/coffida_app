import 'react-native-gesture-handler';

import React, {Component} from 'react';
//import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//import WelcomeScreen from './components/welcome-screen';
//import Login from './components/login-screen';
//import NewAccount from './components/new-account';
//import HomeScreen from './components/home-screen';
//import Home from './components/home.js';
//import UserAccount from './components/user-account';
import LocationScreen from './location-screen';
import ReviewCreate from './review-create';
import ReviewUpdate from './review-update';

const LocationStack = createStackNavigator();

class Location extends Component {

  render() {

    return (

        <LocationStack.Navigator>
          <LocationStack.Screen name="Location" component={LocationScreen} options={{headerShown: false}}/>
          <LocationStack.Screen name="ReviewCreate" component={ReviewCreate} options={{headerShown: false}}/>
          <LocationStack.Screen name="ReviewUpdate" component={ReviewUpdate} options={{headerShown: false}}/>
        </LocationStack.Navigator>

    );

  }

}


export default Location;