import Chart from "@/components/CandleStickChart";
import useTheme from "@/context/useTheme";

const Graphs = () => {
    const { darkMode } = useTheme();

    return (
        <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Stock Charts
                </h1>
                <Chart />


            </div>
        </div>
    );
};

export default Graphs;
