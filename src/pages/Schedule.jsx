import { useFlights } from "../context/useFlights";


function Schedule() {
  const { flights } = useFlights();

  return (

    <main className="page">


      {/* Heading */}

      <div className="page-heading">

        <div>

          <span className="breadcrumb">
            SKYTRACK / SCHEDULE
          </span>

          <h1>
            Sample Flight Data
          </h1>

          <p>
            Example aircraft positions and routes across India.
          </p>

        </div>


      </div>



      {/* Schedule Table */}

      <div className="schedule-card">

        <div className="schedule-header">

          <span>
            CALLSIGN
          </span>

          <span>
            ROUTE / DESTINATION
          </span>

          <span>
            POSITION
          </span>

          <span>
            ALTITUDE
          </span>

          <span>
            SPEED
          </span>

          <span>
            STATUS
          </span>

        </div>


        {flights.map((flight) => (

          <div
            className="schedule-row"
            key={flight.id}
          >

            <strong>
              {flight.flightNo}
            </strong>


            <span>
              {flight.from && flight.to
                ? `${flight.from}${flight.fromCode ? ` (${flight.fromCode})` : ""} → ${flight.to}${flight.toCode ? ` (${flight.toCode})` : ""}`
                : `${flight.airline} · ${flight.aircraftType}`}
            </span>


            <span>
              {Number.isFinite(flight.lat) && Number.isFinite(flight.lon)
                ? `${flight.lat.toFixed(3)}°, ${flight.lon.toFixed(3)}°` : "--"}
            </span>


            <span>
              {Number.isFinite(flight.altitude)
                ? `${Math.round(flight.altitude).toLocaleString()} ft`
                : flight.status === "On Ground" ? "Ground" : "Unavailable"}
            </span>


            <span
              className="schedule-speed"
            >
              {Number.isFinite(flight.speed) ? `${Math.round(flight.speed)} kt` : "--"}
            </span>


            <span className={`flight-status ${flight.status.toLowerCase().replace(" ", "-")}`}>
              {flight.status}
            </span>

          </div>

        ))}

      </div>

    </main>

  );
}

export default Schedule;