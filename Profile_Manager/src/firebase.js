import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDGQFIKyLTRO_XpLCFDGQYoWVgYqXZGPxE",
  authDomain: "profile-manager-9364e.firebaseapp.com",
  databaseURL: "https://profile-manager-9364e-default-rtdb.firebaseio.com",
  projectId: "profile-manager-9364e",
  storageBucket: "profile-manager-9364e.appspot.com",
  messagingSenderId: "1095642281947",
  appId: "1:1095642281947:web:c7e9c0c0c8c8c8c8c8c8c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage, app }; 
