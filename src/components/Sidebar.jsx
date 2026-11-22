// Import icons from lucide-react
import {
  LayoutDashboard,
  Plane,
  Navigation,
  CalendarDays,
  BarChart3,
  Settings,
  Globe,
  ChevronRight,
} from "lucide-react";

// Import NavLink for navigation
import { NavLink } from "react-router-dom";
import { useFlights } from "../context/useFlights";


// Create Sidebar component
function Sidebar() {
  const { flights } = useFlights();

  // Store all sidebar menu items in an array
  const menuItems = [

    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },

    {
      name: "Flights",
      path: "/flights",
      icon: Plane,
    },

    {
      name: "Tracking",
      path: "/tracking",
      icon: Navigation,
    },

    {
      name: "Schedule",
      path: "/schedule",
      icon: CalendarDays,
    },

    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },

    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];


  // Return the sidebar UI
  return (

    <aside className="sidebar">


      {/* SKYTRACK Logo */}

      <div className="logo-section">

        <div className="logo-icon">
          <Plane size={22} />
        </div>

        <div>
          <h2>SKYTRACK</h2>

          <span>
            FLIGHT CONTROL
          </span>
        </div>

      </div>



      {/* Main Menu Heading */}

      <div className="menu-title">
        MAIN MENU
      </div>



      {/* Sidebar Navigation */}

      <nav className="sidebar-menu">


        {/* Loop through menu items */}

        {menuItems.map((item) => {

          // Store icon component
          const Icon = item.icon;


          // Return each menu item
          return (

            <NavLink
              key={item.name}
              to={item.path}

              className={({ isActive }) =>
                isActive
                  ? "menu-item active"
                  : "menu-item"
              }
            >

              <Icon size={18} />

              <span>
                {item.name}
              </span>


              {/* Flight notification number */}

              {item.name === "Flights" && (
                <small>
                  {flights.length}
                </small>
              )}

            </NavLink>

          );

        })}

      </nav>



      {/* Global Network Card */}

      <NavLink
        to="/tracking"
        className="network-card"
        aria-label="Open live flight tracking"
      >

        <Globe size={22} />

        <h3>
          Global Network
        </h3>

        <p>
          Explore current aircraft positions.
        </p>


        <div className="network-line">

          <span></span>

          <span></span>

          <span></span>

        </div>

        <span className="network-card-action">
          Open tracking
          <ChevronRight size={14} />
        </span>

      </NavLink>



      {/* User Profile */}

      <NavLink
        className="sidebar-user"
        to="/settings"
        aria-label="Open administrator profile settings"
      >

        <div className="user-avatar">
          AD
        </div>


        <div className="user-info">

          <strong>
            Aditi
          </strong>

          <small>
            Administrator
          </small>

        </div>


        <ChevronRight size={18} />

      </NavLink>


    </aside>

  );
}


// Export Sidebar
export default Sidebar;