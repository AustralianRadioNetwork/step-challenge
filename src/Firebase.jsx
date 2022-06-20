/**
* Setting up main firebase functions 
*/


// main firebase import
import { initializeApp } from 'firebase/app';

// firebase auth services
import { GoogleAuthProvider,getAuth,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendPasswordResetEmail,signOut,} from 'firebase/auth';

// firebase services
import {getFirestore,query,getDocs,collection,where,addDoc,} from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAkVY4po1wPKcYBwuxksI7InpfakIkeaJY',
    authDomain: 'step-challenge-f2745.firebaseapp.com',
    projectId: 'step-challenge-f2745',
    storageBucket: 'step-challenge-f2745.appspot.com',
    messagingSenderId: '728304327432',
    appId: '1:728304327432:web:ff26fbe777587e90ce6abd',
    measurementId: 'G-0M2KBRMHHG'
};

// current Date 
const currentDate = new Date().getFullYear() + "-" +("0" + (new Date().getMonth() + 1)).slice(-2)
+ '-' +("0" + new Date().getDate()).slice(-2);

// installizing firebase app
const app = initializeApp(firebaseConfig);

// set up authenticate
const auth = getAuth(app);

// connect database
const db = getFirestore(app);

// step breakdown for Feburary 
const breakdown = [
  {date: '2022-02-01',
    steps: 0},
  {date: '2022-02-02',
    steps: 0},
  {date: '2022-02-03',
    steps: 0},
  {date: '2022-02-04',
    steps: 0},
  {date: '2022-02-05',
    steps: 0},
  {date: '2022-02-06',
    steps: 0},
  {date: '2022-02-07',
    steps: 0},
  {date: '2022-02-08',
    steps: 0},
  {date: '2022-02-09',
    steps: 0},
  {date: '2022-02-10',
    steps: 0},
  {date: '2022-02-11',
    steps: 0},
  {date: '2022-02-12',
    steps: 0},
  {date: '2022-02-13',
    steps: 0},
  {date: '2022-02-14',
    steps: 0},
  {date: '2022-02-15',
    steps: 0},
  {date: '2022-02-16',
    steps: 0},
  {date: '2022-02-17',
    steps: 0},
  {date: '2022-02-18',
    steps: 0},
  {date: '2022-02-19',
    steps: 0},
  {date: '2022-02-20',
    steps: 0},
  {date: '2022-02-21',
    steps: 0},
  {date: '2022-02-22',
    steps: 0},
  {date: '2022-02-23',
    steps: 0},
  {date: '2022-02-24',
    steps: 0},
  {date: '2022-02-25',
    steps: 0},
  {date: '2022-02-26',
    steps: 0},
  {date: '2022-02-27',
    steps: 0},
  {date: '2022-02-28',
    steps: 0},
]

// google authentication
const googleProvider = new GoogleAuthProvider();


const signInWithGoogle = async () => {
  try {
    // pops up google sign in 
    const res = await signInWithPopup(auth, googleProvider);
    
    // check if user exists or not
    const user = res.user;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const docs = await getDocs(q);

    // if user is not registered
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        firstName: '',
        lastname: '',
        fullName: user.displayName,
        dob: null,
        suburb: null,
        subscription: false,
        authProvider: 'google',
        totalSteps: 0,
        group: null,
        region:null,
        breakdown : breakdown,
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// login with user and password
const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// register with email and password
const registerWithEmailAndPassword = async (firstName, lastName, fullName, email, phone, password, region, location, group, dob, subscription) => {

  let regionName  = region.substr(0, region.indexOf(',')); 
  let state = region.split(',')[1];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,
        fullName: fullName,
        authProvider: 'local',
        totalSteps: 0,
        region: regionName,
        state: state,
        group: group,
        dob: dob,
        phone: phone,
        suburb: location,
        subscription: subscription,
        breakdown : breakdown,
        email: user.email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// incase of password needed
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset link sent!');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// logout
const logout = () => {
  signOut(auth);
  window.location.href = '/success';
};

// global functions
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};