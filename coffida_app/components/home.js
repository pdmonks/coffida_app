import 'react-native-gesture-handler';
import React, { PureComponent } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './home-screen';
import Locations from './locations-screen';
import MyLocation from './mylocation-screen';
import Reviews from './reviews-screen';
import UserAccount from './user-account';

const Tab = createBottomTabNavigator();

class HomeNav extends PureComponent {
  render() {
    return (

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Coffee Shops') {
              iconName = focused ? 'cafe' : 'cafe-outline';
            } else if (route.name === 'My Location') {
              iconName = focused ? 'earth' : 'earth-outline';
            } else if (route.name === 'My Reviews') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            } else if (route.name === 'My Details') {
              iconName = focused ? 'body' : 'body-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{ activeTintColor: 'tomato', inactiveTintColor: 'gray' }}
      >

        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Coffee Shops" component={Locations} />
        <Tab.Screen name="My Location" component={MyLocation} />
        <Tab.Screen name="My Reviews" component={Reviews} />
        <Tab.Screen name="My Details" component={UserAccount} />
      </Tab.Navigator>

    );
  }
}

export default HomeNav;
