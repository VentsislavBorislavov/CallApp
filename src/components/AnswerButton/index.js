import {StyleSheet, Pressable, View, Text} from 'react-native';
import React from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';

const AnswerButton = ({title, color, onPress, iconName}) => {
  return (
    <Pressable onPress={onPress} style={styles.buttonContainer}>
      <View style={[styles.iconButton, {backgroundColor: color}]}>
        <MaterialCommunityIcon name={iconName} size={30} color={Colors.white} />
      </View>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

export default AnswerButton;

const styles = StyleSheet.create({
  iconButton: {
    backgroundColor: Colors.gray,
    borderRadius: 50,
    padding: Spacing.space_15,
  },
  buttonText: {
    color: Colors.white,
    marginTop: Spacing.space_10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
