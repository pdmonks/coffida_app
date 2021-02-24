import 'react-native-gesture-handler';

import React, { PureComponent } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import UserAccount from '../components/screens/UserAccount';
import Reviews from '../components/screens/Reviews';
import LocationsFavourite from '../components/screens/LocationsFavourite';

const Drawer = createDrawerNavigator();

// drawer navigator showing all pages in the user information section

class NavigatorDrawer extends PureComponent {
  render() {
    return (

      <Drawer.Navigator>
        <Drawer.Screen name="Favourite Locations" component={LocationsFavourite} options={{ headerShown: true }} />
        <Drawer.Screen name="My Reviews" component={Reviews} options={{ headerShown: true }} />
        <Drawer.Screen name="My Details" component={UserAccount} options={{ headerShown: true }} />
      </Drawer.Navigator>

    );
  }
}

export default NavigatorDrawer;
