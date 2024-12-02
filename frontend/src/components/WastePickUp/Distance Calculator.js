import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import { getDistance } from "geolib";

const outlets = [
  { name: "Delhi Outlet", lat: 28.7041, lng: 77.1025 },
  { name: "Mumbai Outlet", lat: 19.076, lng: 72.8777 },
  { name: "Bangalore Outlet", lat: 12.9716, lng: 77.5946 },
];

function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
    },
  });
  return null;
}

function App() {
  const [customerLocation, setCustomerLocation] = useState(null);
  const [nearestOutlet, setNearestOutlet] = useState(null);
  const [location, setLocation] = useState({ latitude: 28.6139, longitude: 77.2090 });
  const [error, setError] = useState(null);
  
  const [amount, setAmount] = useState(0);
  const mapRef = useRef();

  // Calculate distances and find the nearest outlet
  const findNearestOutlet = (customerLoc) => {
    if (!customerLoc) return null;

    let minDistance = Infinity;
    let closestOutlet = null;

    outlets.forEach((outlet) => {
      const distance = getDistance(
        { latitude: customerLoc.lat, longitude: customerLoc.lng },
        { latitude: outlet.lat, longitude: outlet.lng }
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestOutlet = { ...outlet, distance: (distance / 1000).toFixed(2) }; // Convert meters to kilometers
      }
    });

    setNearestOutlet(closestOutlet);
  };

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
        (err) => {
          setError(err.message);
          console.error(err);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);


  useEffect(() => {
    if (customerLocation) {
      findNearestOutlet(customerLocation);
    }
  }, [customerLocation]);

  useEffect(() => {
    if (nearestOutlet) {
      const distance = parseFloat(nearestOutlet.distance);
      if (distance <= 5) {
        setAmount(25);
      } else if (distance <= 10) {
        setAmount(30);
      } else if (distance <= 20) {
        setAmount(45);
      } else {
        setAmount(2400);
      }
    }
  }, [nearestOutlet]);
  

  return (
    <div>
      <p>Click on the map to select your location</p>

      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker setLocation={setCustomerLocation} />
        {customerLocation && (
          <Marker position={[customerLocation.lat, customerLocation.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        {outlets.map((outlet, index) => (
          <Marker key={index} position={[outlet.lat, outlet.lng]}>
            <Popup>{outlet.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {nearestOutlet && (
        <p>
          Nearest Outlet: <strong>{nearestOutlet.name}</strong><br />
          Distance: <strong>{nearestOutlet.distance} km</strong><br/>
          Delivery Cost: <strong>₹{amount}</strong>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
