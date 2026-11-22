
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Flights from "./pages/Flights";
import Tracking from "./pages/Tracking";
import Schedule from "./pages/Schedule";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("skytrack-theme") === "dark";
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "skytrack-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Sidebar />

      <div className="main-content">
        <Topbar search={search} setSearch={setSearch} />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/flights"
            element={
              <Flights search={search} setSearch={setSearch} />
            }
          />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route
            path="/settings"
            element={
              <Settings
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
