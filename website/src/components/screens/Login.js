
import React, { useState, useEffect, useContext } from "react";
import {Link} from "react-router-dom";
import "../../App.css";
import {auth} from "../../firebase/firebaseConfig"
import {onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const PostData = async () => {
        try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        console.log(user);
        } catch (error) {
            console.log(error.message);
        }
    }
    return(
        <div class="login_signup_page">
            <h4>Welcome Back!</h4>
            <div class="login_signup_card">
                <input 
                    type="email" 
                    class="validate"
                    placeholder="email" 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="password" 
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button 
                class="button"
                onClick={PostData}
                >Login</button>
            </div>

            <div class="prompt_signup">
            <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>     
            </div>
        </div>
    );
    
}

export default Login;
