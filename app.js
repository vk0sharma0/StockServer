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

// Configure axios with a timeout and retry mechanism
const axiosInstance = axios.create({
    timeout: 5000, // Timeout after 5 seconds
});

// Function to fetch data with retries
async function fetchDataWithRetry(url, retries = 3) {
    try {
        const response = await axiosInstance.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        return response.data;
    } catch (error) {
        if (retries > 0 && error.code === 'ETIMEDOUT') {
            console.warn(`Timeout occurred. Retrying... (${retries} retries left)`);
            return fetchDataWithRetry(url, retries - 1); // Retry
        } else {
            throw error; // Re-throw error if retries are exhausted or error is not a timeout
        }
    }
}

async function myfun() {
    try {
        const data = await fetchDataWithRetry('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY');
        jsonData = data;
        console.log(jsonData.records.timestamp);
    } catch (error) {
        console.error('Error fetching data:', error.message);
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
