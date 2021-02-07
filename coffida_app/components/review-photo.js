import React, { Component } from 'react';
<<<<<<< HEAD
import { View, Button, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

class ReviewPhoto extends Component {
  /* sendToServer = (data) => {
=======
import { View, Button, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';

class ReviewPhoto extends Component{

  /*sendToServer = (data) => {
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
    console.log(data.uri);

    return fetch("http://10.0.2.2:3333/api/1.0.0/location/1/review/7/photo",
    {
      method: 'POST',
      headers: {
        "Content-Type": "image/jpeg",
        "X-Authorization": "3d5b5b4ccb6c52d085d282bdfdf49cf9"
      },
      body: data
    })
    .then((response) => {
      Alert.alert(response.status);
    })
    .catch((error) => {
      console.error(error);
    });
<<<<<<< HEAD
  } */

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);

      console.log(data.uri);        // saved on the device
      // this.sendToServer(data);
    }
  }

  render() {
=======
  }*/

  takePicture = async() => {
    if(this.camera){
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);

      console.log(data.uri);        // saved on the device
      //this.sendToServer(data); 
    }
  }

  render(){
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
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
<<<<<<< HEAD
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
=======
    canvas: {
      flex: 1
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
})

export default ReviewPhoto;
>>>>>>> ee5738b163d42583f9843e27f86e350d529cd6f2
