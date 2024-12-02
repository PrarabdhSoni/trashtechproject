import React from "react";

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "users", label: "Manage Users" },
    { id: "reports", label: "Reports" },
    { id: "wastePickup", label: "Waste Pickup" },
    { id: "AddNewEmploye", label: "Add New Employe" },
  ];

  return (
    <div style={{ width: "250px", background: "#d1efc9", color: "#40ae35" }}>
      <h2 style={{ textAlign: "center", padding: "20px 0" }}>Admin Panel</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tabs.map((tab) => (
          <li
            key={tab.id}
            style={{
              padding: "15px",
              cursor: "pointer",
              background: activeTab === tab.id ? "#40ae35" : "transparent",
              color: activeTab === tab.id ? "#ffffff": "#40ae35"
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
