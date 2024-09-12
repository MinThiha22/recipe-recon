
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc  } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCJTIZHwEUTQr6OFFYk1C-232XnQyKarw4",
  authDomain: "recipe-recon-ec09b.firebaseapp.com",
  projectId: "recipe-recon-ec09b",
  storageBucket: "recipe-recon-ec09b.appspot.com",
  messagingSenderId: "1076976261018",
  appId: "1:1076976261018:web:b79b2c5332eafc74a3cc23"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export const createUser = async (username, email, password) => {
  try {
    
    const userCredential = await createUserWithEmailAndPassword(auth, email,password);
    const user = userCredential.user;

    // Generate a unique user ID
    const userId = user.uid;

    await signIn(email,password);
    // Set user data in Realtime Database

    await setDoc(doc(db, "users", userId), {
      username: username,
      email: email,
    });

    return { userId, username, email };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
};

export const checkAuthState = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        unsubscribe();
        if (user) {
          resolve(user); // User is authenticated
        } else {
          resolve(user); // User is not authenticated
        }
      },
      (error) => {
        unsubscribe();
        reject(error); // An error occurred while checking the auth state
      }
    );
  });
};

