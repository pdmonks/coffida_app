import React, { Component } from 'react';
import { View, StyleSheet, ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import { postRequest } from '../../api/ApiRequests';
import { checkUserLogin } from '../../utilityFunctions/UtilityFunctions';
import { ButtonBlock } from '../shared/Buttons';
import { responseStatusMessage } from '../../api/ApiStatus';

// screen to allow users to add a photo to a review
class ReviewPhoto extends Component {
  // check information entered into new user account form
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

  // save photo on device and call function to upload to server
  takePhoto = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri); // device URI
      this.sendToServer(data);
    }
  }

  // create URI for image post request
  sendToServer = async (bodyData) => {
    const { locationId, reviewId } = this.props.route.params;
    const pathStr = 'location/' + locationId + '/review/' + reviewId + '/photo';
    const contentType = 'image/jpeg';
    this.postPhoto(pathStr, contentType, bodyData);
  }

  // post request for new image
  postPhoto = async (path, type, data) => {
    const { navigation } = this.props;
    return postRequest(path, type, data)
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Photo added', ToastAndroid.SHORT);
          // navigation.goBack();
          // navigation.navigate('ReviewUpdate');
          // const loc = 'ReviewUpdate';
          const loc = this.props.route.params.returnToPage;
          const par = this.props.route.params.pageParams;
          navigation.navigate(loc, par);
        } else if (response.status === 401) {
          navigation.navigate('Login');
          throw 'Unauthorised request';
        } else {
          throw responseStatusMessage(response.status);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
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
  route: PropTypes.object.isRequired,
};

export default ReviewPhoto;
