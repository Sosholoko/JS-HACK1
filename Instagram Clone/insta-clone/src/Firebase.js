import firebase from 'firebase';
//export const firebase = !fb.apps.length ? fb.initializeApp(firebaseConfig) : fb.app()
import 'firebase/firestore';


var config = {
    apiKey: "AIzaSyAvD7RpWaZA2fcMTMFUUtujgWBQ2oJq8S0",
    authDomain: "instagram-clone-604db.firebaseapp.com",
    projectId: "instagram-clone-604db",
    databaseURL: "",
    storageBucket: "instagram-clone-604db.appspot.com",
    messagingSenderId: "369518187957",
    appId: "1:369518187957:web:c556a0554058ae72dab5fc"
};
firebase.initializeApp(config);  



export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();


export default {auth, storage};
