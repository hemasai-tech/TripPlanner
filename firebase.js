import firebase from '@react-native-firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyAKf8Ehwxd6dwrlBOthF_mrjzC8NKk8Dpo',
  projectId: 'trip-planner-task',
  storageBucket: 'trip-planner-task.appspot.com',
  appId: '1:675332652038:android:63fed640c7b176c3325787',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
