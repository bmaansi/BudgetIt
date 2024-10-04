import React, { Children, useEffect, useState } from 'react';
import "../../App.css";
import {Link} from "react-router-dom";
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, doc, getDoc  } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 







const Predict = () => {
  const [MB, setMB] = useState([])
  const [income, setIncome] = useState([])
  const [goals, setGoals] = useState([])


  const readDoc = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const myCollection = collection(db, user.uid);
          //console.log(user.uid)
          const monthlyBudgetDoc = doc(myCollection, 'monthlyBudget');
          const incomeDoc = doc(myCollection, 'income');
          const goalsDoc = doc(myCollection, 'goals');
      
          getDoc(monthlyBudgetDoc)
          .then(docSnap => {
            if (docSnap.exists()) {
              console.log("Document data:", docSnap.data());
              setMB(docSnap.data());
              //return docSnapMB.data();
            } else {
              console.log("No such document!");
            }
          })

          getDoc(incomeDoc)
          .then(docSnap => {
            if (docSnap.exists()) {
              console.log("Document data:", docSnap.data());
              setIncome(docSnap.data());
              //return docSnap.data();
            } else {
              console.log("No such document!");
            }
          })
          getDoc(goalsDoc)
          .then(docSnap => {
            if (docSnap.exists()) {
              console.log("Document data:", docSnap.data());
              setGoals(docSnap.data());
              //return docSnapMB.data();
            } else {
              console.log("No such document!");
            }
          })

        } else {
          console.log("ERROR getting user")
        }
      });




  }

  

  useEffect(()=> {
    async function getInfo() {
      await readDoc();
    }
    getInfo();
    },[])

  return (
    <div>
      <h5>Hello</h5>
      
    </div>
  );
}

export default Predict;
