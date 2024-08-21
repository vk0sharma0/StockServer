
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3002;

// Set up CORS options
const corsOptions = {
    origin: '*',
    methods: 'GET',
    allowedHeaders: 'Content-Type',
};

app.use(cors(corsOptions));

let jsonData = {};  // Variable to store the fetched data

async function myfun() {
    try {
        const response = await axios.get(`https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        jsonData = response.data;

        console.log(jsonData.records.timestamp);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Define the route to get the data
app.get('/data', async (req, res) => {
    try {
        res.send(jsonData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define the root route
app.get('/', (req, res) => {
    try {
        res.send("Server is running.......");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Set interval to fetch data every 10 seconds
setInterval(() => {
    myfun();
}, 10000);

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
