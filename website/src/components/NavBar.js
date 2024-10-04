import React, { useState }  from 'react'
import {Link} from "react-router-dom";
import "../App.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {auth} from "../firebase/firebaseConfig";


const NavBar = () => {

    const [user, setUser] = useState({});
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    const renderList = () =>{
        if (user) {
            return [
                <li><Link to="/">Home</Link></li>,
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/predict">Predict</Link></li>


            ]
        } else {
            return [
                <li><Link to="/login">Login</Link></li>,
                <li><Link to="/signup">Signup</Link></li>,
            ]
        }
    }

    return (
    <nav class="navbar">
        <div class="nav-wrapper black">
            <Link to="/" className="brand-logo left">Budget It</Link>
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
        </div>
    </nav>

    )
}

export default NavBar;
