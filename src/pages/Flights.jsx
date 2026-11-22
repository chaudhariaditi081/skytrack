import { useState } from "react";
import { Search, Plane } from "lucide-react";
import { useFlights } from "../context/useFlights";


function Flights({ search, setSearch }) {
  const [status, setStatus] = useState("All");
  const { flights } = useFlights();
  const statuses = ["All", ...new Set(flights.map((flight) => flight.status))];


  // Filter flights

  const filteredFlights = flights.filter((flight) => {

    const searchableValues = [
      flight.flightNo,
      flight.icao24,
      flight.aircraftType,
      flight.airline,
      flight.from,
      flight.to,
    ];
    const matchesSearch = searchableValues.some((value) =>
      value?.toLowerCase().includes(search.toLowerCase())
    );


    const matchesStatus =
      status === "All" ||
      flight.status === status;


    return matchesSearch && matchesStatus;

  });


  return (

    <main className="page">

      {/* Heading */}

      <div className="page-heading">

        <div>

          <span className="breadcrumb">
            SKYTRACK / FLIGHTS
          </span>

          <h1>
            Sample Aircraft
          </h1>

          <p>
            Example aircraft data for previewing the dashboard.
          </p>

        </div>

      </div>


      {/* Search */}

      <div className="flight-tools">

        <div className="flight-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search callsign, airline or aircraft..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* Filters */}

        <div className="flight-filters">
          {statuses.map((flightStatus) => (
            <button
              className={status === flightStatus ? "filter active" : "filter"}
              key={flightStatus}
              onClick={() => setStatus(flightStatus)}
              type="button"
            >
              {flightStatus}
            </button>
          ))}
        </div>

      </div>


      {/* Flight List */}

      <div className="all-flights">

        {filteredFlights.map((flight) => (

          <div
            className="all-flight-card"
            key={flight.id}
          >

            <div className="flight-icon">
              <Plane size={19} />
            </div>


            <div className="flight-main">

              <strong>
                {flight.flightNo}
              </strong>

              <small>
                {flight.airline} · {flight.aircraftType || (flight.icao24 ? `ICAO ${flight.icao24}` : "")}
              </small>

            </div>


            <div className="route">

              <strong>
                {flight.from && flight.to
                  ? `${flight.from}${flight.fromCode ? ` (${flight.fromCode})` : ""} → ${flight.to}${flight.toCode ? ` (${flight.toCode})` : ""}`
                  : Number.isFinite(flight.lat) && Number.isFinite(flight.lon)
                    ? `${flight.lat.toFixed(3)}° N, ${flight.lon.toFixed(3)}° E`
                    : "Route and position unavailable"}
              </strong>

              <small>
                {flight.from && flight.to
                  ? `Example destination: ${flight.to}${flight.toCode ? ` (${flight.toCode})` : ""}`
                  : `${flight.direction ? `Heading ${flight.direction}` : "Heading unavailable"} · Route unavailable`}
              </small>

            </div>


            <div className="time">

              <strong>
                {Number.isFinite(flight.altitude)
                  ? `${Math.round(flight.altitude).toLocaleString()} ft`
                  : flight.departure || (flight.status === "On Ground" ? "On ground" : "Altitude unavailable")}
              </strong>

              <small>
                {flight.arrival || (Number.isFinite(flight.speed) ? `${Math.round(flight.speed)} kt` : "Speed unavailable")}
              </small>

            </div>


            <span
              className={`flight-status ${flight.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {flight.status}
            </span>


            <div className="gate">
              {flight.gate && flight.gate !== "--" ? `Gate ${flight.gate}` : `Squawk ${flight.squawk || "--"}`}
            </div>

          </div>

        ))}


        {/* No Results */}

        {filteredFlights.length === 0 && (

          <div className="no-flights">
            No flights found.
          </div>

        )}

      </div>

    </main>

  );
}

export default Flights;