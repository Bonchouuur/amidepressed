import { StyleSheet } from 'react-native';

export default (styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraWrapper: {
    flex: 1,
  },
  toggleCameraWrapper: {
    // Bottom button
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'lightgreen',
  },
  contentWrapper: {
    // Main overlay
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
}));
