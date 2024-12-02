import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import axios from "axios";
import Select from "react-select";
import { getDistance } from "geolib";
import { useParams, useNavigate } from 'react-router-dom';



const outlets = [
  { name: "Delhi Outlet", lat: 28.7041, lng: 77.1025 },
  { name: "Mumbai Outlet", lat: 19.076, lng: 72.8777 },
  { name: "Bangalore Outlet", lat: 12.9716, lng: 77.5946 },
];

const cityCoordinates = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.7041, lng: 77.1025 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
};

function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
    },
  });
  return null;
}


const StateCityDropdown = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedWasteType, setSelectedWasteType] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [nearestOutlet, setNearestOutlet] = useState(null);
  const [location, setLocation] = useState({ latitude: 28.6139, longitude: 77.2090 });
  const [error, setError] = useState(null);
  const {userId} = useParams()
  
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

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setLocation({ latitude, longitude });

  //         if (cityOption && mapRef.current) {
  //           const { lat, lng } = cityCoordinates[cityOption.value];
  //           mapRef.current.setView([lat, lng], 12); // Update the map view
  //         }
  //         if (mapRef.current) {
  //           mapRef.current.setView([latitude, longitude], 13);
  //         }
  //       },
  //       (err) => {
  //         setError(err.message);
  //         console.error(err);
  //       }
  //     );
  //   } else {
  //     setError("Geolocation is not supported by this browser.");
  //   }
  // }, []);

  const handleCityChange = (cityOption) => {
    setSelectedCity(cityOption);

    if (cityOption && mapRef.current) {
      const { lat, lng } = cityCoordinates[cityOption.value];
      mapRef.current.setView([lat, lng], 12); // Update the map view
    }
  }

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

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    address: "",
  });

  const stateCityData = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  };

  const wasteOptions = [
    { label: "Uncategorised Waste ", value: "Uncategorised Waste " },
    { label: "Recyclable Waste", value: "Recyclable Waste" },
    { label: "Biodegradable Waste", value: "Biodegradable Waste" },
    { label: "Non-Biodegradable Waste", value: "Non-Biodegradable Waste" },
    { label: "Electronic Waste ", value: "Electronic Waste " },
    { label: "Textile Waste", value: "Textile Waste" },
    { label: "Hazardous Waste", value: "Hazardous Waste" },
    { label: "Miscellaneous Waste ", value: "Miscellaneous Waste " },
    { label: "Construction Waste ", value: "Construction Waste " },
    
  ];

  const stateOptions = Object.keys(stateCityData).map((state) => ({
    label: state,
    value: state,
  }));

  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    // Fetch unavailable slots when the date changes
    const fetchUnavailableSlots = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/unavailable-slots/${selectedDate
            .toISOString()
            .split("T")[0]}`
        );
        setUnavailableSlots(response.data);
      } catch (err) {
        console.error("Error fetching unavailable slots:", err);
      }
    };

    fetchUnavailableSlots();
  }, [selectedDate]);

  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    if (selectedDate.toISOString().split("T")[0] === currentDate){
      const currentHour = now.getHours() + 1; // Get the current hour (0-23)
  
      // Define the end time for the slots
      const endHour = 20; // 8:00 PM in 24-hour format
    
      // Generate time slots dynamically from the current hour to the end hour
      const slots = [];
      for (let i = currentHour; i <= endHour; i++) {
        slots.push(`${i}:00`);
      }
    
      // Update the state with the generated slots
      setTimeSlots(slots);
    } else{
      const slots = [];
      for (let i = 7; i <= 20; i++) {
        slots.push(`${i}:00`);
      }
    
      // Update the state with the generated slots
      setTimeSlots(slots);
    }
    
    
    
  }, [selectedDate]);
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if(selectedOption === 'COD'){
      try {
        const finalAmount = amount; 
        // Make an API call to book the slot
        await axios.post("http://localhost:4000/api/book", {
          name: formData.name,
          mobile_number: formData.mobileNumber,
          address: formData.address,
          state_name: selectedState.label,
          city_name: selectedCity.label,
          waste_type: selectedWasteType.label,
          booking_date: selectedDate.toISOString().split("T")[0],
          time_slot: selectedTime.value,
          latitude: location.latitude,
          longitude: location.longitude,
          outlet_name: nearestOutlet.name,
          distance: nearestOutlet.distance,
          delivery_cost: finalAmount,
          user_id: userId,
        });
        alert("Booking confirmed!");
        navigate(`/home/${userId}`)
        
      } catch (err) {
        console.error("Error booking slot:", err);
        alert("Error booking slot: " + (err.response?.data || err.message));
      }
    }else{
      alert('This is a project not an actual Site');
    }
    
  };

  const cityOptions =
    selectedState && stateCityData[selectedState.value]
      ? stateCityData[selectedState.value].map((city) => ({
          label: city,
          value: city,
        }))
      : [];

  return (
    <div className="FormHead">
      <form onSubmit={handleSubmit}>
        {/* User Details */}
        <div>
          <input
            style={{ width: "300px", marginBottom: "10px", padding: "10px" }}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <input
            style={{ width: "300px", marginBottom: "10px", padding: "10px" }}
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Mobile Number"
            required
          />
          <input
            style={{ width: "300px", marginBottom: "10px", padding: "10px" }}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
            required
          />
        </div>
        <div
          className="containerP"
          style={{ width: "400px", backgroundColor: "white" }}
        >
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          />
        </div>
        <div style={{ width: "300px" }}>
          <Select
            options={timeSlots.map((slot) => ({
              value: slot,
              label: slot,
              isDisabled: unavailableSlots.includes(slot), // Mark unavailable slots as disabled
            }))}
            value={selectedTime}
            onChange={setSelectedTime}
            placeholder="Select a time slot"
            isOptionDisabled={(option) => option.isDisabled} // Use this property to enforce the disabled state
            isClearable
          />
          </div>

        {/* State and City Dropdowns */}
        <div style={{ width: "300px", marginBottom: "10px" }}>
          <Select
            options={stateOptions}
            value={selectedState}
            onChange={setSelectedState}
            placeholder="Select a state"
            isClearable
          />
          <div style={{ marginBottom: "10px" }}></div>
          <Select
            options={cityOptions}
            value={selectedCity}
            onChange={handleCityChange}
            placeholder="Select a city"
            isClearable
            isDisabled={!cityOptions.length}
          />
          <div style={{ marginBottom: "10px" }}></div>
          <Select
            options={wasteOptions}
            value={selectedWasteType}
            onChange={setSelectedWasteType}
            placeholder="Type of Waste"
            isClearable
          />
        </div>

        {/* Date and Time Selection */}
 
        <div>

      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={29}
        style={{ height: "200px", width: "300px", marginTop: "20px", zIndex: 0 }}
        // ref={mapRef}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
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
      <div>
        <h3>Payment Mode</h3>
        <h6>BHIM/UPI/CARD/NETBANKING</h6>
        <div style={{ position: "relative", display: "inline-block" }}>
        <label>
          <img alt="Logo" src="/upi.jpg" style={{ cursor: "pointer", width: "100px", height: "100px" }} />
          <input
            type="radio"
            name="option"
            value="Online"
            checked={selectedOption === "Online"}
            onChange={handleChange}
            style={{
              position: "absolute",
              top: "10px", // Adjust the vertical position
              left: "10px", // Adjust the horizontal position
              cursor: "pointer",
              transform: "scale(1.3)", // Optional: Scale the checkbox for better visibility
            }}
          />
        </label>
        </div>
          <h6>COD (Cash On Dilivery)</h6>
        <div style={{ position: "relative", display: "inline-block" }}>
        <label>
          <img alt="Logo" src="/cod.jpg" style={{ cursor: "pointer", width: "100px", height: "100px" }} />
          <input
            type="radio"
            name="option"
            value="COD"
            checked={selectedOption === "COD"}
            onChange={handleChange}
            style={{
              position: "absolute",
              top: "10px", // Adjust the vertical position
              left: "10px", // Adjust the horizontal position
              cursor: "pointer",
              transform: "scale(1.3)", // Optional: Scale the checkbox for better visibility
            }}
          />
        </label>
        </div>
    </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            !selectedTime ||
            !formData.name ||
            !formData.mobileNumber ||
            !selectedState ||
            !selectedCity ||
            !selectedWasteType || 
            !userId || 
            !customerLocation || 
            !nearestOutlet || !selectedOption
          }
          style={{ width: "300px", marginBottom: "10px" }}
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default StateCityDropdown;
