import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';

function UserProfile(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for changes in the authentication state
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <Text style={styles.greeting}>
          Hello, {user.displayName || 'User'}!
        </Text>
      ) : (
        <Text style={styles.greeting}>Please sign in or register.</Text>
      )}

      <TouchableOpacity
        style={styles.btn}
        onPress={() => props.navigation.navigate('TripCreation')}>
        <Text style={styles.btnTxt}> Plan Your Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  btn: {
    marginVertical: 5,
    backgroundColor: '#071952',
    borderRadius: 7,
  },
  btnTxt: {
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 18,
  },
});

export default UserProfile;
