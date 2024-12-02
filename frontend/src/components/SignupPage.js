import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading/loading';
import "./SignupPage.css";

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      await axios.post('http://localhost:4000/signup', { username, password });
      alert("verify your account through mail")
      navigate('/login');
    } catch (error) {
      console.error('Error signing up', error);
    } finally{
      const TimeoutId = setTimeout(()=>{
        setLoading(false)
      }, 2000)
      return () => clearTimeout(TimeoutId);
    }
  };
  if (loading) return <Loading/>;
  return (
    <div className="signup-container">
      <div className="avi2">
        <div className="avatar">
          <img
            src="https://i.ibb.co/j6sB99x/avatar-signup-login-removebg-preview.png"
            alt="Avatar"
          />{" "}
          {/* Add an avatar SVG or PNG */}
        </div>
        <h1>SignUp</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className='signupButton'>Submit</button>
        </form>
        <a href="/login">Already a Customer?</a>
      </div>
    </div>
    // <div>
    //   <h1>Sign Up</h1>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       placeholder="Username"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //       required
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //     />
    //     <button type="submit">Sign Up</button>
    //   </form>
    // </div>
  );
};

export default SignupPage;
