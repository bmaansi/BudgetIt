import {db, auth} from './firebaseConfig';
import { collection, getDoc, doc } from "firebase/firestore"; 
import {onAuthStateChanged } from "firebase/auth"; 


const readAccessToken = () => {
    try {
          onAuthStateChanged(auth, (user) => {
      if (user) {
        const myCollection = collection(db, user.uid);
        const tokenDoc = doc(myCollection, 'accessToken');
    
        getDoc(tokenDoc)
        .then(docSnap => {
          if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data().accessToken);
            //setAccessToken(docSnap.data().accessToken);
            return docSnap.data().accessToken
          } else {
            console.log("No such document!");
          }
        })

      } else {
        console.log("ERROR getting user")
      }
    });
    } catch (error) {
      throw (error)
    }
}


export default readAccessToken