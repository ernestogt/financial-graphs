export const fetchNews = async () => {
    const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${import.meta.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}&topics=financial_markets`)
    if (!response.ok) {
        throw new Error('Failed to fetch news')
    }
    const data = await response.json()
    return data.feed || []
}

export const searchSymbol = async (query: string) => {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=RI7MQIMG2ZBDEFQY}`)

        if (!response.ok) {
            throw new Error(`Failed to fetch symbol data: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in searchSymbol:", error);
        throw error;
    }
};

const API_KEY = import.meta.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

export async function fetchStockData(symbol: string, timeframe: string) {
    const endpoint = `https://www.alphavantage.co/query?function=TIME_SERIES_${timeframe}&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error('Failed to fetch stock data');
    }
    return response.json();
}

export function parseStockData(data: any, timeframe: string) {
    const timeSeries = data[`Time Series (${timeframe})`];
    return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
    })).reverse();
}

