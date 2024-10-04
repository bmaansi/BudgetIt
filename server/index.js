const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")

const app = express();
app.use(cors());

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': "66d2239160b266001abadd94",
      'PLAID-SECRET': "464a258f385eb55e6defeb9f382933",
    },
  },
});

const plaidClient = new PlaidApi(configuration);

app.post('/create_link_token', async function (request, response) {
    //Get the client_user_id by searching for the current user
    //const user = await User.find(...);
    //const clientUserId = user.id;

    
    const plaidRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        //client_user_id: clientUserId,
        client_user_id: "user"
      },
      client_name: 'Plaid Test App',
      products: ['auth'],
      language: 'en',
      //webhook: 'https://webhook.example.com',
      redirect_uri: 'http://localhost:3000/',
      country_codes: ['US'],
    };
    try {
      const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
      response.json(createTokenResponse.data);
    } catch (error) {
      // handle error
      console.log(error)
    }
  });


  
  app.post('/exchange_public_token', async function (
    request,
    response,
    next,
  ) {
    console.log(request.body.public_token);
    const publicToken = request.body.public_token;
    if (!publicToken) {
      return response.status(400).json({ error: "Public token is missing" });
    }
    try {
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      const accessToken = response.data.access_token;
      const itemID = response.data.item_id;
  
      res.json({ public_token_exchange: 'complete' });
      res.json({ accessToken});

    } catch (error) {
      throw error;
    }
  });


app.get("/hello",(request, response) => {
    response.json({message: "hello world"});
}); 

app.listen(8000, () => {
    console.log("server has started")
})