// // // firebase.js
// // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// // import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// // const firebaseConfig = {
// //   apiKey: "AIzaSyDYubGMOax6iwAr1l9-mKJmTqZVtpG2hjo",
// //   authDomain: "skill-forge-dbffa.firebaseapp.com",
// //   databaseURL: "https://skill-forge-dbffa-default-rtdb.asia-southeast1.firebasedatabase.app/",
// //   projectId: "skill-forge-dbffa"
// // };

// // const app = initializeApp(firebaseConfig);
// // const database = getDatabase(app);

// // export { database, ref, set, get, child };
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getDatabase, ref, set, get, child, push } 
// from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// // 🔥 ADD THIS
// import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } 
// from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyDYubGMOax6iwAr1l9-mKJmTqZVtpG2hjo",
//   authDomain: "skill-forge-dbffa.firebaseapp.com",
//   databaseURL: "https://skill-forge-dbffa-default-rtdb.asia-southeast1.firebasedatabase.app/",
//   projectId: "skill-forge-dbffa"
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// // 🔥 INIT STORAGE
// const storage = getStorage(app);

// // 🔥 EXPORT EVERYTHING YOU NEED
// export { 
//   database, ref, set, get, child, push,
//   storage, storageRef, uploadBytes, getDownloadURL
// };
// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  onValue,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


// =====================================
// FIREBASE CONFIG
// =====================================

const firebaseConfig = {
  apiKey: "AIzaSyDYubGMOax6iwAr1l9-mKJmTqZVtpG2hjo",

  authDomain: "skill-forge-dbffa.firebaseapp.com",

  databaseURL:
    "https://skill-forge-dbffa-default-rtdb.asia-southeast1.firebasedatabase.app/",

  projectId: "skill-forge-dbffa",

  storageBucket: "skill-forge-dbffa.appspot.com",

  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

  appId: "YOUR_APP_ID"
};


// =====================================
// INITIALIZE FIREBASE
// =====================================

const app = initializeApp(firebaseConfig);


// =====================================
// REALTIME DATABASE
// =====================================

const database = getDatabase(app);


// =====================================
// FIREBASE STORAGE
// =====================================

const storage = getStorage(app);


// =====================================
// EXPORT EVERYTHING
// =====================================

export {

  // DATABASE
  database,
  ref,
  set,
  get,
  child,
  push,
  onValue,
  update,
  remove,

  // STORAGE
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject

};