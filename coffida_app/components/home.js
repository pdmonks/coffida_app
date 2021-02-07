import 'react-native-gesture-handler';
import React, { Component } from 'react';
// import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './home-screen';
import Locations from './locations-screen';
import MyLocation from './mylocation-screen';
import UserAccount from './user-account';

const Tab = createBottomTabNavigator();

class HomeNav extends Component {

  render() {

    return (

        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

              if(route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if(route.name === 'Locations') {
                iconName = focused ? 'cafe' : 'cafe-outline';
              } else if(route.name === 'My Location') {
                iconName = focused ? 'earth' : 'earth-outline';
              } else if(route.name === 'User Account') {
                iconName = focused ? 'body' : 'body-outline'
              }

              // you can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}

          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >

          <Tab.Screen name="Home" component={Home}/>
          <Tab.Screen name="Locations" component={Locations}/>
          <Tab.Screen name="My Location" component={MyLocation}/>
          <Tab.Screen name="User Account" component={UserAccount}/>
        </Tab.Navigator>

    );

  }

}


export default HomeNav;
