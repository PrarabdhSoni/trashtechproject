import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Loading from '../Loading/loading';
import "./Dashboard.css";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'

const HomePage = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [location, setLocation] = useState({ latitude: 28.6139, longitude: 77.2090 });
  const mapRef = useRef();
  const customIcon = new L.Icon({
    iconUrl: '/dustbin.png',
    iconSize: [32, 32], 
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  
  const positions = [
    [28.61683161069832, 77.15170954283586],
    [28.602762043637064, 77.19538380815867],
    [23.0762633, 76.8498363],
    [23.0761239, 76.8500847],
    [23.0772244, 76.8506976],
    [23.0774221, 76.8507231],
    [23.0776143, 76.8506510],
    [23.078311, 76.8506812],
    [23.0783068, 76.8504488],
    [23.0787475, 76.8506168],
    [23.0786507, 76.8500948],
    [23.0786146, 76.8498879],
    [23.0792000, 76.8504207],
    [23.0783000, 76.8501756],
    [23.0780652, 76.8511573],
    [23.0774104, 76.8511670],
    [23.077157, 76.851494],
    [23.077087,76.850974],
    [23.075009, 76.859970],
    [23.073631, 76.859645],
    [23.073397, 76.859881],
    [23.073362, 76.858757],
    [23.073254, 76.858735],
    [23.074651, 76.852405],
  ]

  function Handler(){
    navigate(`/wastepickup/${userId}`);
  }
  function HandlerI(){
    navigate(`/bookings/${userId}`)
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
          }
        },
      );
    }
  }, []);

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
      } finally {
        const TimeoutId = setTimeout(()=>{
          setLoading(false)
        }, 1000)
        return () => clearTimeout(TimeoutId);
      }
    };
    fetchUserData();
  },[userId, navigate]);

  if (loading) return <Loading/>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className='navheading'>
      <nav className='navbar'>
            <img className='heading' alt="" src='/Logo.png' draggable='false'/>
            <div>
                <button className='homebutton' type='submit' onClick={Handler} >Get Service</button>
                <button className='homebutton' type='submit' onClick={HandlerI} >All Request</button>
            </div>
            </nav>
      </div>
      <MapContainer center={[location.latitude, location.longitude]} zoom={18} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {positions.map((position, index) => (
          <Marker key={index} position={position} icon={customIcon}>
            <Popup>
              Hey! Use Me.
            </Popup>
            {index + 1}
          </Marker>))};
      </MapContainer>
    </div>
  );
};

export default HomePage;
