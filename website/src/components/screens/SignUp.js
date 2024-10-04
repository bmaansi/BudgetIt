
import React, { useState } from "react";
import {onAuthStateChanged,createUserWithEmailAndPassword } from "firebase/auth";
import {Link} from "react-router-dom";
import "../../App.css";
import { collection, setDoc,doc } from "firebase/firestore"; 
import {db,auth} from "../../firebase/firebaseConfig"



const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    //const [checkPassword, setCheckPassword] = useState("")
    const [name, setName] = useState("")
      
    const CreateUser = async () => {
        try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        console.log(user);
        } catch (error) {
            console.log(error.message);
        }
    }

    const writeUserData = async (event) => {
        const currentUser = auth.currentUser;
        event.preventDefault();
        const usersBudget = {
            housing: 0,
            electricity: 0,
            otherHouse: 0,
            insurance: 0,
            healthcare: 0,
            education: 0,
            children: 0,
            groceries: 0,
            transportation: 0,
            restaurant: 0,
            entertainment: 0,
            other: 0
        };

        const Goal = {
            yearlyGoal: 0,
        };

        const Income = {
            monthlyIncome: 0,
        };

        const myCollection = collection(db, currentUser.uid);
        const monthlyBudgetDoc = doc(myCollection, 'monthlyBudget');
        const goalDoc = doc(myCollection, 'goals');
        const incomeDoc = doc(myCollection, 'income');


        await setDoc(monthlyBudgetDoc, usersBudget);
        await setDoc(goalDoc, Goal);
        await setDoc(incomeDoc, Income);


    };

    const postData = async (event) => {
        event.preventDefault();
        try {
          await CreateUser();
          await writeUserData(event);
        } catch (error) {
          console.error("Error:", error);
        }
      };

    return(
        <div class="login_signup_page">
        <h4>Welcome to Budget It!</h4>
        <h6>One place for all your budget needs</h6>
        <div class="login_signup_card">
            <input 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={(e)=>setName(e.target.value)}
            />
            <input 
                type="email" 
                class="validate"
                placeholder="Email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)}
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)}
            />
            {/* <input 
                type="password" 
                placeholder="Enter password again" 
                value={checkPassword} 
                onChange={(e)=>setCheckPassword(e.target.value)}
            /> */}
            <button 
            class="button"
            onClick={postData}
            >Sign up</button>
        </div>

        <div class="prompt_login">
        <p>Already have an account? <Link to='/login'>Login</Link></p>     
        </div>
    </div>
    );
    
}

export default SignUp;
