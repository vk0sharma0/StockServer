const axios = require('axios');

// Configuration for the Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://www.nseindia.com',
    timeout: 10000, // Set a timeout to prevent hanging requests
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept-Encoding': 'gzip, compress, deflate, br'
    },
    maxRedirects: 5, // Limit redirects
});

// Function to fetch data
async function fetchData() {
    try {
        const response = await axiosInstance.get('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY');
        console.log('Data fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNRESET') {
            console.error('Connection reset by peer:', error.message);
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout:', error.message);
        } else if (error.response) {
            console.error('Error response from the server:', error.response.status, error.response.statusText);
        } else {
            console.error('Error fetching data:', error.message);
        }
    }
}

// Call the fetchData function
fetchData();

// Start the server
const port = process.env.PORT || 7953;
const server = require('http').createServer();

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

