import 'react-native-gesture-handler';
import React, { Component } from 'react';
// import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

<<<<<<< HEAD
import Home from './home-screen';
import Locations from './locations-screen';
import MyLocation from './mylocation-screen';
=======
import HomeScreen from './home-screen';
import LocationsScreen from './locations-screen';
import MyLocationScreen from './mylocation-screen'
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
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

<<<<<<< HEAD
          <Tab.Screen name="Home" component={Home}/>
          <Tab.Screen name="Locations" component={Locations}/>
          <Tab.Screen name="My Location" component={MyLocation}/>
=======
          <Tab.Screen name="Home" component={HomeScreen}/>
          <Tab.Screen name="Locations" component={LocationsScreen}/>
          <Tab.Screen name="My Location" component={MyLocationScreen}/>
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
          <Tab.Screen name="User Account" component={UserAccount}/>
        </Tab.Navigator>

    );

  }

}


export default HomeNav;
