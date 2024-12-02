import { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function Confirm(){
  const {token} = useParams();
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);
  const imagestyle = {
    display: 'flex',
    margin: 'auto',
    alignitems: 'center',
    height: '100vh',
  }
  const confirmstyle = {
    backgroundColor: '#f4f2f2',
  }
  const buttonstyle = {
    backgroundColor: '#ffd483',
    position: 'absolute',
    top: '500px',
    left: '50%',
    fontSize: '20px',
    borderRadius: '25px',
    color: 'black',
    fontWeight: '500px',
    cursor: 'pointer',
    border: 'none',
    padding: '5px 10px 5px 10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
  }
  function HandlerI(){
    navigate('/login')
  }
  
  useEffect(() => {
      const fetchDashboard = async () => {
        try {
          await axios.post(`http://localhost:4000/confirm/:token`,{token})
        } catch (error) {
          console.error('Error fetching home page', error);
          navigate('/login');
        }
      };
      fetchDashboard();
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setRedirect(true);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  if (redirect) {
    navigate('/login');
  }

  return(
    <div style={confirmstyle}>
      <img src='/Account verified image.png' alt='Account verified' style={imagestyle} draggable='false' />
      <button type='submit' onClick={HandlerI} style={buttonstyle}>Sign In</button>
    </div>
  )
}
