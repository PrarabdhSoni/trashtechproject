import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState('');

  const handleComplete = async (e) =>{
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:4000/admin/verify', { username, password });
        
        if (response.status === 200) {
            localStorage.setItem('token', response.data.token);
            const token = response.data.token
            navigate(`/admin/dashboard/${token}`);
        } else {
            console.error('Token not received from server');
            setError('Login failed. Please try again.');
        }

    } catch{
        navigate('/login')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before new request

    try {
        await axios.post('http://localhost:4000/admin', { username });
        setShow(true)
    } catch (error) {
      console.error('Error logging in', error);
      setError('Login failed. Please check your credentials ');
    }
  };

  return (
    <div>
      <h1>Hi Admin !</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {show? <div> 
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button onClick={handleComplete}>Submit</button>
        </div>
        : 
        <button onClick={handleSubmit}>Submit</button>
        }
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
    </div>
  );
};

export default Admin;
