import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const handleLogin = async () => {
    try {
      if (email == '' || password == '') {
        Alert.alert('', 'Please Fill the mandatory Fields');
      } else {
        await auth().signInWithEmailAndPassword(email, password);
        // User logged in successfully
        const user = auth().currentUser;
        props.navigation.navigate('UserProfile');
        setEmail('');
        setPassword('');
        forceUpdate();
      }
    } catch (loginError) {
      // Handle login error
      console.error('Login error', loginError);
      // Show an error alert
      Alert.alert(
        'Login Error',
        'Unable to log in. Please check your credentials.',
      );
    }
  };

  useEffect(() => {
    // Clear input fields when the component unmounts (e.g., user logs out)
    return () => {
      setEmail('');
      setPassword('');
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back,</Text>
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
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnTxt}> Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

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
