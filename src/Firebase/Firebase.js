// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions";
import { useNavigate } from "react-router-dom";
// import { initialize } from "../utils/Firebase_inicialize";
import {getStorage,getDownloadURL,ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const app = initialize(firebaseConfig, initializeApp);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function useFirebase(setError) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {

    try {
      const result = await signInWithPopup(auth, provider);
      const user = {
        name: result.user.displayName,
        email: result.user.email,
        email_verified: result.user.emailVerified,
        photo: result.user.photoURL,
        phone: result.user.phoneNumber,
        meta: result.user.metadata.lastSignInTime,
        googleId: result.user.uid
      }
      dispatch(setUser(user))
      navigate("/welcome")
    } catch (error) {
       const user = {
         name: null,
       };
        localStorage.setItem("user", JSON.stringify(user));
      console.error(error);
      setError(true)
    }
  
  }


  return {signInWithGoogle}
}

//?

const storageFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY_IMG,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_IMG,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_IMG,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_IMG,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDERID_IMG,
  appId: import.meta.env.VITE_FIREBASE_APP_ID_IMG,
};

export const storageApp = initializeApp(storageFirebaseConfig,"storageApp");
export const storage = getStorage(storageApp);


export async function getFileDownloadURL(fileName) {
  const fileRef = ref(storage,fileName);
  
  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    // Manejar el error (puede ser que el archivo no exista)
    console.error('Error al obtener la URL de descarga:', error);
    return null;
  }
}