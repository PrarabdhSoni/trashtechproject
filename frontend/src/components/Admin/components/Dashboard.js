import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  // const [unpaidBookings, setUnpaidBookings] = useState([]);
  // const [paidBookings, setPaidBookings] = useState([]);
  const [monthlyData, setMonthlyData] = useState({
    unpaid: {},
    paid: {},
  });

  // Function to get the month and year from the created_at date
  const getMonthYear = (date) => {
    const month = new Date(date).getMonth(); // Get month (0-11)
    const year = new Date(date).getFullYear(); // Get year
    return `${year}-${month + 1}`; // Return as a string like '2024-5'
  };

 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/analysis');
        console.log('API Response:', response.data);
      
        const bookings = response.data;
        
        // Check the paid field to decide the type (string or boolean)
        console.log('Booking Data:', bookings);
      
        // If paid is boolean
        // setUnpaidBookings(bookings.filter(booking => booking.paid === false)); // If 'paid' is boolean
        // setPaidBookings(bookings.filter(booking => booking.paid === true)); // If 'paid' is boolean
  
        // If paid is a string
        // setUnpaidBookings(bookings.filter(booking => booking.paid === 'false')); // If 'paid' is string
        // setPaidBookings(bookings.filter(booking => booking.paid === 'true')); // If 'paid' is string
  
        // Grouping data by month-year and calculating totals
        const groupedData = bookings.reduce((acc, booking) => {
          const monthYear = getMonthYear(booking.created_at);
          const cost = parseFloat(booking.delivery_cost);
          
          if (!isNaN(cost)) {
            if (!acc.unpaid[monthYear]) acc.unpaid[monthYear] = 0;
            if (!acc.paid[monthYear]) acc.paid[monthYear] = 0;
    
            if (booking.paid === false) { // If 'paid' is boolean
              acc.unpaid[monthYear] += cost;
            } else if (booking.paid === true) {
              acc.paid[monthYear] += cost;
            }
  
            // Alternatively, if 'paid' is string
            // if (booking.paid === 'false') {
            //   acc.unpaid[monthYear] += cost;
            // } else if (booking.paid === 'true') {
            //   acc.paid[monthYear] += cost;
            // }
          }
          return acc;
        }, { unpaid: {}, paid: {} });
    
        console.log('Grouped Data:', groupedData);
        setMonthlyData(groupedData);
      
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };
    fetchBookings();
  }, []);
  
  
  
  
  // Extract months (labels), unpaid amounts, and paid amounts for chart data
  const months = Array.from(new Set([
    ...Object.keys(monthlyData.unpaid),
    ...Object.keys(monthlyData.paid),
  ])); // Merge both unpaid and paid month-year keys

  const unpaidAmounts = months.map((month) => monthlyData.unpaid[month] || 0);
  const paidAmounts = months.map((month) => monthlyData.paid[month] || 0);

  const data = {
    labels: months, // Labels as the month-year
    datasets: [
      {
        label: "Unpaid Amount ₹ ",
        data: unpaidAmounts, // Unpaid amounts for each month
        backgroundColor: "rgb(37, 137, 246, 0.5)", // Blue for unpaid
      },
      {
        label: "Paid Amount ₹ ",
        data: paidAmounts, // Paid amounts for each month
        backgroundColor: "rgb(64, 174, 53, 0.5)", // Green for paid
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Paid and Unpaid Amounts per Month",
      },
    },
    scales: {
      x: {
        type: "category", // Category scale for x-axis (months)
      },
      y: {
        type: "linear", // Linear scale for y-axis (amount)
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Bar data={data} options={options} />
    </div>
  );
}

export default Dashboard;
