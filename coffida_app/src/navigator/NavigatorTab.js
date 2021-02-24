import 'react-native-gesture-handler';
import React, { PureComponent } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../components/screens/Home';
import Locations from '../components/screens/Locations';
import MyLocation from '../components/screens/MyLocation';
import NavigatorDrawer from './NavigatorDrawer';

const Tab = createBottomTabNavigator();

// tab navigator showing all main routes in the Coffida app
// Coffee Shops - search for coffee shops and select individual shops to post reviews
// Coffee Now! - shows the nearest three coffee shops on the map
// My Info - shows user account information, favourite locations and posted reviews

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
            } else if (route.name === 'Coffee Now!') {
              iconName = focused ? 'earth' : 'earth-outline';
            } else if (route.name === 'My Info') {
              iconName = focused ? 'body' : 'body-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{ activeTintColor: 'tomato', inactiveTintColor: 'gray' }}
      >

        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Coffee Shops" component={Locations} />
        <Tab.Screen name="Coffee Now!" component={MyLocation} />
        <Tab.Screen name="My Info" component={NavigatorDrawer} />
      </Tab.Navigator>

    );
  }
}

export default HomeNav;
