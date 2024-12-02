import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
    const [amount, setAmount] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [orderId] = useState(`ORD-${Date.now()}`);

    const initiatePayment = async () => {
        try {
            const response = await axios.post("http://localhost:3000/initiatePayment", {
                amount,
                phoneNumber,
                orderId,
            });

            if (response.data.success) {
                // Redirect user to PhonePe payment page
                window.location.href = response.data.paymentUrl;
            } else {
                alert("Payment initiation failed");
            }
        } catch (error) {
            console.error(error.message);
            alert("Error occurred while initiating payment");
        }
    };

    return (
        <div>
            <h2>PhonePe Payment</h2>
            <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button onClick={initiatePayment}>Pay Now</button>
        </div>
    );
};

export default Payment;
