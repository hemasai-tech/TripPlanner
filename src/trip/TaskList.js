import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const width = Dimensions.get('screen').width;

function TaskList(props) {
  const tripId = props.route.params.tripId;
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const addTask = async () => {
    const user = auth().currentUser;
    const userId = user.uid;
    try {
      const taskData = {
        task: newTask,
        task_description: description,
      };

      // Add the task to Firestore under the trip's document
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('trips')
        .doc(tripId)
        .collection('task')
        .add(taskData);

      // Retrieve and update the tasks list
      const updatedTasks = await fetchTasksFromFirestore();
      setTasks(updatedTasks);

      // Clear the new task input field
      setNewTask('');
      setDescription('');
      console.log('Task Created');
      forceUpdate();
      props.navigation.replace('TripCreation');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      props.navigation.navigate('TripCreation');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const fetchTasksFromFirestore = async () => {
    const user = auth().currentUser;
    const userId = user.uid;
    try {
      const tasksSnapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('trips')
        .doc(tripId)
        .collection('task');
      const snapshot = await tasksSnapshot.get();
      let taskArray = [];
      snapshot.docs.forEach(doc => {
        taskArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log(taskArray);
      setTasks(taskArray);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  };

  const deleteTaskFromFirestore = async taskId => {
    const user = auth().currentUser;
    const userId = user.uid;
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('trips')
        .doc(tripId)
        .collection('task')
        .doc(taskId)
        .delete();
      await fetchTasksFromFirestore();
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchTasksFromFirestore();
  }, []);

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

  const renderTasks = ({item}) => {
    console.log(item);
    return (
      <View style={styles.tripView}>
        <View style={styles.tripItem}>
          <View>
            <Text style={styles.tripTxt}>{item.task}</Text>
            <Text style={styles.tripTxt}>{item.task_description}</Text>
          </View>
          <TouchableOpacity
            style={styles.del}
            onPress={() => deleteTaskFromFirestore(item.id)}>
            <Icon name="trash" size={25} color="#FF6969" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.logout}>
        <TouchableOpacity
          onPress={() => handleLogout()}
          style={styles.logoutButton}>
          <Text style={styles.logoutTxt}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task name"
          value={newTask}
          onChangeText={text => setNewTask(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Description"
          value={description}
          onChangeText={text => setDescription(text)}
        />
        <Button title="Add Task" onPress={addTask} color="#071952" />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={task => task.id}
        renderItem={(item, index) => renderTasks(item, index)}
        style={styles.taskList}
      />
    </View>
  );
}

export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  logout: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 8,
    borderRadius: 5,
  },
  logoutTxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  taskList: {
    flex: 1,
  },
  tripView: {
    marginVertical: 4,
    width: width,
    paddingHorizontal: 5,
  },
  tripItem: {
    backgroundColor: '#4F709C',
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
  },
  tripTxt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginVertical: 3,
  },
  del: {
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    marginRight: 25,
    alignSelf: 'center',
  },
});
