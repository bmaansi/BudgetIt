import React, { Children, useEffect, useState } from 'react';
import "../../App.css";
import {Link} from "react-router-dom";
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, doc, getDoc  } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 




const Profile = () => {
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
      <div class="row">
          <h6>Your monthly budget is: </h6>
          {
          Object.keys(MB).map(key => (
            <div class="input-field col s4" key={key}> 
              <p class="profile_p">{`${key.toUpperCase()} : $${MB[key]}`}</p>
            </div>
          ))
        }
    </div>

    <div>
      <h6>Your monthly income is </h6>
       {
          Object.keys(income).map(key => (
            <div key={key}> 
              <p class="profile_p">{`${key.toUpperCase()} : $${income[key]}`}</p>
            </div>
          ))
        }
    </div>

    <div>
      <h6>Your saving goals are </h6>
       {
          Object.keys(goals).map(key => (
            <div key={key}> 
              <p class="profile_p">{`${key.toUpperCase()} : $${goals[key]}`}</p>
            </div>
          ))
        }
    </div>

    <div>
      <button class="button">
        <Link class = "edit_link"
        to='/editprofile'>EDIT</Link>
      </button>
    </div>
 
    </div>
  );
}

export default Profile;
