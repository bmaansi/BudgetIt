import React, { useEffect, useState } from 'react';
import "../../App.css";
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, deleteField, getDoc, updateDoc, doc, arrayRemove  } from "firebase/firestore"; 
import { onAuthStateChanged, signOut } from "firebase/auth"; 
import {Link, useNavigate} from "react-router-dom";


// import { readAccessToken } from "../../firebase/fireStorage";




axios.defaults.baseURL = "http://localhost:8000"

const Home = () => {

  const [linkToken, setLinkToken] = useState();
  // const [PublicToken, setPublicToken] = useState();
  const [accessToken, setAccessToken] = useState(null);
  const [accountFB, setAccountFB] = useState([])
  const [openDropdownId, setOpenDropdownId] = useState(false);
  const nav = useNavigate();

  let checkings = 0;
  let credit = 0;
  let debt = 0;
  let loan = 0;
  let investments = 0;
  let savings = 0;

  const toggleDropdown = () => {
    setOpenDropdownId(openDropdownId === true ? false : true);
  };



const updateUserData = async (accessToken, account, transactions) => {
    
  try {
    const currentUser = auth.currentUser;
    const myCollection = collection(db, currentUser.uid);
    const tokenDoc = doc(myCollection, 'accessToken');
    
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
              if (AT != "accessToken") {
                tempArray.push({ 
                  info: data[AT].account,
                  AT: AT
                });
              }
              

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
          try {
            const account = await fetchAccount(accessToken);
            const transactions = await fetchTransactions(accessToken);
            
            let infoArray = [];
            if (account && transactions) {
              account.forEach(element => {
                let name;
                if (element.official_name == null) {
                  name = element.name;
                } else {
                  name = element.official_name
                }
                const tempInfo = {
                  name: name,
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
          let date = new Date();
          let writtenDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
          const response = {
            ...transactions.data,
            date: writtenDate, 
          };
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

   

    const delField = async (fieldName) => {
      try {
        const currentUser = auth.currentUser;
        const myCollection = collection(db, currentUser.uid);
        const tokenDoc = doc(myCollection, 'accessToken');

        await updateDoc(tokenDoc , {
          [fieldName]: deleteField(),
        });
    
        console.log(`Document has been deleted.`);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    };

    const removeAccount = async (fieldName, targetId) => {
      const currentUser = auth.currentUser;
      const myCollection = collection(db, currentUser.uid);
      const docRef = doc(myCollection, 'accessToken');
      
    
      try {
        const docSnap = await getDoc(docRef);
        const fieldValue = docSnap.get(fieldName);
    
        if (docSnap.exists()) {
          //const data = docSnap.data();
          
          const account = fieldValue.account;
          const transactionInfo = fieldValue.transactions.infoArray;
          const transaction = fieldValue.transactions.transactions.added;
          //console.log(transaction)
    
          const updatedAccount = fieldValue.account.filter(item => item.account_id !== targetId);
          const updatedTransactionInfo = fieldValue.transactions.infoArray.filter(item => item.account_id !== targetId);
          const updatedTransaction = fieldValue.transactions.transactions.added.filter(item => item.account_id !== targetId);

          const updatedFieldValue = {
            ...fieldValue,
            account: updatedAccount,
            transactions: {
              ...fieldValue.transactions,
              infoArray: updatedTransactionInfo,
              transactions: {
                ...fieldValue.transactions.transactions,
                added: updatedTransaction,
              },
            },
          };

          await updateDoc(docRef, {
            [fieldName]: updatedFieldValue,
          });


        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error removing object:", error);
      }
      window.location.reload();
    };

 
    return (
      
      <div class="home_page">
        <div>
        {
          
        (accountFB.length === 0) ? (
          <div>
            <h5>To get started click the add button to the right</h5> 
          </div>
        ) : (
          <div>
            {
               accountFB?.map(items => {
                return (
                  <div>
                    {items.info?.map(item => {
                      if(item.subtype == "checking") {
                        if (item.balances.available != null) {
                          checkings += parseInt(item.balances.available)
                        }
                      }
                      else if(item.subtype == "credit card") {
                        if (item.balances.current != null) {
                          debt += parseInt(item.balances.current)
                        }
                        if (item.balances.available != null) {
                          credit += parseInt(item.balances.available)
                        } else {
                          credit += (item.balances.limit - item.balances.current)
                        }
                      } else if(item.type == "loan") {
                        if (item.balances.current != null){
                          loan += parseInt(item.balances.current)
                        }  
                      } else if(item.type == "investment") {
                        if (item.balances.current != null){
                          investments += parseInt(item.balances.current)
                        }  
                      } else if(item.subtype == "savings") {
                        if (item.balances.available != null){
                          savings += parseInt(item.balances.available )
                        }  
                      }
                    })}
                  </div>
                )
              })
            }
            
            <div class="summary">
            <h5 class='bankname_in_transaction'
              onClick={() => {toggleDropdown()}
              }
              >Summary
              <i 
              class="material-icons prefix" 
              onClick={() => toggleDropdown()}>
                  {openDropdownId === true ? "keyboard_arrow_up" : "keyboard_arrow_down"}
              </i>
            </h5>

            {openDropdownId === true && (
              <ul>
                <li>Available balance in checkings: ${checkings}</li>
                <li>Available balance in credit card: ${credit}</li>
                <li>Total credit card debt: ${debt}</li>
                <li>Total loan to pay off: ${loan}</li>
                <li>Total investments: ${investments}</li>
                <li>Total savings: ${savings}</li>

              </ul>
            )}
              
            </div>

            <div class="row">
        {
          accountFB?.map(items => {
            // console.log(items)
            return (
              <div >
                {items.info?.map(item => {
                 
                   return (
                    <div class="col s6">
                  <div class="card">
                    <span class="card-title">
                     {
                      (item.official_name == null) ? (
                        item.name
                      ) : (
                        item.official_name
                      )
                    }
                      
                    </span>
                    
                    <div class="card-content">
                      
                      <p>Available: ${item.balances.available}</p>
                      <p>Current: ${item.balances.current}</p>
                      {/* <p>Type {item.type}</p>
                      <p>SubType {item.subtype}</p> */}
                      {
                        (item.subtype == "credit card") ? (
                          <p>Limit: ${item.balances.limit}</p>
                        ) : (
                          <p></p>
                        )
                      }


                      
                    </div>
                    <i class="material-icons prefix"
                    onClick={() => {
                      if (items.info.length > 1) {
                        removeAccount(items.AT, item.account_id)
                        
                      } else {
                        delField(items.AT)
                      }
           
                    }
                    }
                    >delete</i>
                  
                  </div>
                  </div>
                )
                })}
              </div>
            )
          })
        }
        </div>


            
          </div>
        )
        }

        </div>
        <div class="floating_add_button_cont">
          <button 
          class="floating_add"
        className="btn-floating btn-large waves-effect waves-light #000000 black"
        onClick={() => open()} disabled={!ready}
        ><i class="material-icons">add</i></button>
        </div>
        

        <div class="input-field col s3">
          <button class="button"
          onClick={() => {
            signOut(auth)
            nav("/login")
          }}
          >LOG OUT
            
          </button>
        </div>
      </div>
    );
}

export default Home;
