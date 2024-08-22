
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';


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


