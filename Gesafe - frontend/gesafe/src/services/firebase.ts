// services/firebase.ts
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyB2kaL6h_F7-TbKgRbxZFLqvPzUTkJeBuU',
    authDomain: 'gesafe-auth.firebaseapp.com',
    projectId: 'gesafe-auth',
    storageBucket: 'gesafe-auth.firebasestorage.app',
    messagingSenderId: '285162109062',
    appId: '1:285162109062:web:93fd3a3afbc4887f8b7907',
    measurementId: 'G-VTLHYSX0EF',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { auth, firebase };


