import React, {useState, useEffect} from 'react';
import "../../App.css";
import {useNavigate} from "react-router-dom";
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, updateDoc, getDoc,doc } from "firebase/firestore"; 
import { onAuthStateChanged, signOut } from "firebase/auth"; 


const EditBudget = () => {
    const [goal, setGoal] = useState()
    const [monthly, setMonthly] = useState()

    const [housing, setHousing] = useState()
    const [merchandise, setMerchandise] = useState()
    const [healthcare, setHealthcare] = useState()
    const [groceries, setGroceries] = useState()
    const [transportation, setTransportation] = useState()
    const [restaurant, setRestaurant] = useState()
    const [entertainment, setEntertainment] = useState()
    const [loans, setLoans] = useState()
    const [services, setServices] = useState()
    const [travel, setTravel] = useState()

    const [education, setEducation] = useState()
    const [insurance, setInsurance] = useState()
    const [children, setChildren] = useState()
    const [other, setOther] = useState()

    const [MB, setMB] = useState([])
    const [income, setIncome] = useState([])
    const [goals, setGoals] = useState([])
    const [total, setTotal] = useState(0);
    const nav = useNavigate();

 
    useEffect(()=> {
      async function getInfo() {
        await readDoc();
      }
      getInfo();
      },[])

      useEffect(() => {
        // Calculate total whenever MB updates
        const newTotal = Object.keys(MB).reduce((sum, key) => sum + parseInt(MB[key] || 0), 0);
        setTotal(newTotal);
      }, [MB]);
  
  
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
  

  
    const updateUserData = async () => {
        const currentUser = auth.currentUser;
        //event.preventDefault();
        const usersBudget = {
            children: children,
            education: education,
            entertainment: entertainment,
            groceries: groceries,
            healthcare: healthcare,
            housing: housing,
            insurance: insurance,
            loans: loans,
            merchandise: merchandise,
            other: other,
            restaurant: restaurant,
            services: services,
            transportation: transportation,
            travel: travel
            
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
              id='yearlyGoal'
              placeholder={goals.yearlyGoal} 
              onChange={(e)=>setGoal(e.target.value)}
              />
              <span class="helper-text" data-error="wrong" data-success="right">
                By the end of this year I will save a total of $</span>
          </div>
          <div class="input-field col s4">
              <i class="material-icons prefix">account_balance</i>
              <input 
              type="number"
              id='monthlyIncome'
              placeholder={income.monthlyIncome} 
              onChange={(e)=>setMonthly(e.target.value)}
              />
              <span class="helper-text" data-error="wrong" data-success="right">Monthly Income</span>
          </div>
        </div>
        

        <h5 class="budget_for_the_month">Budget for the Month - ${total}</h5>
        <div class="row">
            <div class="input-field col s4">
            <i class="material-icons prefix">home</i>
            <input 
            id='housing'
            type="number"
            placeholder={MB.housing} 
            onChange={(e)=>setHousing(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Housing</span>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">settings</i>
            <input 
            id='services'
            type="number"
            placeholder={MB.services} 
            onChange={(e)=>setServices(e.target.value)} 
            />
            <span class="helper-text" data-error="wrong" data-success="right">Services</span>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">shopping_bag</i>
            <input 
            type="number"
            id='merchandise'
            placeholder={MB.merchandise} 
            onChange={(e)=>setMerchandise(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Merchandise</span>
            </div>
        </div>

        <div class="row">        
            <div class="input-field col s4">
            <i class="material-icons prefix">article</i>
            <input 
            type="number"
            id='insurance'
            placeholder={MB.insurance} 
            onChange={(e)=>setInsurance(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Insurance</span>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">local_hospital</i>
            <input 
            type="number"
            id='healthcare'
            placeholder={MB.healthcare} 
            onChange={(e)=>setHealthcare(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Healthcare</span>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">school</i>
            <input 
            type="number"
            id='education'
            placeholder={MB.education} 
            onChange={(e)=>setEducation(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Education</span>
            </div>
        </div>

        <div class="row">     
            <div class="input-field col s4">
            <i class="material-icons prefix">child_care</i>
            <input 
            type="number"
            id=''
            placeholder={MB.children} 
            onChange={(e)=>setChildren(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Children</span>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">local_grocery_store</i>
            <input type="number"
            id='groceries'
            placeholder={MB.groceries} 
            onChange={(e)=>setGroceries(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Groceries</span>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">directions_car</i>
            <input type="number"
            id=''
            placeholder={MB.transportation} 
            onChange={(e)=>setTransportation(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Transportation</span>
            </div>
        </div>

        <div class="row">
            <div class="input-field col s4">
            <i class="material-icons prefix">restaurant</i>
            <input 
            type="number"
            id='restaurant'
            placeholder={MB.restaurant} 
            onChange={(e)=>setRestaurant(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Restaurant</span>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">live_tv</i>
            <input 
            type="number"
            id='entertainment'
            placeholder={MB.entertainment} 
            onChange={(e)=>setEntertainment(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Entertainment</span>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">airplane_ticket</i>
            <input
            type="number"
            id='travel'
            placeholder={MB.travel} 
            onChange={(e)=>setTravel(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Travel</span>
            </div>
        </div>

        <div class="row">
            <div class="input-field col s4">
            <i class="material-icons prefix">payments</i>
            <input 
            type="number"
            id='loans'
            placeholder={MB.loans} 
            onChange={(e)=>setLoans(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Loans</span>
            </div>

            <div class="input-field col s4">
            <i class="material-icons prefix">attach_money</i>
            <input
            type="number"
            id='other'
            placeholder={MB.other} 
            onChange={(e)=>setOther(e.target.value)}
            />
            <span class="helper-text" data-error="wrong" data-success="right">Other</span>
            </div>
        </div>

        <div class="editprofile_button_div">
            <button 
            class="button"
            onClick={
              () => {
                updateUserData();
                nav("/budget");
              }
              
            }
            >
            SAVE
        </button>
        </div>

      </div>
    );
}

export default EditBudget;
