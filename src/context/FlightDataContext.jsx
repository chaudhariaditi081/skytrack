import { useEffect, useState } from "react";
import { flightDataContext } from "./flightDataContext";

function formatStatus(status) {
  if (!status) return "Unknown";

  switch (status.toLowerCase()) {
    case "active":
      return "In Flight";
    case "scheduled":
      return "Scheduled";
    case "landed":
      return "Landed";
    case "cancelled":
      return "Cancelled";
    case "incident":
      return "Incident";
    case "diverted":
      return "Diverted";
    default:
      return status;
  }
}

function formatAircraft(aircraft) {
  if (!aircraft) return "Aircraft unavailable";

  return (
    aircraft.model ||
    aircraft.icao_code ||
    aircraft.registration ||
    "Aircraft unavailable"
  );
}

function normalizeFlightNumber(value) {
  return (value || "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function formatAviationFlight(flight, index) {
  return {
    id:
      flight.flight?.iata ||
      flight.flight?.icao ||
      flight.flight?.number ||
      `aviation-${index}`,

    flightNo:
      flight.flight?.iata ||
      flight.flight?.icao ||
      flight.flight?.number ||
      "Unknown",

    airline:
      flight.airline?.name ||
      "Unknown Airline",

    aircraftType: formatAircraft(flight.aircraft),

    icao24: flight.aircraft?.icao24 || "",

    country: flight.departure?.timezone || "",

    lat: null,
    lon: null,
    altitude: null,
    speed: null,
    heading: null,
    direction: "",
    squawk: "",

    status: formatStatus(
      flight.flight_status
    ),

    from:
      flight.departure?.airport ||
      "",

    fromCode:
      flight.departure?.iata ||
      "",

    to:
      flight.arrival?.airport ||
      "",

    toCode:
      flight.arrival?.iata ||
      "",

    departure:
      flight.departure?.scheduled ||
      "",

    arrival:
      flight.arrival?.scheduled ||
      "",

    gate:
      flight.departure?.gate ||
      "",
  };
}

function formatLiveAircraft(aircraft) {
  return {
    id: `opensky-${aircraft.icao24}`,

    flightNo:
      aircraft.callsign ||
      aircraft.icao24?.toUpperCase() ||
      "Unknown",

    airline: "Live aircraft",

    aircraftType:
      "Aircraft type unavailable",

    icao24:
      aircraft.icao24 || "",

    country:
      aircraft.country || "",

    lat:
      aircraft.lat,

    lon:
      aircraft.lon,

    altitude:
      aircraft.altitude,

    speed:
      aircraft.speed,

    heading:
      aircraft.heading,

    direction:
      aircraft.heading != null
        ? `${Math.round(aircraft.heading)}°`
        : "",

    squawk:
      aircraft.squawk || "",

    status:
      aircraft.onGround
        ? "On Ground"
        : "In Flight",

    from: "",
    fromCode: "",

    to: "",
    toCode: "",

    departure: "",
    arrival: "",
    gate: "",
  };
}

export function FlightDataProvider({ children }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchFlights() {
      try {
        setLoading(true);
        setError("");

        /*
          Fetch both APIs separately.

          OpenSky = live aircraft positions
          Aviationstack = flight route/details
        */

        const [aviationResult, positionsResult] =
          await Promise.allSettled([
            fetch(
              "http://localhost:5000/api/flights"
            ),

            fetch(
              "http://localhost:5000/api/positions"
            ),
          ]);

        let aviationFlights = [];
        let liveAircraft = [];

        /* =========================
           AVIATIONSTACK
           ========================= */

        if (
          aviationResult.status === "fulfilled" &&
          aviationResult.value.ok
        ) {
          const aviationData =
            await aviationResult.value.json();

          if (
            aviationData.success !== false &&
            Array.isArray(aviationData.data)
          ) {
            aviationFlights =
              aviationData.data.map(
                formatAviationFlight
              );
          }
        } else {
          console.warn(
            "Aviationstack unavailable. Continuing with OpenSky."
          );
        }

        /* =========================
           OPENSKY
           ========================= */

        if (
          positionsResult.status === "fulfilled" &&
          positionsResult.value.ok
        ) {
          const positionsData =
            await positionsResult.value.json();

          if (
            positionsData.success !== false &&
            Array.isArray(positionsData.data)
          ) {
            liveAircraft =
              positionsData.data.map(
                formatLiveAircraft
              );
          }
        } else {
          console.warn(
            "OpenSky unavailable."
          );
        }

        /* =========================
           IF BOTH APIs FAIL
           ========================= */

        if (
          aviationFlights.length === 0 &&
          liveAircraft.length === 0
        ) {
          throw new Error(
            "Unable to load flight data from the available APIs."
          );
        }

        /* =========================
           MERGE AVIATIONSTACK
           + OPENSKY
           ========================= */

        const mergedFlights =
          aviationFlights.map((flight) => {
            const matchingAircraft =
              liveAircraft.find(
                (aircraft) =>
                  normalizeFlightNumber(
                    aircraft.flightNo
                  ) ===
                    normalizeFlightNumber(
                      flight.flightNo
                    ) ||
                  (
                    flight.icao24 &&
                    aircraft.icao24 &&
                    aircraft.icao24.toLowerCase() ===
                      flight.icao24.toLowerCase()
                  )
              );

            if (!matchingAircraft) {
              return flight;
            }

            return {
              ...flight,

              ...matchingAircraft,

              // Keep route information
              from: flight.from,
              fromCode: flight.fromCode,

              to: flight.to,
              toCode: flight.toCode,

              // Keep Aviationstack details
              airline: flight.airline,

              aircraftType:
                flight.aircraftType,

              departure:
                flight.departure,

              arrival:
                flight.arrival,

              gate:
                flight.gate,
            };
          });

        /* =========================
           ADD UNMATCHED OPENSKY
           AIRCRAFT
           ========================= */

        const unmatchedLiveFlights =
          liveAircraft.filter(
            (aircraft) => {
              const alreadyMatched =
                mergedFlights.some(
                  (flight) =>
                    (
                      flight.icao24 &&
                      aircraft.icao24 &&
                      flight.icao24.toLowerCase() ===
                        aircraft.icao24.toLowerCase()
                    ) ||
                    normalizeFlightNumber(
                      flight.flightNo
                    ) ===
                      normalizeFlightNumber(
                        aircraft.flightNo
                      )
                );

              return !alreadyMatched;
            }
          );

        const finalFlights = [
          ...mergedFlights,
          ...unmatchedLiveFlights,
        ];

        console.log(
          "Skytrack flights:",
          finalFlights.length
        );

        console.log(
          "Live aircraft:",
          liveAircraft.length
        );

        console.log(
          "Aviationstack flights:",
          aviationFlights.length
        );

        if (!cancelled) {
          setFlights(finalFlights);
        }
      } catch (err) {
        console.error(
          "Flight fetching error:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load flight data"
          );

          setFlights([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchFlights();

    /*
      Refresh every 60 seconds
    */

    const intervalId =
      setInterval(
        fetchFlights,
        60 * 1000
      );

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const flightData = {
    flights,
    loading,
    error,
  };

  return (
    <flightDataContext.Provider
      value={flightData}
    >
      {children}
    </flightDataContext.Provider>
  );
}