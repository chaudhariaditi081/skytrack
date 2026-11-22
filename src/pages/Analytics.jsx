import {
  Plane,
  CircleCheck,
  Clock3,
  TriangleAlert,
} from "lucide-react";
import { useFlights } from "../context/useFlights";


function Analytics() {
  const { flights } = useFlights();
  const totalFlights = flights.length;
  const airborneFlights = flights.filter((flight) => flight.status === "In Flight").length;
  const groundedFlights = flights.filter((flight) => flight.status === "On Ground").length;
  const aircraftTypes = new Set(flights.map((flight) => flight.aircraftType).filter((type) => type && type !== "Type not reported")).size;
  const statusCounts = [
    { label: "In Flight", count: airborneFlights },
    { label: "On Ground", count: groundedFlights },
    { label: "Other", count: totalFlights - airborneFlights - groundedFlights },
  ];

  return (

    <main className="page">


      {/* Heading */}

      <div className="page-heading">

        <div>

          <span className="breadcrumb">
            SKYTRACK / ANALYTICS
          </span>

          <h1>
            Aircraft Analytics
          </h1>

          <p>
            Review sample aircraft positions, routes and status.
          </p>

        </div>

      </div>



      {/* Analytics Cards */}

      <div className="analytics-grid">


        <div className="analytics-card">

          <div className="analytics-icon">
            <Plane size={19} />
          </div>

          <span>
            Aircraft in Sample
          </span>

          <h2>
            {totalFlights}
          </h2>

          <small>
            Local preview data
          </small>

        </div>



        <div className="analytics-card">

          <div className="analytics-icon">
            <CircleCheck size={19} />
          </div>

          <span>
            In Flight
          </span>

          <h2>
            {airborneFlights}
          </h2>

          <small>
            Currently airborne
          </small>

        </div>



        <div className="analytics-card">

          <div className="analytics-icon">
            <Clock3 size={19} />
          </div>

          <span>
            On Ground
          </span>

          <h2>
            {groundedFlights}
          </h2>

          <small>
            Sample aircraft on ground
          </small>

        </div>



        <div className="analytics-card">

          <div className="analytics-icon">
            <TriangleAlert size={19} />
          </div>

          <span>
            Aircraft Types
          </span>

          <h2>
            {aircraftTypes}
          </h2>

          <small>
            In the sample data
          </small>

        </div>

      </div>



      {/* Flight Status Chart */}

      <div className="analytics-chart">

        <h2>
          Aircraft State
        </h2>

        <p>
          Sample aircraft grouped by current state
        </p>


        <div className="bar-chart" role="list" aria-label="Flights by status">
          {statusCounts.map(({ label, count }) => (
            <div className="bar-item" role="listitem" key={label}>
              <span className="bar-value">{count}</span>
              <div className="bar-track">
                <span
                  className={`bar-fill ${label.toLowerCase().replace(" ", "-")}`}
                  style={{ height: totalFlights === 0 ? "0%" : `${(count / totalFlights) * 100}%` }}
                />
              </div>
              <span className="bar-label">{label}</span>
            </div>
          ))}
        </div>

      </div>

    </main>

  );
}

export default Analytics;