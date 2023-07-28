import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk1iVV2VMG3CLnt8baR67PSuo8f0vhMu4",
  authDomain: "formgenius-d32ee.firebaseapp.com",
  databaseURL: "https://formgenius-d32ee-default-rtdb.firebaseio.com",
  projectId: "formgenius-d32ee",
  storageBucket: "formgenius-d32ee.appspot.com",
  messagingSenderId: "544510183226",
  appId: "1:544510183226:web:946132774b17d59644f203",
  measurementId: "G-2SML2G7XCR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore_db = getFirestore(app);

export { app, firestore_db,firebaseConfig};
