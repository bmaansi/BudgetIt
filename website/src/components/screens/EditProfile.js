import React, {useState} from 'react';
import "../../App.css";
import {Link} from "react-router-dom";
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, updateDoc, setDoc,doc } from "firebase/firestore"; 


const EditProfile = () => {
    const [goal, setGoal] = useState()
    const [monthly, setMonthly] = useState()

    const [housing, setHousing] = useState()
    const [electricity, setElectricity] = useState()
    const [otherHouse, setOtherHouse] = useState()
    const [insurance, setInsurance] = useState()
    const [healthcare, setHealthcare] = useState()
    const [education, setEducation] = useState()
    const [children, setChildren] = useState()
    const [groceries, setGroceries] = useState()
    const [transportation, setTransportation] = useState()
    const [restaurant, setRestaurant] = useState()
    const [entertainment, setEntertainment] = useState()
    const [other, setOther] = useState()

  
    const updateUserData = async () => {
        const currentUser = auth.currentUser;
        //event.preventDefault();
        const usersBudget = {
            housing: housing,
            electricity: electricity,
            otherHouse: otherHouse,
            insurance: insurance,
            healthcare: healthcare,
            education: education,
            children: children,
            groceries: groceries,
            transportation: transportation,
            restaurant: restaurant,
            entertainment: entertainment,
            other: other
        };

        const filteredBudget = Object.fromEntries(
          Object.entries(usersBudget).filter(([key, value]) => value !== null && value !== undefined)
        );

        const Goal = {
          yearlyGoal: goal,
        };

        const Income = {
            monthlyIncome: monthly,
        };
        
        const myCollection = collection(db, currentUser.uid);
        const monthlyBudgetDoc = doc(myCollection, 'monthlyBudget');

        await updateDoc(monthlyBudgetDoc, filteredBudget);

        if (goal !== null) {
          const goalDoc = doc(myCollection, 'goals');  
          await updateDoc(goalDoc, Goal); 
        } 
        if (monthly !== null) {
          const incomeDoc = doc(myCollection, 'income');
          await updateDoc(incomeDoc, Income)

        } 

        
    };
           
    


    return (
      <div class="editprofile_card">
        <div class="row">
          <div class="input-field col s4">
              <i class="material-icons prefix">savings</i>
              <input 
              type="number"
              value={goal} 
              onChange={(e)=>setGoal(e.target.value)}
              />
              <label>By the end of this year I will save a total of $</label>
          </div>
          <div class="input-field col s4">
              <i class="material-icons prefix">account_balance</i>
              <input 
              type="number"
              value={monthly} 
              onChange={(e)=>setMonthly(e.target.value)}
              />
              <label>Monthly Income</label>
          </div>
        </div>
        

        <h5 class="budget_for_the_month">Budget for the Month</h5>
        <div class="row">
            <div class="input-field col s4">
            <i class="material-icons prefix">home</i>
            <input 
            type="number"
            value={housing} 
            onChange={(e)=>setHousing(e.target.value)}
            />
            <label>Housing(Rent/Mortgage)</label>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">lightbulb</i>
            <input 
            type="number"
            value={electricity} 
            onChange={(e)=>setElectricity(e.target.value)} 
            />
            <label>Electricity</label>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">cottage</i>
            <input 
            type="number"
            value={otherHouse} 
            onChange={(e)=>setOtherHouse(e.target.value)}
            />
            <label>Other Housing Expenses</label>
            </div>
        </div>

        <div class="row">        
            <div class="input-field col s4">
            <i class="material-icons prefix">article</i>
            <input 
            type="number"
            value={insurance} 
            onChange={(e)=>setInsurance(e.target.value)}
            />
            <label>Insurance</label>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">local_hospital</i>
            <input 
            type="number"
            value={healthcare} 
            onChange={(e)=>setHealthcare(e.target.value)}
            />
            <label>Healthcare</label>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">school</i>
            <input 
            type="number"
            value={education} 
            onChange={(e)=>setEducation(e.target.value)}
            />
            <label>Education</label>
            </div>
        </div>

        <div class="row">     
            <div class="input-field col s4">
            <i class="material-icons prefix">child_care</i>
            <input 
            type="number"
            value={children} 
            onChange={(e)=>setChildren(e.target.value)}
            />
            <label>Children</label>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">local_grocery_store</i>
            <input type="number"
            value={groceries} 
            onChange={(e)=>setGroceries(e.target.value)}
            />
            <label>Groceries</label>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">directions_car</i>
            <input type="number"
            value={transportation} 
            onChange={(e)=>setTransportation(e.target.value)}
            />
            <label>Transportation</label>
            </div>
        </div>

        <div class="row">
            <div class="input-field col s4">
            <i class="material-icons prefix">restaurant</i>
            <input 
            type="number"
            value={restaurant} 
            onChange={(e)=>setRestaurant(e.target.value)}
            />
            <label>Restaurant</label>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">live_tv</i>
            <input 
            type="number"
            value={entertainment} 
            onChange={(e)=>setEntertainment(e.target.value)}
            />
            <label>Entertainment</label>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">attach_money</i>
            <input
            type="number"
            value={other} 
            onChange={(e)=>setOther(e.target.value)}
            />
            <label>Other</label>
            </div>
        </div>

        <div class="editprofile_button_div">
            <button 
            class="button"
            onClick={updateUserData}
            >
            <Link class="edit_link" to='/profile'>SAVE</Link>
        </button>
        </div>

      </div>
    );
}

export default EditProfile;
