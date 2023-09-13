import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const width = Dimensions.get('screen').width;
const TripCreation = props => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [trips, setTrips] = useState([]);

  // Inside the handleCreateTrip function
  const createTrip = async () => {
    try {
      const userId = auth().currentUser.uid; // Get the UID of the logged-in user
      const userName = auth().currentUser.displayName;
      const tripData = {
        tripName,
        destination,
        userId, // Associate the trip with the logged-in user
        userName,
      };

      // Add the tripData to the "trips" collection inside the user's document
      const tripRef = await firestore()
        .collection('users')
        .doc(userId)
        .collection('trips')
        .add(tripData);

      // Get the generated trip ID
      const tripId = tripRef.id;

      // Update the trip document to include the trip ID
      await tripRef.update({tripId});

      // Trip created successfully
      console.log('Trip created successfully with ID:', tripId);
      props.navigation.navigate('TaskList', {tripData});
    } catch (error) {
      // Handle trip creation error
      console.error('Trip creation error', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      // User has been logged out
      console.log('Logged out successfully');
      props.navigation.replace('RegistrationScreen');
    } catch (error) {
      // Handle logout error
      console.error('Logout error', error);
    }
  };

  useEffect(() => {
    fetchTripsFromFirestore();
  }, []);

  const fetchTripsFromFirestore = async () => {
    try {
      const user = auth().currentUser;
      const userId = user.uid;
      const tripsRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('trips');
      const snapshot = await tripsRef.get();

      const tripsData = [];
      snapshot.forEach(doc => {
        tripsData.push({id: doc.id, ...doc.data()});
      });
      console.log(tripsData);
      setTrips(tripsData);
    } catch (error) {
      console.error('Error fetching trips:', error);
      return [];
    }
  };

  const renderTrips = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('TaskList', {tripId: item.tripId})
        }
        style={styles.tripView}>
        <Text style={styles.tripItem}>{item.tripName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.logout}>
        <TouchableOpacity onPress={() => handleLogout()}>
          <Text style={styles.logoutTxt}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>Create a New Trip</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter trip name"
          value={tripName}
          onChangeText={text => setTripName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destination}
          onChangeText={text => setDestination(text)}
        />
        <Button title="Create Trip" onPress={createTrip} color="#071952" />
        <Text style={[styles.header, {marginVertical: 10, color: '#0A6EBD'}]}>
          Previous Trips
        </Text>
      </View>
      <View style={{marginRight: 'auto'}}>
        <FlatList
          data={trips}
          keyExtractor={(item, indx) => indx.toString()}
          renderItem={(item, index) => renderTrips(item, index)}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logout: {
    alignItems: 'flex-end',
    padding: 10,
  },
  logoutTxt: {
    color: 'red',
    fontWeight: 'bold',
  },
  container: {
    // flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tripView: {
    marginVertical: 2,
    width: width,
    paddingHorizontal: 5,
  },
  tripItem: {
    backgroundColor: '#4F709C',
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    paddingHorizontal: 10,
    padding: 10,
    borderRadius: 5,
  },
});

export default TripCreation;
