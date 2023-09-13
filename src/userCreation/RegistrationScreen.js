import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const RegistrationScreen = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const userCreate = async () => {
    if (email == '' || password == '' || name == '') {
      Alert.alert('', 'Please Fill the Mandatory Fields');
    } else {
      await handleRegistration();
    }
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Hold on!',
        'Exit, stage left! Your epic journey might turn into an epic oopsie. Ready to roll the dice?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'Exit', onPress: () => BackHandler.exitApp()},
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const createUserDocument = async () => {
    const user = auth().currentUser;
    const userId = user.uid;

    try {
      await firestore()
        .collection('users')
        .doc(userId) // Use the user's UID as the document ID
        .set({
          name: user.displayName,
          email: user.email,
          // Add any other user-related data you want to store
        });

      console.log('User document created successfully');
      props.navigation.navigate('TripCreation');
      setEmail('');
      setName('');
      setPassword('');
    } catch (error) {
      console.error('Error creating user document', error);
    }
  };

  const handleRegistration = async () => {
    try {
      // Create the user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      // Update the user's profile with the provided name
      await userCredential.user.updateProfile({
        displayName: name,
      });

      // User registered successfully
      console.log('Registration success');
      await createUserDocument();
    } catch (error) {
      // Handle registration error
      console.error('Registration error', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you waiting For?</Text>
      <Text style={styles.title}>Register Now...</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity style={styles.btn} onPress={userCreate}>
        <Text style={styles.btnTxt}>Register</Text>
      </TouchableOpacity>
      <View style={{marginVertical: 10}}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.btnTxt}>Already Registered Login Here...</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F2C59',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginVertical: 18,
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
