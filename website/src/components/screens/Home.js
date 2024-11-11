import React, { useEffect, useState } from 'react';
import "../../App.css";
import { usePlaidLink } from 'react-plaid-link';
import fetchLinkToken from '../../utils/Actions';
import axios from 'axios';
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, setDoc, getDoc, updateDoc, doc } from "firebase/firestore"; 
import {onAuthStateChanged } from "firebase/auth"; 
import {Link} from "react-router-dom";
// import { readAccessToken } from "../../firebase/fireStorage";




axios.defaults.baseURL = "http://localhost:8000"

const Home = () => {

  const [linkToken, setLinkToken] = useState();
  // const [PublicToken, setPublicToken] = useState();
  const [accessToken, setAccessToken] = useState(null);
  const [accessToken2, setAccessToken2] = useState();

  const [account, setAccount] = useState([])
  const [accountFB, setAccountFB] = useState([])

  const [user, setUser] = useState();
  const [transactions, setTransaction] = useState([])
  const [transactions2, setTransaction2] = useState({})



const updateUserData = async (accessToken, account, transactions) => {
    
  try {
    const currentUser = auth.currentUser;
    const myCollection = collection(db, currentUser.uid);
    const tokenDoc = doc(myCollection, 'accessToken');
    //console.log("ACCESS TOKEN ", accessToken);
    // const AT = {
    //   [accessToken]: {
    //     account: account,
    //     transactions: transactions
    //   }
    // }
    const AT = new Map();
    AT.set(accessToken, {
      account: account,
      transactions: transactions
    });

    const ATObj = Object.fromEntries(AT);

    await updateDoc(tokenDoc, ATObj);

    //await setDoc(tokenDoc, AT);

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
        const tempArray = []
    
        getDoc(tokenDoc)
        .then(docSnap => {
          if (docSnap.exists()) {
            const data = docSnap.data()
            Object.keys(data).forEach((AT) => {
              tempArray.push(data[AT].account);

            })
            setAccountFB(tempArray)
            

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
      readDoc();
      async function fetch() {
        try {
          let response = await axios.post(
            "/create_link_token", 
            //{uid: auth.currentUser.uid}
          );
          setLinkToken(response.data.link_token);
        } catch (error) {
          console.log("ERROR fetching link token: ", error);
        }
      }
      fetch();

    }, [])

    useEffect(() => {
      const fetchData = async () => {
        if (accessToken) {
          console.log("IN HERE")
          try {
            const account = await fetchAccount(accessToken);
            const transactions = await fetchTransactions(accessToken);
            
            let infoArray = [];
            if (account && transactions) {
              account.forEach(element => {
                const tempInfo = {
                  name: element.official_name,
                  account_id: element.account_id
                };
                infoArray.push(tempInfo)
              }                 
            )

            

              const transactionsAndInfo = {
                transactions, 
                infoArray
              }
              updateUserData(accessToken, account, transactionsAndInfo);
              console.log("IN HERE 2")
              
              setAccessToken(null);
              //setAccount([]);
              //setTransaction([]);
            }
          } catch (error) {
            console.error('Error fetching account or transactions:', error);
          }
        }
      };
    
      fetchData();
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
          //console.log(accessToken.data)
          setAccessToken(accessToken.data.access_token)
          
        } catch (error) {
          console.error("Error exchanging token:", error);
        }
      }
      fetchData();
      }
    });

    const fetchTransactions = async (AT) => {
        try {
          let transactions = await axios.post(
            '/transactions/sync', 
            {
              access_token: AT,
              cursor: null
            }
          );
          const response = transactions.data
          return response
          
          //setTransaction((pre) => [...pre, transactions.data]);

          //setUsers((prevUsers) => [...prevUsers, newUser]);
        } catch (error) {
          console.error("Error fetching account: ", error);
          throw error
        }
    }


    const fetchAccount = async (AT) => {
      //async function fetch(AT) {
        try {
          let accountInfo = await axios.post(
            '/accounts', 
            {access_token: AT}
          );
          //setUsers((prevUsers) => [...prevUsers, newUser]);
          //setAccount((pre) => [...pre, accountInfo.data]);
          //console.log(accountInfo.data)
          //fetchTransactions(AT)
          const response = accountInfo.data.accounts
          return response
          
        } catch (error) {
          console.error("Error fetching account: ", error);
          throw error
        }
      //}
      //accessToken.forEach(fetch);
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
          accountFB?.map(items => {
            return (
              <div class='col s12 m4'>
                {items.map(item => {
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
