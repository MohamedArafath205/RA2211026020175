const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let numWin = [];

const API_ENDPOINTS = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibonacci",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/random",
};

// {"token_type":"Bearer","access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNDc3MTkxLCJpYXQiOjE3NDI0NzY4OTEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjRmZjE2YjM2LWQ5YzgtNDMzMS1hZTlkLTQwZjhjYzhkYmIzMyIsInN1YiI6Im1hMDk5OUBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiU1JNIElTVCBSYW1hcHVyYW0iLCJjbGllbnRJRCI6IjRmZjE2YjM2LWQ5YzgtNDMzMS1hZTlkLTQwZjhjYzhkYmIzMyIsImNsaWVudFNlY3JldCI6InpJVnFodGF2a1ZOZlRJQm4iLCJvd25lck5hbWUiOiJNIE1vaGFtZWQgQXJhZmF0aCIsIm93bmVyRW1haWwiOiJtYTA5OTlAc3JtaXN0LmVkdS5pbiIsInJvbGxObyI6IlJBMjIxMTAyNjAyMDE3NSJ9.8fkwtSOKU-5_pq3dsVn8oKb13-gapH-iE05A7GbgxTI","expires_in":1742477191}

const authToken = process.env.ACCESS_TOKEN;

const fetchNumbers = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `${authToken}` },
      timeout: 500,
    });
    if (response.data.numbers) {
      return response.data.numbers;
    }
  } catch (error) {
    console.log(`Error fetching from ${url}:`, error.message);
    return [];
  }
  return [];
};

app.get("/numbers/:numberid", async (req, res) => {
  const numberType = req.params.numberid;

  if (!API_ENDPOINTS[numberType]) {
    return res
      .status(400)
      .json({ error: "Invalid number type. Use 'p', 'f', 'e', or 'r'." });
  }

  const apiUrl = API_ENDPOINTS[numberType];
  const newNumbers = await fetchNumbers(apiUrl);

  newNumbers.forEach((num) => {
    if (!numWin.includes(num)) {
      numWin.push(num);
    }
  });

  if (numWin.length > WINDOW_SIZE) {
    numWin = numWin.slice(-WINDOW_SIZE);
  }

  const average =
    numWin.length > 0
      ? (numWin.reduce((sum, num) => sum + num, 0) / numWin.length).toFixed(2)
      : 0;

  res.json({
    windowPrevState: [...numWin],
    windowCurrState: numWin,
    numbers: newNumbers,
    avg: parseFloat(average),
  });
});

app.listen(PORT, () => {
  console.log(`Server Runnning...`);
});
