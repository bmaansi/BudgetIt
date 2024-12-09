import React, { Children, useEffect, useState } from 'react';
import "../../App.css";
import {Link} from "react-router-dom";
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, doc, getDoc  } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 





const Budget = () => {
  const [MB, setMB] = useState([])
  const [income, setIncome] = useState([])
  const [goals, setGoals] = useState([])
  let totalPlannedBudget = 0
  let remaining = 0;


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
              setMB(docSnap.data());
              //return docSnapMB.data();
            } else {
              console.log("No such document!");
            }
          })

          getDoc(incomeDoc)
          .then(docSnap => {
            if (docSnap.exists()) {
              setIncome(docSnap.data());
              //return docSnap.data();
            } else {
              console.log("No such document!");
            }
          })
          getDoc(goalsDoc)
          .then(docSnap => {
            if (docSnap.exists()) {
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
    Object.keys(MB).map(key => (
      totalPlannedBudget += parseInt(MB[key])
    )),
    <div class='row'>
            <div> 
      {(totalPlannedBudget > income.monthlyIncome || goals.yearlyGoal/12 > income.monthlyIncome - totalPlannedBudget) ? (
        (totalPlannedBudget > income.monthlyIncome) ? (
          <div>
            <h5>!! You budget exceeds your total income !!</h5> 
            <p>You have a total planned budget of ${totalPlannedBudget}. Your total planned budget exceeds 
              your income by ${totalPlannedBudget - income.monthlyIncome} </p>
          </div>
        ) : (
          <div>
            <h5>!! Not on tracking for your savings !!</h5> 
            <p>You have a total planned budget of ${totalPlannedBudget}. To be on track for savings 
              you need to safe ${goals.yearlyGoal/12} per month, but currently you are track for saving 
              only ${income.monthlyIncome-totalPlannedBudget}.</p>
          </div>
        )
      ) : (
        <div>
          <h5>You are on track!</h5> 
          <p>You have a total planned budget of ${totalPlannedBudget}. To be on track for savings you need to safe 
            ${goals.yearlyGoal/12} per month, and currently you are on track for saving ${income.monthlyIncome-totalPlannedBudget}.  
          </p>

        </div>
      )}
    </div>
    <div class="row">
        <div class="input-field col s4">
        
          <h6>Your saving goals are </h6>
          {
            <div> 
              
              <p class="profile_p">{`$${goals.yearlyGoal}`}</p>
            </div>
          }
        </div>

        <div class="input-field col s4">
          <h6>Your monthly income is </h6>
          {
            <div> 
              <p class="profile_p">{`$${income.monthlyIncome}`}</p>
            </div>
          }
        </div>

        

        <div class="input-field col s4">
          <button class="button">
            <Link class = "edit_link"
            to='/editbudget'>EDIT</Link>
          </button>
        
        </div>
        

      </div>


    <div>
      
    <div>
        <h6>Your monthly budget is: </h6>
        <div class="row">
        { 
          Object.keys(MB).map(key => (
            <div class="input-field col s4"> 
              <p class="profile_p">{`${key.toUpperCase()} : $${MB[key]}`}</p>
            </div>
          ))
        }

        </div>
       
      </div>

    </div>


    </div>
  );
}

export default Budget;
