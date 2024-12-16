
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useEffect, useState, PureComponent } from 'react';
import "../../App.css";
import axios from 'axios';
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, getDoc, setDoc, doc } from "firebase/firestore"; 
import {onAuthStateChanged } from "firebase/auth"; 
//import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';


const localizer = momentLocalizer(moment)
//Calendar.momentLocalizer(moment);

const TransactionCalendar = () => {
    const [accessToken, setAccessToken] = useState([]);
   // const [d, setDate] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [allInfo, setAllInfo] = useState([])
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthName = monthNames[currentMonth];
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [pieData, setPieData] = useState([]);
    

    let filtered = [];
    const [showChart, setShowChart] = useState(false);
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#d0ed57', '#a4de6c']; 

    const toggleDropdown = (id) => {
      setOpenDropdownId(openDropdownId === id ? null : id);
    };

        
    const previousMonth = () => {
      if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(prevYear => prevYear - 1);
      } else {
          setCurrentMonth(prevMonth => prevMonth - 1);
      }
    };
  
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
              
              const tempArray = Object.keys(data).map((AT) => ({
                AT, // Store the AT key
                transactions: data[AT].transactions,
              }));

             
              setAllInfo(tempArray)
  
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

    const updateUserData = async (accessToken, transactions) => {
      try {
        const currentUser = auth.currentUser;
        const myCollection = collection(db, currentUser.uid);
        const tokenDoc = doc(myCollection, 'accessToken');
    
        const docSnapshot = await getDoc(tokenDoc);
        if (!docSnapshot.exists()) {
          throw new Error("Document does not exist");
        }
        const data = docSnapshot.data();
        data[accessToken].transactions.transactions = transactions;
        await setDoc(tokenDoc, data);

      } catch (error) {
        console.log(error);
      }
    };
    
    const fetchTransactions = async (AT, cursor) => {
      try {
        let transactions = await axios.post(
          '/transactions/sync', 
          {
            access_token: AT,
            cursor: cursor
          }
        );
        const response = transactions.data
        //console.log(response)
        return response
        
      } catch (error) {
        throw error
      }
  }

  const loopTransactions = () => {
    console.log(allInfo)
    allInfo.forEach(async (item) => {
      let date = new Date();
      let writtenDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
      if (item.transactions.transactions.date != writtenDate) {
        try {

          const res = await fetchTransactions(item.AT, item.transactions.transactions.cursor)
          console.log(res)
          //item.transactions.transactions.cursor = res.cursor
          const combinedTransactions = [
            ...item.transactions.transactions.added,
            ...res.modified,
          ];
  
          combinedTransactions.sort((a, b) =>  new Date(b.date)- new Date(a.date));
          //console.log(combinedTransactions)
          item.transactions.transactions.cursor = res.cursor
          item.transactions.transactions.added = combinedTransactions
          updateUserData(item.AT, item.transactions.transactions)
          
  
        } catch (error) {
          console.log(error)
        }
      }
      
      
    })
  }

  const pieChart = () => {
    const categoryMap = new Map();
    filtered.forEach((item) => {
      const primary = item.personal_finance_category.primary;
      const amount = item.amount;
  
      if (amount > 0) { 
        if (categoryMap.has(primary)) {
          categoryMap.set(primary, categoryMap.get(primary) + amount);
        } else {
          categoryMap.set(primary, amount);
        }
      }
    });
    const result = Array.from(categoryMap, ([name, value]) => ({ name, value }));
    setPieData(result); // Update filtered state with the pie chart data
    setShowChart(true); // Show the chart
  };
  
  const barGraph = () => {
    const categoryMap = new Map();
    filtered.forEach((item) => {
      const primary = item.personal_finance_category.primary;
      const amount = item.amount;
  
      if (amount > 0) { 
        if (categoryMap.has(primary)) {
          categoryMap.set(primary, categoryMap.get(primary) + amount);
        } else {
          categoryMap.set(primary, amount);
        }
      }
    });
    const result = Array.from(categoryMap, ([name, value]) => ({ name, value }));
    setPieData(result); // Update filtered state with the pie chart data
    setShowChart(true); // Show the chart
  };

    useEffect(()=> {
      async function fetch() {
        await readDoc();
      }
      fetch();
      loopTransactions();
    }, [])


    useEffect(()=> {
      pieChart();
    }, [openDropdownId, currentMonth])

    return (
      <div>           
      {
        allInfo?.map(data => {
          return (
            <div>
              {data.transactions?.infoArray?.map(item =>
            
                  <div>
                  <div>
                    <h5 class='bankname_in_transaction'
                    onClick={() => {
                      toggleDropdown(item.account_id)
                      console.log(item)
                    }
                    }
                    >{
                      
                      (item.official_name == null) ? (
                        item.name
                      ) : (
                        item.official_name
                      )
                      }
                    <i 
                    class="material-icons prefix" 
                    onClick={() => toggleDropdown(item.account_id)}>
                        {openDropdownId === item.account_id ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                    </i>
                    </h5>

                  
                  </div>
                  {openDropdownId === item.account_id && (
                  <div class='dropdown_countainer'>
                    <div className="month-navigation">
                        <button onClick={previousMonth}>{"<"}</button>
                        <span>{currentMonthName} {currentYear}</span>
                        <button onClick={nextMonth}>{">"}</button>
                    </div>
                    <div class='row' style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div  div style={{ flex: 1, maxHeight: '400px', overflowY: 'auto' }}>
                          {data.transactions.transactions.added
                              .filter(added => 
                              added.account_id === item.account_id &&
                              new Date(added.date).getMonth() === currentMonth &&
                              new Date(added.date).getFullYear() === currentYear
                            )
                              .map(added => (
                              filtered.push(added),
                                  <div class="card">
                                    
                                    
                                      <h6>{added.name} - {added.date}</h6>
                                      <p>{added.personal_finance_category.primary}</p>
                                      <p>Payment Channel: {added.payment_channel}</p>   
                                      <p>${added.amount}</p>  
                                  </div>
                              ))
                          }
                          
                      </div>
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '10px' }}>
                          {showChart && (
                            
                          <ResponsiveContainer width="100%" height={400}>
                          <PieChart>
                            <Pie
                              dataKey="value"
                              isAnimationActive={false}
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              label={({ name, value }) => `${name} $(${value})`}
                            >
                              {pieData?.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            </Pie>
                            
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        )}
                        </div>
                      </div>
                      <div> 
                      

                      </div>
                      </div>
                  )}
              
              </div>
              

              )}
            </div>
          ) 
          
      })}
    
      </div>
           
    )

}


export default TransactionCalendar;