import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';

const SnoozeButton = ({title, iconName}) => {
  return (
    <TouchableOpacity style={styles.snoozeButton}>
      <MaterialCommunityIcon name={iconName} size={24} color={Colors.white} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SnoozeButton;

const styles = StyleSheet.create({
  snoozeButton: {
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
  },
});
