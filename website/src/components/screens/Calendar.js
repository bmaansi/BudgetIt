
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useEffect, useState } from 'react';
import "../../App.css";
import axios from 'axios';
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, setDoc, getDoc, doc } from "firebase/firestore"; 
import {onAuthStateChanged } from "firebase/auth"; 

const localizer = momentLocalizer(moment)
//Calendar.momentLocalizer(moment);

const TransactionCalendar = () => {
    const [accessToken, setAccessToken] = useState([]);
   // const [d, setDate] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [transactions, setTransaction] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthName = monthNames[currentMonth];
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const toggleDropdown = (id) => {
      setOpenDropdownId(openDropdownId === id ? null : id);
    };

        // Function to go to the previous month
    const previousMonth = () => {
      if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(prevYear => prevYear - 1);
      } else {
          setCurrentMonth(prevMonth => prevMonth - 1);
      }
    };
  
      // Function to go to the next month
    const nextMonth = () => {
      if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear(prevYear => prevYear + 1);
      } else {
          setCurrentMonth(prevMonth => prevMonth + 1);
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
              //console.log(data)
              Object.keys(data).map((AT) => {
                //console.log(data[AT].transactions.transactions)
                tempArray.push(data[AT].transactions)
              })
             
              setTransaction(tempArray)
  
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

    useEffect(()=> {
        async function fetch() {
          await readDoc();
        }
        fetch();
      }, [])

    return (
           <div>
            {/* <Calendar 
            localizer={localizer} 
            selectable={true} 
            startAccessor="start" 
            endAccessor="end" 
            style={{ height: 500, margin: "50px" }} 
            /> */}
              <div class="update_button">
              <button class="button">
                Update
              </button> 
              </div>
                           
                {
                  transactions?.map(items => {
                    
                    return (
                      <div>
                        {items.infoArray.map(item =>
                        
                           <div>
                            {console.log(item)}
                            <div class="row">
                              <h5>{item.name}</h5>

                              <i 
                              class="material-icons prefix" 
                              onClick={() => toggleDropdown(item.account_id)}>
                                  {openDropdownId === item.account_id ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                              </i>

                           </div>
                           {openDropdownId === item.account_id && (
                            <div class='dropdown'>
                              <div className="month-navigation">
                                  <button onClick={previousMonth}>{"<"}</button>
                                  <span>{currentMonthName} {currentYear}</span>
                                  <button onClick={nextMonth}>{">"}</button>
                              </div>
                              <div class='row'>
                               <div class="col s12 m6" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                   {items.transactions.added
                                       .filter(added => 
                                        added.account_id === item.account_id &&
                                        new Date(added.date).getMonth() === currentMonth &&
                                        new Date(added.date).getFullYear() === currentYear
                                      )
                                       .map(added => (
                                           <div class="card">
                                               <h6>{added.name} - {added.date}</h6>
                                               <p>{added.personal_finance_category.primary}</p>
                                               <p>Payment Channel: {added.payment_channel}</p>   
                                               <p>${added.amount}</p>  
                                           </div>
                                       ))
                                   }
                               </div>
                               </div>
                               </div>
                           )}
                       </div>

                        )}
                      </div>
                    ) 
                    
                })}
          
          
           {
            // transactions?.map(items => {
            // items.map(item=>{
            //   item.infoArray.map(i=>{

            //   })
            // })
            
            // return (
            //   <div class='col s12 m4'>
            //     {items.map(item => {
            //       return (
            //         <div>
            //       {item.added.map(added => {
            //           return (
            //             <div class="card">
            //               <span class="card-title">{added.name}</span>
            //               <div class="card-content">
            //                 <p>Amount Paid: ${added.amount} {added.iso_currency_code}</p>
            //                 <p>Date of: {added.authorized_date}</p>
            //                 <p>Payment method: {added.payment_channel}</p>
            //                 <p>{added.website}</p>
                            
      
            //               </div>
            //             </div>
            //           )
                  
                    
                    
            //       })}
            //       </div>
            // )
            //     })}
            //     </div>
            // )
          //}
          //)
        }
           </div>
           
    )

}


export default TransactionCalendar;