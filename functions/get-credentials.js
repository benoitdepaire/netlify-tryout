const query = require("./utils/query");

const GET_CREDENTIALS = `
query getToken($credentialId: String!){
  credentialByCredentialId(credentialId: $credentialId){
    access_token: accessToken
    refresh_token: refreshToken
    scope
    token_type : tokenType
    expiry_date : expiryDate
  }
}
`;

exports.handler = async () => {
  const VARS = {"credentialId" : "Appointment Scheduler dummy1"}
  const { data, errors } = await query(GET_CREDENTIALS, VARS);
  console.log("this point reached");
  console.log(data);

  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ token: data.credentialByCredentialId}),
  };
};
