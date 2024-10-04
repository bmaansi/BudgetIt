import React, { useEffect, useState } from 'react';
import "../App.css";
import axios from "axios"

axios.defaults.baseURL = "http://localhost:8000"

const fetchLinkToken = async () => {
    try {
        const response = await axios.post("/create_link_token");
        return response.data.link_token
    } catch (error) {
        throw error;
    }
    
}



export default fetchLinkToken;
