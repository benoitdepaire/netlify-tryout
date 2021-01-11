const {google} = require('googleapis');
require("dotenv").config();

const query = require("./utils/query");

const GET_CREDENTIALS = `
query getToken($credentialId: String!){
  credentialByCredentialId(credentialId: $credentialId){
    _id
  }
}
`;
  
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
const UPDATE_CREDENTIALS = `
mutation updateCredential($id: ID!, $credentialInput: CredentialInput!){
  updateCredential(id: $id, data: $credentialInput){
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

exports.handler = async (event, context) => {
  // This function is called by Google after the user granted access. We retreive the grant code from the 
  // GET Header
  let params = event.queryStringParameters;
  const GRANT_CODE = params.code;


  const CLIENT_ID = process.env.CLIENT_ID
  const CLIENT_SECRET= process.env.CLIENT_SECRET


  
  const REDIRECT_URIS= "http://localhost:9000/.netlify/functions/get-tokens"
  // const REDIRECT_URIS= "https://loving-dijkstra-1b1330.netlify.app/.netlify/functions/get-tokens"
  const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
  //Create an authentication client
  const AUTH_CLIENT = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS);
  //Request access and refresh code from Google with the authentication client
  let tokenObject = await AUTH_CLIENT.getToken(GRANT_CODE);
  const credentialId = "dummy2";
  const appName =  "Appointment Scheduler2";
  const clientId = CLIENT_ID;
  const clientSecret = CLIENT_SECRET
  const accessToken = tokenObject.tokens.access_token
  const refreshToken = tokenObject.tokens.refresh_token ? tokenObject.tokens.refresh_token : null
  const scope = [].concat(tokenObject.tokens.scope);
  const tokenType = tokenObject.tokens.token_type;
  const expiryDate = ''+tokenObject.tokens.expiry_date;
  //console.log(tokenObject)

  //Write to fauna
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
  

  //Check if credential already exists
  const {data, errors} = await query(GET_CREDENTIALS, {credentialId})
  let cred = data.credentialByCredentialId
  console.log(cred)

  
  if(!cred){ //Credential Does not Exists

    VARS = {
      "credentialInput" : CREDENTIAL_INPUT
    }
    console.log(VARS)
    const { data, errors } = await query(CREATE_CREDENTIALS, VARS);
  
    console.log("data");
    console.log(data);
    console.log("errors");
    console.log(errors);
  }
  else {
    VARS = {
      "id": cred._id,
      "credentialInput": CREDENTIAL_INPUT
    }
    console.log(VARS)
    const { data, errors} = await query(UPDATE_CREDENTIALS, VARS);
    console.log("data");
    console.log(data);
    console.log("errors");
    console.log(errors);
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
    body: JSON.stringify({ tokenObject })
  };
}