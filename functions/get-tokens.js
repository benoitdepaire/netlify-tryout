//This function is called by Google after authentication and receives a GRANT code if authentication succeeded
//Next this function will retrieve the appropriate tokens to make API calls and store them in the Fauna DB
const {google} = require('googleapis');
require("dotenv").config();

const query = require("./utils/query");

// A query to get the internal ID of the credentials corresponding to a specific credientialID (which is our own ID)
// This is also used to check if such credential already exists.
// To indicate this string represents a query, we start by : query <name>(<variablename>:<variabletype>){}
// You can see this as the construction of a specific type of query function
// Do note that the variablename should start with a dollar sign
// Inside this function we call the query as it is defined by the GraphQL Scheme in our fauna db database. 
// This query receives one argument credentialId. We use our $-variable to pass in the value for which we are searching
// the credential. 
// Next, within curly brackets, we defined which parts of the output (a credential) we want to return (only the _id will suffice)
const GET_CREDENTIALS = `
query getToken($credentialId: String!){
  credentialByCredentialId(credentialId: $credentialId){
    refreshToken
  }
}
`;
  
// This is a query to create a new query
// First we create a mutation function which takes one variable of the type CredentialInput! (the ! signed is important)
// Internally, this function calls the createCredential query at the fauna db which has a single argument called data. 
// Between curly brackets we define the output after the credentials have been created
const CREATE_CREDENTIALS = `
mutation createCredentials($credentialInput: CredentialInput!){
  createCredential(data: $credentialInput){
    credentialId,
    appName,
    clientId,
    clientSecret,
    accessToken,
    refreshToken,
    scope,
    tokenType,
    expiryDate,
  }
}
`

// This is a query to update a new query
// First we create a mutation function which takes two variables. 
// A first variable represents the internal ID of the credential we want to update
// A second variable is of the type CredentialInput! (the ! signed is important). These are the new values
// Internally, this function calls the updateCredential query at the fauna db which has a single argument called data. 
// Between curly brackets we define the output after the credentials have been created

// const UPDATE_CREDENTIALS = `
// mutation updateCredential($id: ID!, $credentialInput: CredentialInput!){
//   updateCredential(id: $id, data: $credentialInput){
//     credentialId,
//     appName,
//     clientId,
//     clientSecret,
//     accessToken,
//     refreshToken,
//     scope,
//     tokenType,
//     expiryDate,
//   }
// }
// `


exports.handler = async (event, context) => {
  // This function is called by Google after the user granted access. We retreive the grant code from the 
  // GET Header
  let params = event.queryStringParameters;
  const GRANT_CODE = params.code;

  //retrieve sensitive data from .env (environment variables)
  const clientId = process.env.CLIENT_ID
  const clientSecret= process.env.CLIENT_SECRET
  const credentialId = "dummy2";
  const appName =  "Appointment Scheduler2";

  const REDIRECT_URIS= "http://localhost:9000/.netlify/functions/get-tokens"
  // const REDIRECT_URIS= "https://loving-dijkstra-1b1330.netlify.app/.netlify/functions/get-tokens"
  const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
  
  
  
  
  //Check if credential already exists
  //As variable pass a JSON object with 1 attribute. It is important that the name of this attribute matches
  //the variable name (with the dollar sign) defined in GET_CREDENTIALS (not the names used in the internal graphql query
  //inside fauna db!)
  const {data, errors} = await query(GET_CREDENTIALS, {credentialId})
  let cred = data.credentialByCredentialId
  console.log(cred)
  
  
  if(!cred){ //Credential Does not Exists
    // Get new credential tokens from Google 
    //Create an authentication client
    const AUTH_CLIENT = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URIS);
    //Request access and refresh code from Google with the authentication client
    let tokenObject = await AUTH_CLIENT.getToken(GRANT_CODE);
    console.log(tokenObject);
    
    // Prepare a CREDENTIAL_INPUT object to store in FAUNA_DB
    const accessToken = tokenObject.tokens.access_token
    const refreshToken = tokenObject.tokens.refresh_token ? tokenObject.tokens.refresh_token : null
    const scope = [].concat(tokenObject.tokens.scope); //this ensures it is always a list even if a string is returned
    const tokenType = tokenObject.tokens.token_type;
    const expiryDate = ''+tokenObject.tokens.expiry_date;

    const CREDENTIAL_INPUT = {
      credentialId,
      appName,
      clientId,
      clientSecret,
      accessToken,
      refreshToken,
      scope,
      tokenType,
      expiryDate
    }
    //console.log(tokenObject)

    //Make sure the attribute name matches the $-variable name of CREATE_CREDENTIALS
    VARS = {
      "credentialInput" : CREDENTIAL_INPUT
    }
    console.log(VARS)
    //Create new credential entry in Fauna DB
    cred = await query(CREATE_CREDENTIALS, VARS);
  }
  else { //Credentials already exist and stored
    console.log(cred);
  }


  // In this case, show the access token object. Should become: store the access token object
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "no-cache",
       "Content-Type": "text/html"
    },
    body: JSON.stringify({ cred })
  };
}