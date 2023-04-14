// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';


import {
  getFirestore,
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

console.log(import.meta.env.VITE_API_KEY);
console.log(import.meta.env.VITE_AUTH_DOMAIN);

const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_API_KEY}`,
  authDomain: `${import.meta.env.VITE_AUTH_DOMAIN}`,
  projectId: 'power-db-8f9c4',
  storageBucket: 'power-db-8f9c4.appspot.com',
  messagingSenderId: '675207666655',
  appId: '1:675207666655:web:2390a2393ce5367f10826a',
  measurementId: 'G-5QQ1Z5SXD5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// AUTHENTICATION
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGoogleRedirect = () => 
  signInWithRedirect(auth, googleProvider);

// FIREBASE
export const db = getFirestore(app);

export const createUserDocumentFromAuth = async (userAuth) => {
  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    const wilksScores = [];

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        wilksScores,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};

export const updateUserWilks = async (wilksData) => {
  const currentUserDocRef = doc(db, 'users', auth.currentUser.uid);
  await updateDoc(currentUserDocRef, {
    wilksScores: arrayUnion(wilksData),
  });
};

export const deleteUserWilks = async (wilks) => {
  const currentUserDocRef = doc(db, 'users', auth.currentUser.uid);
  await updateDoc(currentUserDocRef, {
    wilksScores: arrayRemove(wilks),
  });
};

export const getUserWilks = async () => {
  const docRef = doc(db, 'users', auth.currentUser.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists) {
    try {
      return docSnap.data();
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => {
  if (!callback) return;
  onAuthStateChanged(auth, callback);
};
