const query = require("./utils/query");

const GET_CREDENTIALS = `
query{
  credentialByAppName(appName: "Appointment Scheduler"){
    appName
    token{
      access_token, 
      refresh_token
    }
  }
}
`;

exports.handler = async () => {
  const { data, errors } = await query(GET_CREDENTIALS);
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
    body: JSON.stringify({ token: data.credentialByAppName.token}),
  };
};
