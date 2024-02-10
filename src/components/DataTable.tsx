// DataTable.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Chart from "./Chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';


interface DataRow {
    discount_name: string;
    discount_value: number;
    applied_count: number;
    created_time: string

}

const DataTable: React.FC = () => {
    const [data, setData] = useState<DataRow[]>([]);
    const [selectedRows, setSelectedRows] = useState<DataRow[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [searchTerm, currentPage]);

    const fetchData = async () => {
        try {
            // Fetch data from backend API
            setLoading(true)
            const response = await fetch('http://localhost:3005/discounts');

            const apidData = await response.json();
            console.log({ apidData });

            setData(apidData);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            // window.alert("SOMETHING WENT WRONG")
            console.error("Error fetching data:", error);
        }
    };



    const topDiscounts = data
        // Create a shallow copy of the data array
        .slice()
        // Sort the array based on discount_value
        .sort((a, b) => b.discount_value - a.discount_value)
        // Slice the top 5 elements
        .slice(0, 5)
        // Map each element to include created_time as a number
        .map(item => ({
            discount_value: item.discount_value,
            created_time: parseInt(item.created_time.slice(0, 2)),
            discount_name: item.discount_name
        }));

    return (
        <div >
            <div>
                <LineChart width={600} height={300} data={topDiscounts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="discount_name" />
                    <YAxis dataKey="discount_value"  tickFormatter={(value) => `$${value}`} />
                    <Tooltip />
                    <Legend />
                    {Array.from(new Set(topDiscounts.map(entry => entry.discount_name))).map((name, index) => (
                        
                        <Line
                            key={index}
                            type="monotone"
                            dataKey="created_time"
                            name={name}
                            // data={topDiscounts.filter(entry => entry.discount_name === name)}

                            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                            
                        />
                    ))}
                    {/* <Line
                        type="monotone"
                        dataKey="created_time"
                        name="Discount "
                        stroke="#8884d8" /> */}
                </LineChart>
            </div>

            <div>

                <div className="table-fixed  min-w-half  mt-4">

                    <table className="ml-6 table-fixed  w-half">
                        {/* Table headers */}
                        <thead>
                            <tr className="mt-6 ">
                                <th className="px-2 py-2 bg-gray-200 border border-gray-300">Discount Name</th>
                                <th className="px-2 py-2 bg-gray-200 border border-gray-300">Discount Applied</th>
                                <th className="px-2 py-2 bg-gray-200 border border-gray-300">Discount Amount</th>
                                <th className="px-2 py-2 bg-gray-200 border border-gray-300">Time</th>
                                {/* <th className="px-2 py-2 bg-gray-200 border border-gray-300">Stock</th>  */}
                            </tr>
                        </thead>
                        {/* Table body */}
                        {
                            loading ? (
                                <div className="w-full h-64 flex items-center justify-center ml-[150px]">
                                    <div className="text-center">
                                        Loading...
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {
                                        data.length > 0 ? (
                                            <tbody>
                                                {
                                                    data.map((row) => (
                                                        <tr >

                                                            <td className="px-2 py-4 whitespace-nowrap border border-gray-300">{row.discount_name}</td>
                                                            <td className="px-2 py-4 whitespace-nowrap border border-gray-300">{row.discount_value}</td>
                                                            <td className="px-2 py-4 whitespace-nowrap border border-gray-300">{row.applied_count}</td>
                                                            <td className="px-2 py-4 whitespace-nowrap border border-gray-300">{row.created_time.slice(0, 2)}</td>
                                                            {/* <td className="px-2 py-4 whitespace-nowrap border border-gray-300">{row.rating}</td> */}
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>

                                        ) : (<>No Data Found</>)
                                    }
                                </>
                            )
                        }


                    </table>


                </div>

            </div>
            {/*  chart component */}
            {/* {
                data.length > 0 ? (
                    <Chart data={selectedRows} />
                ) : null
            } */}

        </div>
    );
};

export default DataTable;
