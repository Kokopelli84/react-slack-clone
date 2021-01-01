import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: 'AIzaSyCyK3al66iuXYSAPMr-w8645w_leGYWHus',
  authDomain: 'react-slack-clone-20823.firebaseapp.com',
  projectId: 'react-slack-clone-20823',
  storageBucket: 'react-slack-clone-20823.appspot.com',
  messagingSenderId: '870555692244',
  appId: '1:870555692244:web:040a960600014dd9f6df41',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
