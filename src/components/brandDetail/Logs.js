import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createStackNavigator();

const Logs = ({ data, navigation }) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flipHandler} style={styles.subcontainer}>
        
        <Front data={data} isFront={isFront} />
        {!isFront && <Back data={data} />}
      </TouchableOpacity>

      {!isFront && (
        <TouchableOpacity
          style={styles.text1}
          onPress={() => navigation.navigate('상세 정보', { data: data})}>
          <Text>상세 정보</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 5 / 3,
    width: '60%',
    marginHorizontal: '20%',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: 'black',
    borderWidth: 1,
  },
  subcontainer: {
    aspectRatio: 5 / 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
    backgroundColor: '#f8f8ff',
  },
  text1: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 4,
    backgroundColor: '#f8f8ff',
  },
});

export default Logs;
