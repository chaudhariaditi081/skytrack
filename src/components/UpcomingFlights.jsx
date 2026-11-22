import { useState } from "react";
import { useFlights } from "../context/useFlights";

// Create component
function UpcomingFlights() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const { flights } = useFlights();
  const statuses = ["All", ...new Set(flights.map((flight) => flight.status))];

  const filteredFlights = flights.filter((flight) =>
    selectedStatus === "All" ? true : flight.status === selectedStatus
  );

  return (

    <div className="upcoming-panel">


      {/* Heading */}

      <div className="upcoming-heading">

        <div>

          <h2>
            Sample Aircraft
          </h2>

          <p>
            Example positions across India
          </p>

        </div>


        <button type="button" onClick={() => setSelectedStatus("All")}>
          View all →
        </button>

      </div>



      {/* Filters */}

      <div className="flight-filters">
        {statuses.map((flightStatus) => (
          <button
            type="button"
            className={selectedStatus === flightStatus ? "filter active" : "filter"}
            key={flightStatus}
            onClick={() => setSelectedStatus(flightStatus)}
          >
            {flightStatus}
          </button>
        ))}
      </div>



      {/* Flight List */}

      <div className="flight-list">


        {filteredFlights.slice(0, 4).map((flight) => (

          <div
            className="flight-row"
            key={flight.id}
          >


            {/* Flight Number */}

            <div className="flight-info">

              <strong>
                {flight.flightNo}
              </strong>

              <small>
                {[flight.airline, flight.aircraftType].filter(Boolean).join(" · ")}
              </small>

            </div>



            {/* Route */}

            <div className="flight-route">

              <strong>
                {flight.from && flight.to
                  ? `${flight.from}${flight.fromCode ? ` (${flight.fromCode})` : ""} → ${flight.to}${flight.toCode ? ` (${flight.toCode})` : ""}`
                  : Number.isFinite(flight.lat) && Number.isFinite(flight.lon)
                    ? `${flight.lat.toFixed(2)}°, ${flight.lon.toFixed(2)}°`
                    : "Route/position unavailable"}
              </strong>

            </div>



            {/* Time */}

            <div className="flight-time">

              <strong>
                {Number.isFinite(flight.altitude)
                  ? `${Math.round(flight.altitude).toLocaleString()} ft`
                  : flight.status === "On Ground" ? "On ground" : "Altitude unavailable"}
              </strong>

              <small>
                {Number.isFinite(flight.speed) ? `${Math.round(flight.speed)} kt` : "Speed unavailable"}
              </small>

            </div>



            {/* Status */}

            <span
              className={`flight-status ${flight.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {flight.status}
            </span>



            {/* Gate */}

            <span className="flight-gate">
              {`Squawk ${flight.squawk || "--"}`}
            </span>


          </div>

        ))}

      </div>


    </div>

  );
}


// Export
export default UpcomingFlights;