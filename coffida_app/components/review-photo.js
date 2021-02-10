import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';

class ReviewPhoto extends Component {
  sendToServer = async (data) => {
    console.log(data.uri);
    const token = await AsyncStorage.getItem('@token');
    const locId = await AsyncStorage.getItem('@reviewLocId');
    const revId = await AsyncStorage.getItem('@reviewRevId');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + locId + '/review/' + revId + '/photo',
    {
      method: 'POST',
      headers: {
        "Content-Type": "image/jpeg",
        "X-Authorization": token,
      },
      body: data,
    })
    .then((response) => {
      //Alert.alert(response.status);
      console.log('photo taken');
    })
    .catch((error) => {
      console.error(error);
    });
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);

      console.log(data.uri);        // saved on the device
      this.sendToServer(data);
    }
  }

  render() {
    return (
      <View style={styles.canvas}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
        />
        <Button title="Take Photo" onPress={() => this.takePicture()} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default ReviewPhoto;
