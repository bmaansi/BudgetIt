import './App.css';
import {app,db} from "./firebase/firebaseConfig"
import Login from "./components/screens/Login";
import SignUp from "./components/screens/SignUp";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import EditProfile from "./components/screens/EditProfile";
import Predict from "./components/screens/Predict";
import NavBar from "./components/NavBar";
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom";


const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/editprofile" element={<EditProfile />} />
      <Route path="/predict" element={<Predict />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
function App() {

  return (
    <BrowserRouter>
       <NavBar/>
       <Routing/>
    </BrowserRouter>
  );
}

export default App;