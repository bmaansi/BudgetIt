import React, { useEffect, useState } from 'react';
import "../../App.css";
import { usePlaidLink } from 'react-plaid-link';
import fetchLinkToken from '../../utils/Actions';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8000"


// function PlaidAuth({publicToken}) {
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         let accessToken = await axios.post(
//           '/exchange_public_token', 
//           {public_token: publicToken}
//         );
        
//         console.log("Access token data: ", accessToken.data);
//       } catch (error) {
//         console.error("Error exchanging token:", error);
//       }
//     }
//     fetchData();
//   }, []);
//   return (
//     <span>
//       {publicToken}
//     </span>
//     )
// }


const Home = () => {

    const [linkToken, setLinkToken] = useState();
    const [PublicToken, setPublicToken] = useState();
    useEffect(()=> {
      async function fetch() {
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
  
    const { open, ready } = usePlaidLink({
      token: linkToken,
      onSuccess: (public_token, metadata) => {
        setPublicToken(public_token);
        console.log("PUBLIC TOKEN", public_token);
      },
    });

    
    return ( //PublicToken ? (<PlaidAuth publicToken={PublicToken}/>) :(
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
        

      </div>
    );
}

export default Home;
