import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import dummyContacts from '../../../assets/data/contacts.json';
import {useNavigation} from '@react-navigation/native';
import Screens from '../../appNavigation/Screens';
import {Voximplant} from 'react-native-voximplant';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';

const ContactsScreen = () => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(dummyContacts);
  const voximplant = Voximplant.getInstance();
  const navigation = useNavigation();

  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      navigation.navigate(Screens.INCOMING_CALL_SCREEN, {
        call: incomingCallEvent.call,
      });
    });

    return () => {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  }, []);

  useEffect(() => {
    const filtered = dummyContacts.filter(contact =>
      contact.user_display_name
        .toLowerCase()
        .includes(searchInput.toLowerCase()),
    );
    setFilteredContacts(filtered);
  }, [searchInput]);

  const callUser = user => {
    navigation.navigate(Screens.CALLING_SCREEN, {user});
  };

  return (
    <View style={styles.page}>
      <TextInput
        value={searchInput}
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={setSearchInput}
      />
      <FlatList
        data={filteredContacts}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => callUser(item)}>
            <Text style={styles.contactName}>{item.user_display_name}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator}></View>}
      />
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  page: {
    padding: Spacing.space_15,
    flex: 1,
    backgroundColor: Colors.white
  },
  contactName: {
    fontSize: 16,
    marginVertical: Spacing.space_10,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.lightGray,
  },
  searchInput: {
    backgroundColor: Colors.lightGray,
    padding: Spacing.space_5,
    paddingLeft: Spacing.space_10,
    borderRadius: 5,
  },
});
