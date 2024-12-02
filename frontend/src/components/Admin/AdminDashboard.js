import React from "react";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Reports from "./components/Reports";
import WastePickup from "./components/WastePickup";
import AddEmployeeForm from "./components/AddEmployeForm";

function AdminPanel() {
  const [activeTab, setActiveTab] = React.useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <Users />;
      case "reports":
        return <Reports />;
      case "wastePickup":
        return <WastePickup />;
      case "AddNewEmploye":
        return <AddEmployeeForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flex: 1, padding: "20px", background: "#f4f4f9" }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPanel;
