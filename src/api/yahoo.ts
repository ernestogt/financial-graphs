// Importa el tipo necesario para tipar las respuestas
export interface CandleData {
    // timestamp: number;  // Marca temporal del dato
    date: string;       // Fecha en formato ISO
    open: number;       // Precio de apertura
    high: number;       // Precio más alto
    low: number;        // Precio más bajo
    close: number;      // Precio de cierre
    volume: number;     // Volumen transaccionado
}

// Función para obtener datos del mercado desde el servidor proxy
export async function fetchMarketData(ticker: string, interval: string = "1d", range: string = "1mo"): Promise<CandleData[]> {
    // Construye la URL del servidor proxy
    const url = `http://localhost:3000/proxy/v8/finance/chart/${ticker}?interval=${interval}&range=${range}`;

    try {
        // Realiza el fetch a través del servidor proxy
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.statusText}`);
        }

        // Parsear los datos JSON
        const data = await response.json();

        // Extraer datos relevantes para las velas japonesas
        const result = data.chart.result[0];
        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];

        // Mapear los datos a un formato estructurado
        const candles: CandleData[] = timestamps.map((timestamp: number, index: number) => ({
            date: new Date(timestamp * 1000).toISOString(), // Convertir a ISO
            open: quotes.open[index],
            high: quotes.high[index],
            low: quotes.low[index],
            close: quotes.close[index],
            volume: quotes.volume[index],
        }));

        return candles;
    } catch (error) {
        console.error("Error en fetchMarketData:", error);
        throw error;
    }
}

// // Función para formatear la marca temporal a una fecha legible
// function formatDate(timestamp: number): string {
//     return new Date(timestamp * 1000).toLocaleString();
// }
