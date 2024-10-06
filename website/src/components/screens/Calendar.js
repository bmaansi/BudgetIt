import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useEffect, useState } from 'react';
import "../../App.css";
import axios from 'axios';
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, setDoc, getDoc, doc } from "firebase/firestore"; 
import {onAuthStateChanged } from "firebase/auth"; 


const TransactionCalendar = () => {
    const [accessToken, setAccessToken] = useState([]);
   // const [d, setDate] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [transactions, setTransaction] = useState([])

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

    const fetchTransactions = async (date) => {
        const lastdate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const end_date = lastdate.toISOString().split('T')[0]
        const start_date = date.toISOString().split('T')[0];
        
        // console.log(end_date)
        // console.log(start_date)
      async function fetch(AT) {
        try {
          let transactions = await axios.post(
            '/transactions/get', 
            {
              access_token: AT,
              start_date: start_date,
              end_date: end_date
            }
          );
          console.log(transactions.data)
          setTransaction([transactions.data]);

          //setUsers((prevUsers) => [...prevUsers, newUser]);
          
          
        } catch (error) {
          console.error("Error fetching account: ", error);
        }
      }
      accessToken.forEach(fetch);
    }

    const handleActiveStartDateChange = ({ activeStartDate }) => {

        fetchTransactions(activeStartDate);
      };

  

      
    useEffect(()=> {
        async function fetch() {
          await readDoc();
        }
        fetch();
      }, [])

    return (
        <div class='row'>
            <div class='col s12 m4'>
           <Calendar
            onChange={setDate}
            value={date}
            onActiveStartDateChange={handleActiveStartDateChange}
            > 
           </Calendar>
           </div>
           <div class='col s12 m4'>
           {
          //<p>{item.accounts[0].account_id}</p>
          transactions?.map(items => {
            {console.log(items)}
            return (
              <div> 
              {items.map(item => {
                return (
                  <div class="card">
                    <span class="card-title">{item.name}</span>
                    <div class="card-content">
                      <p>Amount Paid: ${item.amount} {item.iso_currency_code}</p>
                      <p>Date of: {item.authorized_date}</p>
                      <p>Payment method: {item.payment_channel}</p>
                      <p>{item.website}</p>
                      

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

export default TransactionCalendar;