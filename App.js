import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './src/splash/Splash';
import RegistrationScreen from './src/userCreation/RegistrationScreen';
import UserProfile from './src/user/UserProfile';
import Login from './src/userCreation/Login';
import TripCreation from './src/trip/TripCreation';
import TaskList from './src/trip/TaskList';
import 'react-native-gesture-handler'

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          options={{headerShown: false}}
          component={Splash}
        />
        <Stack.Screen
          name="RegistrationScreen"
          options={{headerShown: false}}
          component={RegistrationScreen}
        />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TripCreation" component={TripCreation} />
        <Stack.Screen name="TaskList" component={TaskList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
