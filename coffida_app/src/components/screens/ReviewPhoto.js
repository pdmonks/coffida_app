import React, { Component } from 'react';
import { View, StyleSheet, ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import { postRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import { getAsyncItem } from '../../asyncStorage/AsyncUtilities';
import { ButtonBlock } from '../shared/Buttons';

class ReviewPhoto extends Component {

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      console.log('** Review Photo Screen **');
      checkUserLogin(this.props);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  postPhoto = async (path, type, data) => {
    const { navigation } = this.props;
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Photo added', ToastAndroid.SHORT);
          navigation.navigate('ReviewUpdate');
        } else if (response.status === 400) {
          throw 'Bad request';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'Server error';
        }
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
    const locId = await getAsyncItem('@reviewLocId');
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
        <ButtonBlock buttonFunction={() => this.takePhoto()} buttonText="Take photo" />
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
