import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import SnoozeButton from '../../components/SnoozeButton';
import AnswerButton from '../../components/AnswerButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Voximplant} from 'react-native-voximplant';
import Screens from '../../appNavigation/Screens';
import Images from '../../constants/Images';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';

const IncomingCallScreen = () => {
  const [caller, setCaller] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const {call} = route.params;

  useEffect(() => {
    setCaller(call.getEndpoints()[0].displayName);
    call.on(Voximplant.CallEvents.Disconnected, callEvent => {
      navigation.navigate(Screens.CONTACTS_SCREEN);
    });

    return () => {
      call.off(Voximplant.CallEvents.Disconnected);
    };
  }, []);

  const onDecline = () => {
    call.decline();
  };
  const onAccept = () => {
    navigation.navigate(Screens.CALLING_SCREEN, {
      call,
      isIncomingCall: true,
      caller,
    });
  };
  return (
    <ImageBackground
      source={Images.incomingCallBackground}
      resizeMode="cover"
      style={styles.screen}>
      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{caller}</Text>
        <Text style={styles.phoneNumber}>CallApp Video...</Text>
      </View>
      <View style={styles.callActions}>
        <View style={styles.buttonContainer}>
          <SnoozeButton iconName="alarm" title="Remind Me" />
          <SnoozeButton iconName="message" title="Message" />
        </View>
        <View style={styles.buttonContainer}>
          <AnswerButton
            onPress={onDecline}
            iconName="close"
            title="Decline"
            color={Colors.orangeRed}
          />
          <AnswerButton
            onPress={onAccept}
            iconName="check"
            title="Accept"
            color={Colors.blue}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default IncomingCallScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  cameraPreview: {
    alignItems: 'center',
    marginTop: Spacing.space_40,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: Spacing.space_10,
    color: 'white',
  },
  phoneNumber: {
    color: Colors.white,
    opacity: 0.7,
    fontSize: 18,
  },
  callActions: {
    marginTop: 'auto',
    marginBottom: Spacing.space_60,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.space_50,
    marginBottom: Spacing.space_40,
  },
});
