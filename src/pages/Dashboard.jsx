import {
  Plane,
  CircleCheck,
  Clock3,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFlights } from "../context/useFlights";

import StatCard from "../components/StatCard";
import FlightNetwork from "../components/FlightNetwork";
import Performance from "../components/Performance";
import UpcomingFlights from "../components/UpcomingFlights";


function Dashboard() {
  const navigate = useNavigate();
  const { flights } = useFlights();
  const airborneCount = flights.filter((flight) => flight.status === "In Flight").length;
  const groundedCount = flights.filter((flight) => flight.status === "On Ground").length;
  const aircraftTypes = new Set(flights.map((flight) => flight.aircraftType).filter((type) => type && type !== "Type not reported"));

  return (

    <main className="dashboard">

      {/* Heading */}

      <div className="dashboard-heading">

        <div>

          <span className="breadcrumb">
            SKYTRACK / CONTROL CENTER
          </span>

          <h1>
            Flight Dashboard
          </h1>

          <p>Preview sample aircraft positions across India.</p>

        </div>


        <button
          className="view-button"
          type="button"
          onClick={() => navigate("/flights")}
        >

          <Plane size={15} />

          View All Flights

        </button>

      </div>


      {/* Statistics */}

      <div className="stats-grid">

        <StatCard
          icon={<Plane size={19} />}
          title="Aircraft in Sample"
          value={flights.length}
          change="Local preview data"
        />

        <StatCard
          icon={<CircleCheck size={19} />}
          title="In Flight"
          value={airborneCount}
          change="Sample position data"
        />

        <StatCard
          icon={<Clock3 size={19} />}
          title="On Ground"
          value={groundedCount}
          change="Sample status"
        />

        <StatCard
          icon={<Globe size={19} />}
          title="Aircraft Types"
          value={aircraftTypes.size}
          change="In the sample data"
        />

      </div>


      {/* Network and Performance */}

      <div className="dashboard-grid">

        <FlightNetwork />

        <Performance />

      </div>


      {/* Upcoming Flights */}

      <UpcomingFlights />

    </main>

  );
}

export default Dashboard;