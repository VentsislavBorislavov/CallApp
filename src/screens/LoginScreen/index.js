import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import {Voximplant} from 'react-native-voximplant';

import {ACC_NAME, APP_NAME} from '../../constants/VoxImplant';
import {useNavigation} from '@react-navigation/native';
import Screens from '../../appNavigation/Screens';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';

const LoginScreen = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const voximplant = Voximplant.getInstance();

  useEffect(() => {
    const connect = async () => {
      const status = await voximplant.getClientState();
      if (status === Voximplant.ClientState.DISCONNECTED) {
        await voximplant.connect();
      } else if (status === Voximplant.ClientState.LOGGED_IN) {
        redirectHome();
      }
    };

    connect();
  }, []);

  const signIn = async () => {
    try {
      const fqUsername = `${username}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
      await voximplant.login(fqUsername, password);

      redirectHome();
    } catch (err) {
      console.log(err);
    }
  };

  const redirectHome = () => {
    // Navigate to screen without having the option to go to previous screen
    navigation.reset({
      index: 0,
      routes: [
        {
          name: Screens.CONTACTS_SCREEN,
        },
      ],
    });
  };

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.input}
        autoCorrect={false}
        placeholder="username"
        onChangeText={setUserName}
        value={username}
      />
      <TextInput
        style={styles.input}
        autoCorrect={false}
        placeholder="password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.singInButton} onPress={signIn}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.space_20,
    marginBottom: Spacing.space_20,
    borderRadius: 5,
    paddingLeft: Spacing.space_10,
    paddingVertical: Spacing.space_5,
  },
  singInButton: {
    alignItems: 'center',
    backgroundColor: Colors.lightBlue,
    marginHorizontal: Spacing.space_20,
    padding: Spacing.space_10,
    borderRadius: 5,
  },
  signInText: {
    color: Colors.black,
  },
});
