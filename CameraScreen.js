import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import styles from './CameraScreenStyles';
import { Ionicons } from '@expo/vector-icons';

export default class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    faces: [],
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  toggleCamera = () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  handleFaceDetection = e => {
    const { faces } = e;
    console.log(faces);
    if (faces.length > 0) {
      this.setState({ faces });
    } else if (faces.length === 0 && this.state.faces.length > 0) {
      this.setState({ faces: [] });
    }
  };

  _colorFromValue = value => {
    if (value < 0.4) {
      return 'rgba(0, 0, 0, 0.2)';
    } else if (value < 0.75) {
      return 'rgba(255, 0, 0, 0.2)';
    } else if (value < 0.95) {
      return 'rgba(144, 238, 144, 0.2)';
    } else {
      return 'rgba(255, 215, 0, 0.2)';
    }
  };

  render() {
    const { hasCameraPermission, faces } = this.state;
    if (hasCameraPermission === null) {
      return (
        <View>
          <Text>Loading camera ?</Text>
        </View>
      );
    } else if (hasCameraPermission === false) {
      return <Text>No access to the camera</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.cameraWrapper}
            type={this.state.type}
            faceDetectionMode={Camera.Constants.FaceDetection.Mode.accurate}
            faceDetectionClassifications={
              Camera.Constants.FaceDetection.Classifications.all
            }
            autoFocus={Camera.Constants.AutoFocus.on}
            onFacesDetected={this.handleFaceDetection}
          >
            <View style={styles.contentWrapper}>
              {faces &&
                faces.map(face => (
                  <View
                    key={face.faceID}
                    style={{
                      backgroundColor: this._colorFromValue(
                        face.smilingProbability,
                      ),
                      position: 'absolute',
                      top: face.bounds.origin.y,
                      left: face.bounds.origin.x,
                      width: face.bounds.size.width,
                      height: face.bounds.size.height,
                    }}
                  >
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 25,
                          color:
                            face.smilingProbability < 0.75 ? 'white' : 'black',
                        }}
                      >
                        {Number.parseFloat(
                          face.smilingProbability * 100,
                        ).toFixed(2)}
                        %
                      </Text>
                    </View>
                  </View>
                ))}
              <TouchableOpacity
                style={styles.toggleCameraWrapper}
                onPress={() => {
                  this.toggleCamera();
                }}
              >
                <Ionicons name="ios-reverse-camera" size={25} color="white" />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
