import React, { useEffect, useState } from 'react';
import "../../App.css";
import { usePlaidLink } from 'react-plaid-link';
import fetchLinkToken from '../../utils/Actions';
import axios from 'axios';
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, setDoc, getDoc, doc } from "firebase/firestore"; 
import {onAuthStateChanged } from "firebase/auth"; 
import {Link} from "react-router-dom";
// import { readAccessToken } from "../../firebase/fireStorage";




axios.defaults.baseURL = "http://localhost:8000"

const Home = () => {

  const [linkToken, setLinkToken] = useState();
  // const [PublicToken, setPublicToken] = useState();
  const [accessToken, setAccessToken] = useState([]);
  const [account, setAccount] = useState([])
  const [start_date, setStartDate] = useState();
  const [end_date, setEndDate] = useState();



  const updateUserData = async () => {
    
    try {
      const currentUser = auth.currentUser;
      const myCollection = collection(db, currentUser.uid);
      const tokenDoc = doc(myCollection, 'accessToken');
      console.log("ACCESS TOKEN ", accessToken);
      const AT = {
        accessToken: accessToken
      }
  
      await setDoc(tokenDoc, AT);

    } catch (error) {
      console.log(error)
    }
};

  const readDoc = async () => {
    try {
          onAuthStateChanged(auth, (user) => {
      if (user) {
        const myCollection = collection(db, user.uid);
        const tokenDoc = doc(myCollection, 'accessToken');
    
        getDoc(tokenDoc)
        .then(docSnap => {
          if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data().accessToken);
            setAccessToken(docSnap.data().accessToken);
          } else {
            console.log("No such document!");
          }
        })

      } else {
        console.log("ERROR getting user")
      }
    });
    } catch (error) {
      console.log(error)
    }
}

    useEffect(()=> {
      async function fetch() {
        await readDoc();
        try {
          const response = await axios.post("/create_link_token");
          console.log("LINK TOKEN",  response.data.link_token);
          setLinkToken(response.data.link_token);
        } catch (error) {
          console.log("ERROR fetching link token: ", error);
        }
      }
      fetch();

    }, [])

    useEffect(() => {
      if (accessToken.length > 0) {
        updateUserData();
        fetchAccount();
        // fetchTransactions();
      }
      
    }, [accessToken]);


  
    const { open, ready } = usePlaidLink({
      token: linkToken,
      onSuccess: (public_token) => {
        //setPublicToken(public_token);
      async function fetchData() {
        try {
          let accessToken = await axios.post(
            '/exchange_public_token', 
            {public_token: public_token}
          );
          setAccessToken((preToken) => setAccessToken([...preToken, accessToken.data]))
        } catch (error) {
          console.error("Error exchanging token:", error);
        }
      }
      fetchData();
      }
    });


    const fetchAccount = async () => {
      async function fetch(AT) {
        try {
          let accountInfo = await axios.post(
            '/accounts', 
            {access_token: AT}
          );
          //setUsers((prevUsers) => [...prevUsers, newUser]);
          setAccount((pre) => [...pre, accountInfo.data]);
          
        } catch (error) {
          console.error("Error fetching account: ", error);
        }
      }
      accessToken.forEach(fetch);
    }


 
    return (
      
      <div class="home_page">
        
        <div>

        </div>
        <div class="floating_add_button_cont">
          <button 
          class="floating_add"
        className="btn-floating btn-large waves-effect waves-light #000000 black"
        onClick={() => open()} disabled={!ready}
        ><i class="material-icons">add</i></button>
        </div>

        <div class="row">
        {
          //<p>{item.accounts[0].account_id}</p>
          account?.map(items => {
            {console.log(items)}
            return (
              <div class="col s12 m4"> 
              {items.accounts.map(item => {
                return (
                  <div class="card">
                    <span class="card-title">{item.official_name}</span>
                    <div class="card-content">
                      <p>Available: ${item.balances.available}</p>
                      <p>Current: ${item.balances.current}</p>
                    </div>
                  
                  </div>
                )      
              })}
              </div>
            )
          })
        }
        </div>

        <div>

        <button 
            class="button"
            >
          <Link class="edit_link" to={{
            pathname: '/transactioncal',
            state: { accessToken} // Pass arguments here
          }}
          >View Transactions</Link>
        </button>

        </div>
      </div>
    );
}

export default Home;
