import { useState, useEffect } from "react";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart
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
import { fetchHistoricalData } from "@/api/yahoo-api";
import useTheme from "@/context/useTheme";
import { ChartData } from "@/types/types";


const intervalOptions = [
    { value: '1d', label: 'Daily' },
    { value: '1wk', label: 'Weekly' },
    { value: '1mo', label: 'Monthly' },
];

const rangeOptions = [
    { value: '1mo', label: '1 Month' },
    { value: '3mo', label: '3 Months' },
    { value: '6mo', label: '6 Months' },
    { value: '1y', label: '1 Year' },
    { value: '5y', label: '5 Years' },
];

const Chart: React.FC = () => {
    const { darkMode } = useTheme();
    const [symbol, setSymbol] = useState('AAPL');
    const [interval, setInterval] = useState('1d');
    const [range, setRange] = useState('1y');
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchHistoricalData(symbol.toUpperCase(), interval, range);
            setData(result);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching chart data:", error);
            setError('Failed to fetch stock data. Please check the symbol and try again.');
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const cardThemeClass = darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900";
    const cardHeaderClass = darkMode ? "border-b border-gray-700" : "border-b border-gray-300";

    return (
        <div className="max-w-4xl mx-auto">
            <Card className={`shadow-lg ${cardThemeClass}`}>
                <CardHeader className={`p-4 ${cardHeaderClass}`}>
                    <CardTitle>Stock Price Chart</CardTitle>
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
                                    {intervalOptions.map((option) => (
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
                                    {rangeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 mb-4 text-center">{error}</div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center h-96">Loading chart data...</div>
                    ) : data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart data={data}>
                                <defs>
                                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor={darkMode ? "#4f46e5" : "#312e81"}
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={darkMode ? "#4f46e5" : "#312e81"}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={darkMode ? "#4f46e5" : "#312e81"}
                                    fillOpacity={1}
                                    fill="url(#chartColor)"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                                        borderColor: darkMode ? "#4f46e5" : "#d1d5db",
                                        color: darkMode ? "#ffffff" : "#000000",
                                    }}
                                />
                                <XAxis dataKey="date" />
                                <YAxis />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-gray-500 h-96 flex items-center justify-center">
                            No data available. Try searching for a stock symbol.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Chart;
