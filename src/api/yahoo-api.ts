import { ChartData, StockData } from "@/types/types";


const BASE_URL = 'http://localhost:5000/api/yahoo-finance';

export const fetchStockData = async (
    symbol: string = 'AAPL',
    range: string = '1y',
    interval: string = '1d'
): Promise<StockData[]> => {
    try {
        const url = `${BASE_URL}?symbol=${symbol}&interval=${interval}&range=${range}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch historical data');
        }

        const data = await response.json();
        const timestamps = data.timestamp;
        const opens = data.indicators.quote[0].open;
        const closes = data.indicators.quote[0].close;
        const highs = data.indicators.quote[0].high;
        const lows = data.indicators.quote[0].low;
        const volumes = data.indicators.quote[0].volume;



        return timestamps.map((timestamp: number, index: number) => ({
            date: new Date(timestamp * 1000).toLocaleDateString(),
            value: closes[index],
            open: opens[index],
            high: highs[index],
            low: lows[index],
            volume: volumes[index],
        }));
    } catch (error) {
        console.error('Error in fetchHistoricalData:', error);
        throw error;
    }

};

export const fetchHistoricalData = async (
    symbol: string,
    interval: string = '1d',
    range: string = '1y'
): Promise<ChartData[]> => {
    try {
        const url = `${BASE_URL}?symbol=${symbol}&interval=${interval}&range=${range}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch historical data');
        }

        const data = await response.json();
        const timestamps = data.timestamp;
        const closes = data.indicators.quote[0].close;

        return timestamps.map((timestamp: number, index: number) => ({
            date: new Date(timestamp * 1000).toLocaleDateString(),
            value: closes[index],
        }));
    } catch (error) {
        console.error('Error in fetchHistoricalData:', error);
        throw error;
    }
};
const symbol = 'AAPL';
const interval = '1d';
const range = '1y';

fetchStockData(symbol, interval, range).then((data) => {
    console.log('Stock data fetched successfully');
    console.log(data);

})