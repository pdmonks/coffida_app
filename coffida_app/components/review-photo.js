// import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Button, StyleSheet, ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import { postRequest } from '../src/api/ApiRequests';
import { checkUserLogin } from '../src/utilities/UtilityFunctions';
import { getAsyncItem } from '../src/asyncStorage/AsyncUtilities';

class ReviewPhoto extends Component {

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      // this.checkLoggedIn();
      console.log('** Review Photo Screen **');
      checkUserLogin(this.props);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  postPhoto = async (path, type, data) => {
    const { navigation } = this.props;
    // const token = await AsyncStorage.getItem('@token');
    return postRequest(path, type, data)
      .then((response) => {
        ToastAndroid.show('Photo added', ToastAndroid.SHORT);
        navigation.navigate('ReviewUpdate');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  takePhoto = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri); // saved on the device
      this.sendToServer(data);
    }
  }

  sendToServer = async (bodyData) => {
    // const locId = await AsyncStorage.getItem('@reviewLocId');
    const locId = await getAsyncItem('@reviewLocId');
    // const revId = await AsyncStorage.getItem('@reviewRevId');
    const revId = await getAsyncItem('@reviewRevId');
    const pathStr = 'location/' + locId + '/review/' + revId + '/photo';
    const contentType = 'image/jpeg';
    this.postPhoto(pathStr, contentType, bodyData);
  }

  render() {
    return (
      <View style={styles.canvas}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          captureAudio={false}
        />
        <Button title="Take Photo" onPress={() => this.takePhoto()} />
      </View>
    );
  }
}

ReviewPhoto.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

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
