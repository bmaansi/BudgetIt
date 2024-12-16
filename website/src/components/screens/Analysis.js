
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useEffect, useState, PureComponent } from 'react';
import "../../App.css";
import axios from 'axios';
import {db,auth} from "../../firebase/firebaseConfig"
import { collection, getDoc, setDoc, doc } from "firebase/firestore"; 
import {onAuthStateChanged } from "firebase/auth"; 
import { Bar, BarChart, Tooltip, CartesianGrid, Legend, YAxis, XAxis,ResponsiveContainer, Line, LineChart } from 'recharts';


//Calendar.momentLocalizer(moment);

const Analysis = () => {
    const [accessToken, setAccessToken] = useState([]);
   // const [d, setDate] = useState(new Date());
    const [MB, setMB] = useState([])
    const [allInfo, setAllInfo] = useState([])
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthName = monthNames[currentMonth];
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [barGraphData, setBarGraphData] = useState([]);
    const [lineGraphData, setLineGraph] = useState([]);
    const Headings = [
      "Monthly Breakdown",
      "Yearly Breakdown"
    ]
    

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
             
              Object.keys(data).forEach((AT) => {
                if (AT != "accessToken") {
                  tempArray.push({ 
                    AT: AT,
                    transactions: data[AT].transactions,
                  });
                }
              })

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

    const readDocMB = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const myCollection = collection(db, user.uid);
          //console.log(user.uid)
          const monthlyBudgetDoc = doc(myCollection, 'monthlyBudget');
      
          getDoc(monthlyBudgetDoc)
          .then(docSnap => {
            if (docSnap.exists()) {
              setMB(docSnap.data());
              //return docSnapMB.data();
            } else {
              console.log("No such document!");
            }
          })

        } else {
          console.log("ERROR getting user")
        }
      });




  }


  const barGraph = () => {
  
    let entertainment = 0;
    let restaurant = 0;
    let merchandise = 0;
    let groceries = 0;
    let services = 0;
    let housing = 0;
    let loan = 0;
    let healthcare = 0;
    let transportation = 0;
    let travel = 0;
    let other = 0;
    let MBother = parseInt(MB.other) + parseInt(MB.children) + parseInt(MB.insurance) + parseInt(MB.education);
    

    allInfo.forEach((data) => {
      data.transactions.transactions.added.filter(added => 
        new Date(added.date).getMonth() === currentMonth &&
        new Date(added.date).getFullYear() === currentYear
      ).forEach(added => {
        if (added.amount > 0) {
          if (added.personal_finance_category.primary == "ENTERTAINMENT") {
            entertainment += added.amount;
          } else if (added.personal_finance_category.primary == "FOOD_AND_DRINK") {
            restaurant += added.amount;
          } else if (added.personal_finance_category.primary == "GENERAL_MERCHANDISE") {   
            added.category.map(c => {
              if (c == "Supermarkets and Groceries") {
                groceries += added.amount;
              } else {
                merchandise += added.amount;
              }
            })
            
          } else if (added.personal_finance_category.primary == "GENERAL_SERVICES") {
            services += added.amount;         
          }else if (added.personal_finance_category.primary == "HOME_IMPROVEMENT" ||
                    added.personal_finance_category.primary == "RENT_AND_UTILITIES"
          ) {
            housing += added.amount;
            
          }else if (added.personal_finance_category.primary == "LOAN_PAYMENTS") {
            loan += added.amount;
            
          }else if (added.personal_finance_category.primary == "MEDICAL") {
            healthcare += added.amount;
            
          }else if (added.personal_finance_category.primary == "TRANSPORTATION") {
            transportation += added.amount;
            
          } else if (added.personal_finance_category.primary == "TRAVEL") {
            travel += added.amount;
            
          } else {
            other += added.amount;
          }
        }
        
        
        
      })
     })

    const barData = [
      {
        "name": "entertainment",
        "goal": MB.entertainment,
        "actual": entertainment 
      },
      {
        "name": "restaurant",
        "goal": MB.restaurant,
        "actual": restaurant
      },
      {
        "name": "groceries",
        "goal": MB.groceries,
        "actual": groceries
      },
      {
        "name": "merchandise",
        "goal": MB.merchandise,
        "actual": merchandise
      },
      {
        "name": "services",
        "goal": MB.services,
        "actual": services
      },
      {
        "name": "housing",
        "goal": MB.housing,
        "actual": housing,
      },
      {
        "name": "loan",
        "goal": MB.loans,
        "actual": loan,
      },
      {
        "name": "healthcare",
        "goal": MB.healthcare,
        "actual": healthcare,
      },
      {
        "name": "transportation",
        "goal": MB.transportation,
        "actual": transportation,
      },
      {
        "name": "travel",
        "goal": MB.travel,
        "actual": travel,
      },
      {
        "name": "other",
        "goal": MBother,
        "actual": (other),
      },
    ]
    setBarGraphData(barData)
    
  };
  
  const lineGraph = () => {
    let Jan = 0;
    let Feb = 0;
    let Mar = 0;
    let Apr = 0;
    let May = 0;
    let Jun = 0;
    let Jul = 0;
    let Aug = 0;
    let Sept = 0;
    let Oct = 0;
    let Nov = 0;
    let Dec = 0;

    if (allInfo != null) {
      allInfo.forEach((data) => {
        data.transactions.transactions.added.map(added => {
           
 
         const parsedDate = new Date(added.date);
         if (added.amount > 0) {
           if (parsedDate.getMonth() == 0) {
             Jan += added.amount;
           } else if (parsedDate.getMonth() == 1) {
             Feb += added.amount;
           } else if (parsedDate.getMonth() == 2) {
             Mar += added.amount;
           } else if (parsedDate.getMonth() == 3) {
             Apr += added.amount;
           } else if (parsedDate.getMonth() == 4) {
             May += added.amount;
           } else if (parsedDate.getMonth() == 5) {
             Jun += added.amount;
           } else if (parsedDate.getMonth() == 6) {
             Jul += added.amount;
           } else if (parsedDate.getMonth() == 7) {
             Aug += added.amount;
           } else if (parsedDate.getMonth() == 8) {
             Sept += added.amount;
           } else if (parsedDate.getMonth() == 9) {
             Oct += added.amount;
           } else if (parsedDate.getMonth() == 10) {
             Nov += added.amount;
           } else if (parsedDate.getMonth() == 11) {
             Dec += added.amount;
           }
         }
 
         
        })
      })
    }
    

    const lineGraph = [
      {
        "name": "Jan",
        "spent": Jan,
      },
      {
        "name": "Feb",
        "spent": Feb,
      },
      {
        "name": "Mar",
        "spent": Mar,
      },
      {
        "name": "Apr",
        "spent": Apr,
      },
      {
        "name": "May",
        "spent": May,
      },
      {
        "name": "Jun",
        "spent": Jun,
      },
      {
        "name": "Jul",
        "spent": Jul,
      },
      {
        "name": "Aug",
        "spent": Aug,
      },
      {
        "name": "Sept",
        "spent": Sept,
      },
      {
        "name": "Oct",
        "spent": Oct,
      },
      {
        "name": "Nov",
        "spent": Nov,
      },
      {
        "name": "Dec",
        "spent": Dec,
      },

    ]
    setLineGraph(lineGraph)
    
  };

  useEffect(()=> {
      async function fetch() {
        await readDoc();
        await readDocMB();
      }
      fetch();
    }, [])

    useEffect(()=> {
      barGraph();
      lineGraph();
    }, [openDropdownId, currentMonth])

    

    const barGraphDisplay = (() => {
      return (
      <div className="month-navigation">
              <button onClick={previousMonth}>{"<"}</button>
              <span> {currentMonthName} {currentYear} </span>
              <button onClick={nextMonth}>{">"}</button>

              <div>
                
              <ResponsiveContainer width="100%" height={400}>
              <BarChart width={730} height={250} data={barGraphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="goal" fill="#8884d8" />
                <Bar dataKey="actual" fill="#82ca9d" />
              </BarChart>
              </ResponsiveContainer>

              </div>
            </div>
      ) 
    })

    const lineGraphDisplay = (() => {
      return (
      <div> 
        <ResponsiveContainer width="100%" height={400}>
        <LineChart width={730} height={250} data={lineGraphData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="spent" stroke="#8884d8" />
        </LineChart>
        </ResponsiveContainer>

      </div>
      ) 
    })



    return (
      
      <div>            
        {[...Array(2)].map((_, index) => (
          <div>
            <h5 class='bankname_in_transaction'
              onClick={() => {
                toggleDropdown(index)
              }
              }
              >{                  
                (index == 0) ? (
                  Headings[index]
                ) : (
                  Headings[index]
                )
                }
              <i 
              class="material-icons prefix" 
              onClick={() => toggleDropdown(index)}>
                  {openDropdownId === index ? "keyboard_arrow_up" : "keyboard_arrow_down"}
              </i>
            </h5>

            {openDropdownId === index && (
              
              (index == 0) ? (
                barGraphDisplay()
              ) : (
                lineGraphDisplay()
              )
              
              
            )}
          </div>
        ))}

      </div>
           
    )

}


export default Analysis;