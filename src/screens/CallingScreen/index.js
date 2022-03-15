import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import CallButtons from '../../components/CallButtons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Voximplant} from 'react-native-voximplant';
import Screens from '../../appNavigation/Screens';
import usePermissions from '../../hooks/usePermissions';
import CallState from '../../constants/CallState';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';

const callSettings = {
  video: {
    sendVideo: true,
    receiveVideo: true,
  },
};

const CallingScreen = () => {
  const permissionGranted = usePermissions();
  const [callStatus, setCallStatus] = useState(CallState.INITIALIZING);
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const voximplant = Voximplant.getInstance();

  const navigation = useNavigation();
  const route = useRoute();
  const {user, call: incomingCall, isIncomingCall, caller} = route?.params;

  let call = useRef(incomingCall);
  const endpoint = useRef(null);

  useEffect(() => {
    if (!permissionGranted) {
      return;
    }

    const makeCall = async () => {
      call.current = await voximplant.call(user.user_name, callSettings);
      subscribeToCallEvents();
    };
    const answerCall = () => {
      subscribeToCallEvents();
      endpoint.current = call.current.getEndpoints()[0];
      subscribeToEndpointEvents();
      setCallStatus(CallState.CONNECTED);
      call.current.answer(callSettings);
    };

    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, callEvent => {
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStarted, callEvent => {
        setCallStatus(CallState.CALLING);
      });
      call.current.on(Voximplant.CallEvents.Connected, callEvent => {
        setCallStatus(CallState.CONNECTED);
      });
      call.current.on(Voximplant.CallEvents.Disconnected, callEvent => {
        setCallStatus(CallState.DISCONNECTED);
        navigation.navigate(Screens.CONTACTS_SCREEN);
      });
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        callEvent => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        },
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvents();
      });
    };

    const subscribeToEndpointEvents = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamRemoved,
        endpointEvent => {
          setRemoteVideoStreamId('');
        },
      );
    };

    const showError = reason => {
      Alert.alert('Call failed', `Reason: ${reason}`, [
        {
          text: 'Ok',
          onPress: () => navigation.navigate(Screens.CONTACTS_SCREEN),
        },
      ]);
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }
    return () => {
      call.current.off(Voximplant.CallEvents.Failed);
      call.current.off(Voximplant.CallEvents.Disconnected);
      call.current.off(Voximplant.CallEvents.Connected);
      call.current.off(Voximplant.CallEvents.ProgressToneStarted);
      call.current.off(Voximplant.CallEvents.EndpointAdded);
      call.current.off(Voximplant.CallEvents.LocalVideoStreamAdded);
      endpoint.current.off(Voximplant.CallEvents.RemoteVideoStreamAdded);
      endpoint.current.off(Voximplant.CallEvents.RemoteVideoStreamRemoved);
    };
  }, [permissionGranted]);

  useEffect(() => {
    call.current?.sendVideo(isCameraOn);
    call.current?.sendAudio(isMicOn);
  }, [isMicOn, isCameraOn]);

  const onBack = () => {
    navigation.pop();
  };

  const onHangup = () => {
    call.current.hangup();
  };

  const onToggleCamera = () => {
    setIsCameraOn(isCameraOn => !isCameraOn);
  };

  const onToggleMicrophone = () => {
    setIsMicOn(isMicOn => !isMicOn);
  };

  return (
    <View style={styles.page}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" color="white" size={30} />
      </TouchableOpacity>
      <Voximplant.VideoView
        style={styles.localVideo}
        videoStreamId={isCameraOn ? localVideoStreamId : ''}
      />
      <Voximplant.VideoView
        style={styles.remoteVideo}
        videoStreamId={remoteVideoStreamId}
      />
      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{caller || user?.user_display_name}</Text>
        <Text style={styles.phoneNumber}>{callStatus}</Text>
      </View>
      <CallButtons
        onHangup={onHangup}
        isCameraOn={isCameraOn}
        isMicOn={isMicOn}
        onToggleCamera={onToggleCamera}
        onToggleMicrophone={onToggleMicrophone}
      />
    </View>
  );
};

export default CallingScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.lightPink,
  },
  cameraPreview: {
    alignItems: 'center',
    marginTop: Spacing.space_40,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: Spacing.space_10,
  },
  phoneNumber: {
    color: Colors.black,
  },
  backButton: {
    position: 'absolute',
    top: Spacing.space_40,
    left: Spacing.space_10,
    zIndex: 10,
  },
  localVideo: {
    width: 100,
    height: 150,
    borderRadius: 10,
    position: 'absolute',
    right: Spacing.space_10,
    top: Spacing.space_60,
    zIndex: 10,
  },
  remoteVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: Spacing.space_100,
  },
});
