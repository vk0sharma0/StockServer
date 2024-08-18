const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Endpoint to fetch data from NSE Option Chain API
app.get('', async (req, res) => {
    try {
        const response = await axios.get('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from NSE:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from NSE' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
