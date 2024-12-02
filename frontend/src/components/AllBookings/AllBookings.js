import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const AllBookings = ()=>{

    const { userId } = useParams();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    const Handle = ()=>{
        navigate(`/home/${userId}`)
    }

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              setError('No token found. Please log in.');
              navigate('/login');
              return; 
            }
      
            const response = await axios.get(`http://localhost:4000/home/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(response)
          } catch (err) {
            if (err.response) {
              if (err.response.status === 403) {
                console.log('Access forbidden: Redirecting to login...');
                navigate('/login');
              } else {
                console.error('An error occurred:', err.response.data);
                setError('An error occurred while fetching user data.');
              }
            } else {
              console.error('An error occurred:', err);
              setError('Network error. Please try again.');
            }
          }
        };
        fetchUserData();
      },[userId, navigate]);


    useEffect(() => {
        const bookingsData = async () =>{
            try {
                const response = await axios.get(`http://localhost:4000/bookings/${userId}`)
                console.log('API Response:', response.data); // Use response.data for axios
                setBookings(response.data.rows || []); 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        bookingsData();
      }, [userId]);
    
    if (error) return <p>Error: {error}</p>;
    return(
            <div style={{margin: 20}}>
              <h1>Booking Details</h1>
              <table border="1" style={{ width: '100%', borderCollapse: 'collapse', padding: 5, }}>
                <thead style={{padding: 5,}}>
                  <tr>
                    <th style={{padding: 5,}}>Booking ID</th>
                    <th style={{padding: 5,}}>Name</th>
                    <th style={{padding: 5,}}>Mobile Number</th>
                    <th style={{padding: 5,}}>Address</th>
                    <th style={{padding: 5,}}>State</th>
                    <th style={{padding: 5,}}>City</th>
                    <th style={{padding: 5,}}>Waste Type</th>
                    <th style={{padding: 5,}}>Booking Date</th>
                    <th style={{padding: 5,}}>Time Slot</th>
                    <th style={{padding: 5,}}>Delivery Cost</th>
                    <th style={{padding: 5,}}>Paid</th>
                  </tr>
                </thead>
                <tbody style={{padding: 5,}}>
                  {bookings.map((booking) => (
                    <tr key={booking.id} style={{padding: 5,}}>
                      <td style={{padding: 5, textAlign: 'center'}}>{booking.id}</td>
                      <td style={{padding: 5, textAlign: 'center'}}>{booking.name}</td>
                      <td style={{padding: 5, textAlign: 'center'}}>{booking.mobile_number}</td>
                      <td style={{padding: 5, textAlign: 'center'}}>{booking.address}</td>
                      <td style={{padding: 5, textAlign: 'center'}}>{booking.state_name}</td>
                      <td style={{padding: 5, textAlign: 'center'}}>{booking.city_name}</td>
                      <td style={{padding: 5, textAlign: 'center'}}>{booking.waste_type}</td>
                      <td style={{padding: 5, textAlign: 'center'}}>{new Date(booking.booking_date).toLocaleDateString()}</td>
                      <td style={{padding: 5, textAlign: 'center'}}>{booking.time_slot}</td>
                      <td style={{padding: 5, textAlign: 'center'}}>₹ {booking.delivery_cost}</td>
                      <td style={{padding: 5, textAlign: 'center'}}>{booking.paid ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 50,}}>
                    <button onClick={Handle}>Go Back</button>
                </div>
            </div>
    )
}

export default AllBookings;