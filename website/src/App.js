import './App.css';
import {app,db} from "./firebase/firebaseConfig"
import Login from "./components/screens/Login";
import SignUp from "./components/screens/SignUp";
import Home from "./components/screens/Home";
import Budget from "./components/screens/Budget";
import EditBudget from "./components/screens/EditBudget";
import Predict from "./components/screens/Predict";
import TransactionCalendar from "./components/screens/Calendar";
import Analysis from "./components/screens/Analysis";

import NavBar from "./components/NavBar";
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom";


const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/editbudget" element={<EditBudget />} />
      <Route path="/predict" element={<Predict />} />
      <Route path="/transaction" element={<TransactionCalendar />} />
      <Route path="/analysis" element={<Analysis />} />
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