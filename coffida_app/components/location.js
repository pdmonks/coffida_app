import 'react-native-gesture-handler';

import React, { PureComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Location from './location-screen';
import ReviewCreate from './review-create';
import ReviewUpdate from './review-update';       // moved
import ReviewPhoto from './review-photo';         // moved

const LocationStack = createStackNavigator();

class LocationNav extends PureComponent {
  render() {
    return (

      <LocationStack.Navigator>
        <LocationStack.Screen name="Location" component={Location} options={{ headerShown: true }} />
        <LocationStack.Screen name="ReviewCreate" component={ReviewCreate} options={{ headerShown: false }} />
        <LocationStack.Screen name="ReviewUpdate" component={ReviewUpdate} options={{ headerShown: false }} />
        <LocationStack.Screen name="ReviewPhoto" component={ReviewPhoto} options={{ headerShown: false }} />
      </LocationStack.Navigator>

    );
  }
}

export default LocationNav;
