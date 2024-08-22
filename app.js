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

// Configure axios with a timeout
const axiosInstance = axios.create({
    timeout: 5000, // Timeout after 5 seconds
});

// Function to fetch data with retries and specific headers
async function fetchDataWithRetry(url, retries = 3) {
    try {
        const response = await axiosInstance.get(url, {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                'Host': 'www.nseindia.com',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'cross-site',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0',
            }
        });
        return response.data;
    } catch (error) {
        if (retries > 0 && (error.code === 'ETIMEDOUT' || error.response?.status === 403)) {
            console.warn(`Retrying... (${retries} retries left)`);
            return fetchDataWithRetry(url, retries - 1); // Retry
        } else {
            throw error; // Re-throw error if retries are exhausted or it's not a retryable error
        }
    }
}

async function myfun() {
    try {
        // Using CORS Anywhere proxy
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY';
        const data = await fetchDataWithRetry(proxyUrl + targetUrl);
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

// Set interval to fetch data every 30 seconds
setInterval(() => {
    myfun();
}, 30000);  // Reduced frequency to avoid being blocked

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
