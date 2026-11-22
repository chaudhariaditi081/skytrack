// Import Plane icon
import { Plane } from "lucide-react";
import { useFlights } from "../context/useFlights";


// Create FlightNetwork component
function FlightNetwork() {
  const { flights } = useFlights();
  const plottedFlights = flights.filter((flight) => Number.isFinite(flight.lat) && Number.isFinite(flight.lon)).slice(0, 12);
  const getPosition = (flight) => ({
    left: `${Math.max(8, Math.min(92, ((flight.lon - 67) / 31) * 100))}%`,
    top: `${Math.max(8, Math.min(92, ((37 - flight.lat) / 32) * 100))}%`,
  });

  return (

    <div className="network-panel">


      {/* Heading */}

      <div className="panel-heading">

        <div>

          <h2>
            Sample Flight Network
          </h2>

          <p>
            {plottedFlights.length ? "Example aircraft positions across India" : "No sample positions available"}
          </p>

        </div>


        {/* Live Status */}

        <span className="live-badge">
          {flights.length} AIRCRAFT
        </span>

      </div>



      {/* Map */}

      <div className="map-area">


        {plottedFlights.map((flight) => (
          <Plane
            aria-label={`${flight.flightNo} position`}
            className="map-plane"
            key={flight.id}
            style={{ ...getPosition(flight), transform: `rotate(${flight.heading || 0}deg)` }}
          />
        ))}
        {plottedFlights.length === 0 && (
          <span className="network-empty-state">
            No sample positions available
          </span>
        )}


      </div>


    </div>

  );
}


// Export
export default FlightNetwork;