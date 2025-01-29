import { useState, useEffect } from "react";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Scatter,
    ComposedChart,
    CartesianGrid
} from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchStockData } from "@/api/yahoo-api";
import useTheme from "@/context/useTheme";

interface CandlestickProps {
    x: number;
    y: number;
    width: number;
    height: number;
    payload: {
        high: number;
        low: number;
        open: number;
        close: number;
    };
}

const CustomCandlestick = (props: CandlestickProps) => {
    const {
        x,
        y,
        width,
        payload
    } = props;

    if (!payload) return null;

    const { high, low, open, close } = payload;

    // Determine if this is a positive (green) or negative (red) candle
    const isPositive = close >= open;
    const color = isPositive ? "#22c55e" : "#ef4444";

    // Calculate the body height and position
    const bodyHeight = Math.abs(close - open);
    const bodyY = Math.min(open, close);

    return (
        <g>
            {/* Wick line */}
            <line
                x1={x + width / 2}
                y1={low}
                x2={x + width / 2}
                y2={high}
                stroke={color}
                strokeWidth={1}
            />
            {/* Candle body */}
            <rect
                x={x}
                y={bodyY}
                width={width}
                height={bodyHeight}
                fill={color}
                stroke={color}
            />
        </g>
    );
};

interface StockData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const Chart = () => {
    const { darkMode } = useTheme();
    const [symbol, setSymbol] = useState('AAPL');
    const [interval, setInterval] = useState('1d');
    const [range, setRange] = useState('1y');
    const [data, setData] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchStockData(symbol.toUpperCase(), interval, range);
            // Transform data for the chart
            const transformedData = result.map(item => ({
                date: item.date,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume
            }));
            setData(transformedData);
            setLoading(false);
            console.log(transformedData);
        } catch (error) {
            setError('Failed to fetch stock data. Please check the symbol and try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const cardThemeClass = darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900";
    const cardHeaderClass = darkMode ? "border-b border-gray-700" : "border-b border-gray-300";

    // Define renderCandlestick function
    const renderCandlestick = (props: any) => {
        return <CustomCandlestick {...props} />;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card className={`shadow-lg ${cardThemeClass}`}>
                <CardHeader className={`p-4 ${cardHeaderClass}`}>
                    <CardTitle>Stock Price Chart - {symbol}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-grow">
                            <Label htmlFor="symbol">Stock Symbol</Label>
                            <div className="flex">
                                <Input
                                    id="symbol"
                                    placeholder="Enter stock symbol (e.g., AAPL)"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                    className="mr-2"
                                />
                                <Button onClick={fetchData} disabled={loading}>
                                    {loading ? 'Loading...' : 'Search'}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Label>Interval</Label>
                            <Select value={interval} onValueChange={setInterval}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        { value: '1d', label: 'Daily' },
                                        { value: '1wk', label: 'Weekly' },
                                        { value: '1mo', label: 'Monthly' },
                                    ].map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Range</Label>
                            <Select value={range} onValueChange={setRange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        { value: '1mo', label: '1 Month' },
                                        { value: '3mo', label: '3 Months' },
                                        { value: '6mo', label: '6 Months' },
                                        { value: '1y', label: '1 Year' },
                                        { value: '5y', label: '5 Years' },
                                    ].map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 mb-4">{error}</div>
                    )}

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data}>
                                <XAxis
                                    dataKey="date"
                                    scale="band"
                                    className={darkMode ? "text-gray-300" : "text-gray-600"}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    className={darkMode ? "text-gray-300" : "text-gray-600"}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload as StockData;
                                            return (
                                                <div className={`p-2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border rounded shadow`}>
                                                    <p>Date: {data.date}</p>
                                                    <p>Open: ${data.open.toFixed(2)}</p>
                                                    <p>High: ${data.high.toFixed(2)}</p>
                                                    <p>Low: ${data.low.toFixed(2)}</p>
                                                    <p>Close: ${data.close.toFixed(2)}</p>
                                                    <p>Volume: {data.volume.toLocaleString()}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <CartesianGrid stroke={darkMode ? "#374151" : "#e5e7eb"} />
                                <Scatter
                                    data={data}
                                    shape={renderCandlestick}
                                    isAnimationActive={false}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Chart;