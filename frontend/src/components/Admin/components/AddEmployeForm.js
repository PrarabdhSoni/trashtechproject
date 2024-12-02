import React, { useState } from "react";
import axios from "axios";

const AddEmployeeForm = () => {
    const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    hireDate: "",
    jobTitle: "",
    salary: "",
    manager_id: 0,
    department: "",
    employeeId: 0,
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    try {
        const response = await axios.post("http://localhost:4000/newemployees", formData);
      if (response.status === 201) {
        setMessage("Employee added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          hireDate: "",
          jobTitle: "",
          department: "",
          isActive: true,
        });
      } else {
        setMessage("Failed to add employee. Please try again.");
      }
    } catch (error) {
        console.error("Error adding employee:", error);
        setMessage("Error occurred while adding the employee.")
    }
    // Add logic to send formData to the backend using an API call (e.g., axios).
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Add New Employee</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "15px" }}>
          <label>
            Employee Id:
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Hire Date:
            <input
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Job Title:
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Salary ₹:
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Manager Id:
            <input
              type="text"
              name="manager_id"
              value={formData.manager_id}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Department:
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            >
              <option value="">Select Department</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Active:
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              style={{ margin: "0 5px" }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#007BFF",
            color: "#FFF",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployeeForm;
