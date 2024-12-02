import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    // const {token} = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            // const response =  await axios.post('http://localhost:4000/forgotpassword',{token} );
            const response =  await axios.post('http://localhost:4000/forgotpassword', {username});
            if (response.status === 400) {
                console.log("400")
            } else {
                console.error('Token not received from server');
                setError('Login failed. Please try again.');
            }

            console.log(response.data);
            navigate('/login');
        } catch(error) {
            console.error('Error logging in', error);
            setError('No user found');
        }
    }

    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}

export default ForgotPassword;