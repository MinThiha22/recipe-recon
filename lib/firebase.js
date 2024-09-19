
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 


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
const storage = getStorage(app);

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

export const getCurrentUserData = async () => {
  try {
    const user = auth.currentUser;
    if(!user) throw new Error("No user is currently sign-in");
    const userId = user.uid;
    const userDoc = doc(db, "users", userId);
    const docSnapshot = await getDoc(userDoc);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const { username, email } = userData;
      return {
        user,
        username,
        email
      };
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error(error.message);
  }
}

export const uploadProfilePicture = async (file, userId) => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}`);
    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    await setDoc(doc(db, "users", userId), {
      profilePicture: url,
    });

    return url;
  } catch (error) {
    console.log(error.message)
    throw new Error(error.message);
  }
}

export const getProfilePicture = async (userId) => {
  try {
    const userDoc = doc(db,"users",userId);
    const docSnapshot = await getDoc(userDoc);

    if(docSnapshot.exists()){
      const {profilePicture} = docSnapshot.data();
      return profilePicture || null;
    }
    else{
      throw new Error('User data not found');
    }
  } catch(error){
    throw new Error(error.message);
  }
}

export const saveIngredients = async (ingredientList, userId) => {
  try {
    const ingredientDoc = doc(db, "ingredients", userId);
    const docSnapshot = await getDoc(ingredientDoc);

    if (docSnapshot.exists()) {
      const currentData = docSnapshot.data();
      const currentList = currentData.list || []; // Default to empty array if list is not present

      const updatedList = [...new Set([...currentList, ...ingredientList])]; // Use Set to avoid duplicates
      await setDoc(
        ingredientDoc, 
        { list: updatedList }, 
        { merge: true });
    } else {
      await setDoc(ingredientDoc, { list: ingredientList }, { merge: true });
    }
  } catch(error){
    throw new Error(error.message);
  }
}

export const getIngredients = async (userId) => {
  try {
    const ingredientDoc = doc(db,"ingredients",userId);
    const docSnapshot = await getDoc(ingredientDoc);

    if(docSnapshot.exists()){
      const data = docSnapshot.data();
      return data.list || [];
    }
    else{
      throw new Error('User data not found');
    }
  } catch(error){
    throw new Error(error.message);
  }
}
