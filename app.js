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
                X-Firefox-Spdy: h2
access-control-allow-headers: Content-Type
access-control-allow-methods: GET,POST
access-control-allow-origin: beta.nseindia.com, nseindia.com
content-encoding: gzip
content-length: 91313
content-security-policy: font-src *; default-src 'self' *; img-src * data: https://www.google.co.in https://www.google-analytics.com www.google-analytics.com https://nse-widget.interface.ai; style-src * 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.youtube.com *.gstatic.com https://www.google.com/ *.cloudflare.com *.googletagmanager.com *.highcharts.com *.go-mpulse.net https://stats.g.doubleclick.net/ https://www.google.com/ *.doubleclick.net https://nse-uat-widget.interface.ai/widget-loader.js www.google-analytics.com *.g.doubleclick.net/ https://analytics.google.com/ https://nse-widget.interface.ai
content-type: application/json; charset=utf-8
date: Thu, 22 Aug 2024 08:48:13 GMT
link: <https://www.nseindia.com/assets/webfonts/fa-brands-400.woff2>;rel="preload";as="font";type="font/woff2";crossorigin,<https://www.nseindia.com/assets/webfonts/fa-solid-900.woff2>;rel="preload";as="font";type="font/woff2";crossorigin
server: Apache
server-timing: cdn-cache; desc=HIT, edge; dur=27, origin; dur=0, ak_p; desc="1724316493676_399044316_159647767_2744_18309_36_56_41";dur=1
strict-transport-security: max-age=31536000 ; includeSubDomains ; preload
vary: Accept-Encoding
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-xss-protection: 1; mode=block
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
