// My function in Lambda

export const handler = async (event) => {
    const queryParameter = event.queryStringParameters;
    const keyword = queryParameter.keyword;
  
    let response;
  
    if ('keyword' in queryParameter) {
      response = {
        statusCode: 200,
        body: JSON.stringify(`Nhu Nguyen says ${keyword}`)
      };
    } else {
      response = {
        statusCode: 400,
        body: JSON.stringify("The query parameter should be 'keyword'.")
      }
    }
  
    return response;
};

// My Function for the GET request

// const express = require('express');
// const app = express();
// const port = 3001;
// const axios = require("axios");
// const lambda_url = "https://4zphr5yzjewub5kapmbop3rf3e0tunun.lambda-url.us-east-2.on.aws/";

// app.get('/say', async (req, res) => {
//     try {
//         const keyword = req.query.keyword;
//         if (keyword) {
//             const response = await axios.get(`${lambda_url}?keyword=${keyword}`);
//             res.json(response.data);
//         } else {
//             res.json("The parameter must be 'keyword'");
//         }
//     } catch (error) {
//         res.status(500).json("There is an error");
//     }
// });

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });



  