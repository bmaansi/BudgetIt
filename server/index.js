const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")

const app = express();
app.use(cors());
app.use(express.json());

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
      products: ['auth','transactions','identity'],
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
      throw error
    }
  });

app.post('/transactions/get', async function (request, response) {
  const userInfo = TransactionsGetRequest = {
    access_token: request.body.access_token,
    start_date: request.body.start_date,
    end_date: request.body.end_date
  };
  try {
    const res = await plaidClient.transactionsGet(userInfo);
    let transactions = res.data.transactions;
    response.json(transactions);

    //const total_transactions = response.data.total_transactions;
    // Manipulate the offset parameter to paginate
    // transactions and retrieve all available data
    // while (transactions.length < total_transactions) {
    //   const paginatedRequest =  TransactionsGetRequest = {
    //     access_token: request.body.access_token,
    //     start_date: request.body.start_date,
    //     end_date: request.body.end_date,
    //     options: {
    //       offset: transactions.length
    //     },
    //   };
    //   const paginatedResponse = await client.transactionsGet(paginatedRequest);
    //   transactions = transactions.concat(
    //     paginatedResponse.data.transactions,
    //   );
    // }

  } catch (error) {
    throw error
  }

});
  

  
  app.post('/exchange_public_token', async function (
    request,
    response,
    next,
  ) {
    //console.log(request.body.public_token);
    const publicToken = request.body.public_token;
    if (!publicToken) {
      return response.status(400).json({ error: "Public token is missing" });
    }
    try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      const accessToken = plaidResponse.data.access_token;
      //const itemID = plaidResponse.data.item_id;
      //console.log(accessToken)
      //response.json( public_token_exchange: 'complete');
      response.json(accessToken);

    } catch (error) {
      throw error;
    }
  });


  app.post('/accounts', async function (request, response) {
    const accessToken = request.body.access_token;
    try {
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });
      //prettyPrintResponse(accountsResponse);
      response.json(accountsResponse.data);
    } catch (error) {
      //prettyPrintResponse(error);
      throw error
    }
  });

app.get("/hello",(request, response) => {
    response.json({message: "hello world"});
}); 

app.listen(8000, () => {
    console.log("server has started")
})