// Import icons
import {
  Search,
  CloudSun,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";


// Create Topbar component
function Topbar({ search, setSearch }) {
  const navigate = useNavigate();

  return (

    <header className="topbar">


      {/* Search Box */}

      <form
        className="search-box"
        onSubmit={(event) => {
          event.preventDefault();
          navigate("/flights");
        }}
      >

        <Search size={17} />

        <input
          type="text"
          placeholder="Search callsigns and aircraft..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <span className="shortcut">
          Enter
        </span>

      </form>



      {/* Right Side */}

      <div className="topbar-right">

        <span className="data-source connected" title="Local sample data">
          <span className="data-source-dot" />
          Local demo data
        </span>


        {/* Weather */}

        <div className="weather">

          <CloudSun size={20} />

          <div>

            <strong>
              28°C
            </strong>

            <small>
              Mumbai
            </small>

          </div>

        </div>



        {/* User Avatar */}

        <NavLink
          className="top-avatar"
          to="/settings"
          aria-label="Open administrator settings"
        >
          AD
        </NavLink>


      </div>


    </header>

  );
}


// Export Topbar
export default Topbar;