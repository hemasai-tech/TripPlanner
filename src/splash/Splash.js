import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Splash = props => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('RegistrationScreen');
    }, 3000);
  }, []);

  return (
    <View style={styles.main}>
      <Text style={styles.txt}>Memories Await: Begin a New Adventure</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor:'#DDE6ED'
  },
  txt: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F2C59',
    textAlign:'center'
  },
});
