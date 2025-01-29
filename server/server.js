

// Proxy route for Yahoo Finance API
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

// Proxy route for Yahoo Finance API
app.get('/api/yahoo-finance', async (req, res) => {
    const { symbol, interval = '1d', range = '1y' } = req.query;

    if (!symbol) {
        return res.status(400).json({ error: 'Stock symbol is required' });
    }

    const BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

    try {
        const url = new URL(`${BASE_URL}/${symbol}`);
        url.searchParams.append('range', range);
        url.searchParams.append('interval', interval);
        url.searchParams.append('includePrePost', 'false');

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Yahoo Finance API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Validar y extraer datos necesarios
        if (!data.chart || !data.chart.result || !data.chart.result[0]) {
            throw new Error('Invalid data format from Yahoo Finance');
        }

        const result = data.chart.result[0];
        const timestamps = result.timestamp || [];
        const quotes = result.indicators.quote[0];

        // Formatear los datos
        const formattedData = timestamps.map((time, index) => ({
            date: new Date(time * 1000).toISOString(), // Fecha en formato ISO
            open: quotes.open[index],
            high: quotes.high[index],
            low: quotes.low[index],
            close: quotes.close[index],
            volume: quotes.volume[index],
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching Yahoo Finance API:', error);
        res.status(500).json({
            error: 'Failed to fetch data from Yahoo Finance',
            details: error.message,
        });
    }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});