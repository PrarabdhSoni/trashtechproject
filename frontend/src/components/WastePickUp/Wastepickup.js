import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Loading from '../Loading/loading';
import StateCityDropdown from './StateCitySelector';
// import BookingScheduler from './FormStructure';
import "./WastePickUp.css"


const WastePickUp = () =>{
    const {userId} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                  setError('No token found. Please log in.');
                  navigate('/login');
                  return; 
                }
                const result = await axios.get(`http://localhost:4000/wastepickup/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(result)
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
        
            } finally{
                const TimeoutId = setTimeout(()=>{
                    setLoading(false)
                }, 2000)
                return () => clearTimeout(TimeoutId);
            }

        };fetchUserData();
    },[userId, navigate]);

    if (loading) return <Loading/>;
    if (error) return <p>Error: {error}</p>;

    return (
    <div>
        <h1> Schedule waste pick up Now !</h1>
        {/* <BookingScheduler/> */}
        <StateCityDropdown/>

    </div>)
}
export default WastePickUp;