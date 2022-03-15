import {StyleSheet, Pressable, View} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';

const CallButtons = ({
  onHangup,
  onToggleCamera,
  onToggleMicrophone,
  isMicOn,
  isCameraOn,
}) => {
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  const onSwitchCamera = () => {
    setIsFrontCamera(isFrontCamera => !isFrontCamera);
  };

  return (
    <View style={styles.iconsContainer}>
      <Pressable style={styles.iconButton} onPress={onSwitchCamera}>
        <Ionicons name="camera-reverse" size={30} color={Colors.white} />
      </Pressable>
      <Pressable style={styles.iconButton} onPress={onToggleCamera}>
        <MaterialCommunityIcon
          name={isCameraOn ? 'camera' : 'camera-off'}
          size={30}
          color={isCameraOn ? Colors.white : Colors.orangeRed}
        />
      </Pressable>
      <Pressable style={styles.iconButton} onPress={onToggleMicrophone}>
        <MaterialCommunityIcon
          name={isMicOn ? 'microphone' : 'microphone-off'}
          size={30}
          color={isMicOn ? Colors.white : Colors.orangeRed}
        />
      </Pressable>
      <Pressable
        style={[styles.iconButton, {backgroundColor: Colors.red}]}
        onPress={onHangup}>
        <MaterialCommunityIcon
          name="phone-hangup"
          size={30}
          color={Colors.white}
        />
      </Pressable>
    </View>
  );
};

export default CallButtons;

const styles = StyleSheet.create({
  iconsContainer: {
    marginTop: 'auto',
    backgroundColor: Colors.darkGray,
    padding: Spacing.space_10,
    paddingVertical: Spacing.space_20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    backgroundColor: Colors.gray,
    borderRadius: 50,
    padding: Spacing.space_15,
  },
});
