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
        name: user.displayName,
        dob: null,
        suburb: null,
        subscription: false,
        authProvider: 'google',
        totalSteps: 0,
        group: null,
        region:null,
        breakdown : {
          date: currentDate,
          steps: 0
        },
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
const registerWithEmailAndPassword = async (name, email, password, region, location, group, dob, subscription) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: name,
        authProvider: 'local',
        totalSteps: 0,
        region: region,
        group: group,
        dob: dob,
        suburb: location,
        subscription: subscription,
        breakdown : {
          date: currentDate,
          steps: 0
        },
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