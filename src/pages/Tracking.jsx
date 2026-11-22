import { useState } from "react";
import {
  Plane,
  Navigation,
  Gauge,
  ArrowUp,
} from "lucide-react";
import { useFlights } from "../context/useFlights";

function Tracking() {
  const { flights } = useFlights();

  const [selectedFlightId, setSelectedFlightId] =
    useState(null);

  /* ---------------------------------------
     ONLY AIRCRAFT WITH REAL COORDINATES
  --------------------------------------- */

  const plottedFlights = flights
    .filter(
      (flight) =>
        Number.isFinite(flight.lat) &&
        Number.isFinite(flight.lon)
    )
    .slice(0, 80);

  /* ---------------------------------------
     SELECTED AIRCRAFT
  --------------------------------------- */

  const selectedFlight =
    flights.find(
      (flight) => flight.id === selectedFlightId
    ) ||
    plottedFlights[0] ||
    flights[0];

  /* ---------------------------------------
     COUNTS
  --------------------------------------- */

  const airborneFlights = flights.filter(
    (flight) => flight.status === "In Flight"
  ).length;

  const groundedFlights = flights.filter(
    (flight) => flight.status === "On Ground"
  ).length;

  const aircraftTypes = new Set(
    flights
      .map((flight) => flight.aircraftType)
      .filter(
        (type) =>
          type &&
          type !== "Type not reported" &&
          type !== "Aircraft type unavailable"
      )
  );

  /* ---------------------------------------
     MAP COORDINATES

     India:
     Longitude: 67 → 98
     Latitude: 5 → 37
  --------------------------------------- */

  const getCoordinates = (flight) => {
    const x = Math.max(
      3,
      Math.min(
        97,
        ((flight.lon - 67) / 31) * 100
      )
    );

    const y = Math.max(
      5,
      Math.min(
        95,
        ((37 - flight.lat) / 32) * 100
      )
    );

    return { x, y };
  };

  const selectedPosition =
    selectedFlight &&
    Number.isFinite(selectedFlight.lat) &&
    Number.isFinite(selectedFlight.lon)
      ? getCoordinates(selectedFlight)
      : null;

  /* ---------------------------------------
     HEADING
  --------------------------------------- */

  const heading = Number.isFinite(
    selectedFlight?.heading
  )
    ? selectedFlight.heading
    : 0;

  const headingRadians =
    (heading * Math.PI) / 180;

  const headingEnd = selectedPosition
    ? {
        x: Math.max(
          2,
          Math.min(
            98,
            selectedPosition.x +
              Math.sin(headingRadians) * 8
          )
        ),

        y: Math.max(
          2,
          Math.min(
            98,
            selectedPosition.y -
              Math.cos(headingRadians) * 8
          )
        ),
      }
    : null;

  /* ---------------------------------------
     EMPTY STATE
  --------------------------------------- */

  if (flights.length === 0) {
    return (
      <main className="page tracking-page">
        <div className="page-heading">
          <div>
            <span className="breadcrumb">
              SKYTRACK / TRACKING
            </span>

            <h1>Flight Tracking</h1>

            <p>
              Monitor live aircraft positions
              across India.
            </p>
          </div>
        </div>

        <div className="no-flights">
          No current aircraft positions
          available.
        </div>
      </main>
    );
  }

  return (
    <main className="page tracking-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="page-heading">
        <div>
          <span className="breadcrumb">
            SKYTRACK / TRACKING
          </span>

          <h1>Flight Tracking</h1>

          <p>
            Monitor live aircraft positions
            and headings across India.
          </p>
        </div>
      </div>

      {/* =====================================
          LIVE MAP
      ===================================== */}

      <div
        className="tracking-map"
        aria-label="Live aircraft position map"
      >

        {/* MAP HEADER */}

        <div className="tracking-map-heading">
          <div>
            <span>LIVE AIRCRAFT DATA</span>

            <strong>
              INDIA AIRSPACE
            </strong>
          </div>

          <div className="tracking-live">
            <span className="live-dot"></span>
            LIVE
          </div>
        </div>

        {/* =================================
            HEADING LINE
        ================================= */}

        {selectedPosition &&
          headingEnd && (
            <svg
              className="tracking-route-line"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="heading-arrow"
                  markerWidth="5"
                  markerHeight="5"
                  refX="4"
                  refY="2.5"
                  orient="auto"
                >
                  <path
                    d="M 0 0 L 5 2.5 L 0 5 z"
                    fill="currentColor"
                  />
                </marker>
              </defs>

              <line
                x1={selectedPosition.x}
                y1={selectedPosition.y}
                x2={headingEnd.x}
                y2={headingEnd.y}
                markerEnd="url(#heading-arrow)"
              />
            </svg>
          )}

        {/* =================================
            AIRCRAFT POINTS
        ================================= */}

        {plottedFlights.map((flight) => {
          const point =
            getCoordinates(flight);

          const aircraftHeading =
            Number.isFinite(flight.heading)
              ? flight.heading
              : 0;

          const isSelected =
            flight.id ===
            selectedFlight?.id;

          return (
            <button
              key={flight.id}
              type="button"
              className={`tracking-aircraft-point ${
                isSelected
                  ? "selected"
                  : ""
              }`}
              title={`${flight.flightNo} · ${flight.lat.toFixed(
                2
              )}, ${flight.lon.toFixed(2)}`}
              aria-label={`Select ${flight.flightNo}`}
              aria-pressed={isSelected}
              onClick={() =>
                setSelectedFlightId(
                  flight.id
                )
              }
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
            >
              <Plane
                size={10}
                style={{
                  transform: `rotate(${
                    aircraftHeading + 90
                  }deg)`,
                }}
              />
            </button>
          );
        })}

        {/* =================================
            SELECTED AIRCRAFT
        ================================= */}

        {selectedPosition ? (
          <div
            className="tracking-plane selected"
            style={{
              left: `${selectedPosition.x}%`,
              top: `${selectedPosition.y}%`,
            }}
          >
            <div className="selected-plane-icon">
              <Plane
                size={11}
                style={{
                  transform: `rotate(${
                    heading + 90
                  }deg)`,
                }}
              />
            </div>

            <span>
              {selectedFlight?.flightNo ||
                "Unknown"}
            </span>
          </div>
        ) : (
          <div className="tracking-map-note">
            No aircraft position available
          </div>
        )}

        {/* MAP LABEL */}

        {selectedPosition && (
          <div className="tracking-map-note">
            Projected heading
          </div>
        )}

        {/* =================================
            SELECTED FLIGHT CARD
        ================================= */}

        {selectedPosition &&
          selectedFlight && (
            <div className="selected-flight-mini-card">

              <div className="mini-card-top">

                <div>
                  <small>
                    SELECTED FLIGHT
                  </small>

                  <strong>
                    {selectedFlight.flightNo}
                  </strong>
                </div>

                <span
                  className="flight-status"
                >
                  {selectedFlight.status}
                </span>

              </div>

              <div className="mini-card-route">

                {selectedFlight.fromCode ||
                  selectedFlight.from ||
                  "Unknown"}

                <span>→</span>

                {selectedFlight.toCode ||
                  selectedFlight.to ||
                  "Unknown"}

              </div>

              <div className="mini-card-stats">

                <div>
                  <Gauge size={12} />

                  <span>
                    {Number.isFinite(
                      selectedFlight.altitude
                    )
                      ? `${Math.round(
                          selectedFlight.altitude
                        ).toLocaleString()} ft`
                      : "N/A"}
                  </span>
                </div>

                <div>
                  <Navigation size={12} />

                  <span>
                    {Number.isFinite(
                      selectedFlight.speed
                    )
                      ? `${Math.round(
                          selectedFlight.speed
                        )} kt`
                      : "N/A"}
                  </span>
                </div>

                <div>
                  <ArrowUp size={12} />

                  <span>
                    {Number.isFinite(
                      selectedFlight.heading
                    )
                      ? `${Math.round(
                          selectedFlight.heading
                        )}°`
                      : "N/A"}
                  </span>
                </div>

              </div>
            </div>
          )}
      </div>

      {/* =====================================
          FLIGHT ROSTER
      ===================================== */}

      <div className="tracking-roster">

        <div className="tracking-roster-heading">

          <div>
            <span>
              FLIGHT ROSTER
            </span>

            <h2>
              Live aircraft
            </h2>
          </div>

          <strong>
            {flights.length
              .toString()
              .padStart(2, "0")}
          </strong>

        </div>

        {/* =================================
            ROSTER LIST
        ================================= */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxHeight: "430px",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "4px",
            boxSizing: "border-box",
          }}
          aria-label="Live flights and aircraft"
        >

          {flights
            .slice(0, 60)
            .map((flight) => {

              const isSelected =
                flight.id ===
                selectedFlight?.id;

              /* Location text */

              const locationText =
                flight.from &&
                flight.to
                  ? `${flight.from} → ${flight.to}`
                  : Number.isFinite(
                      flight.lat
                    ) &&
                    Number.isFinite(
                      flight.lon
                    )
                  ? `${flight.lat.toFixed(
                      2
                    )}°, ${flight.lon.toFixed(
                      2
                    )}${
                      flight.direction
                        ? ` · Heading ${flight.direction}`
                        : ""
                    }`
                  : "Position unavailable";

              return (
                <button
                  key={flight.id}
                  type="button"
                  onClick={() =>
                    setSelectedFlightId(
                      flight.id
                    )
                  }
                  aria-pressed={
                    isSelected
                  }
                  style={{
                    width: "100%",
                    minHeight: "108px",

                    padding:
                      "14px 16px",

                    margin: 0,

                    boxSizing:
                      "border-box",

                    display: "grid",

                    gridTemplateColumns:
                      "minmax(0, 1fr) auto",

                    gridTemplateRows:
                      "22px 16px 16px 16px",

                    columnGap: "12px",

                    rowGap: "5px",

                    border: isSelected
                      ? "2px solid #4c9c82"
                      : "1px solid #e2e8e5",

                    borderRadius:
                      "12px",

                    background:
                      isSelected
                        ? "#f2f9f6"
                        : "#ffffff",

                    textAlign: "left",

                    cursor: "pointer",

                    color:
                      "#1b2926",

                    fontFamily:
                      "inherit",

                    overflow:
                      "hidden",

                    flexShrink: 0,
                  }}
                >

                  {/* FLIGHT NUMBER */}

                  <strong
                    style={{
                      gridColumn: "1",
                      gridRow: "1",

                      display: "block",

                      minWidth: 0,

                      fontSize: "14px",

                      fontWeight: 700,

                      lineHeight:
                        "22px",

                      color:
                        "#1b2926",

                      whiteSpace:
                        "nowrap",

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",
                    }}
                  >
                    {flight.flightNo ||
                      "Unknown"}
                  </strong>

                  {/* STATUS */}

                  <span
                    style={{
                      gridColumn: "2",
                      gridRow: "1",

                      alignSelf:
                        "center",

                      justifySelf:
                        "end",

                      display: "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      height: "22px",

                      padding:
                        "0 9px",

                      borderRadius:
                        "20px",

                      background:
                        "#e6f5ef",

                      color:
                        "#287d67",

                      fontSize: "9px",

                      fontWeight: 700,

                      lineHeight: "1",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {flight.status}
                  </span>

                  {/* AIRLINE */}

                  <span
                    style={{
                      gridColumn:
                        "1 / -1",

                      gridRow: "2",

                      display: "block",

                      minWidth: 0,

                      fontSize: "11px",

                      lineHeight:
                        "16px",

                      color:
                        "#657671",

                      whiteSpace:
                        "nowrap",

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",
                    }}
                  >
                    {flight.airline ||
                      "Live aircraft"}
                  </span>

                  {/* AIRCRAFT */}

                  <span
                    style={{
                      gridColumn:
                        "1 / -1",

                      gridRow: "3",

                      display: "block",

                      minWidth: 0,

                      fontSize: "11px",

                      lineHeight:
                        "16px",

                      color:
                        "#7f8d89",

                      whiteSpace:
                        "nowrap",

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",
                    }}
                  >
                    {flight.aircraftType ||
                      "Aircraft type unavailable"}
                  </span>

                  {/* LOCATION */}

                  <span
                    style={{
                      gridColumn:
                        "1 / -1",

                      gridRow: "4",

                      display: "block",

                      minWidth: 0,

                      fontSize: "10px",

                      lineHeight:
                        "16px",

                      color:
                        "#899691",

                      whiteSpace:
                        "nowrap",

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",
                    }}
                  >
                    {locationText}
                  </span>

                </button>
              );
            })}

        </div>
      </div>

      {/* =====================================
          TRACKING STATISTICS
      ===================================== */}

      <div className="tracking-info">

        <div>
          <strong>
            {flights.length}
          </strong>

          <span>
            Live Aircraft
          </span>
        </div>

        <div>
          <strong>
            {airborneFlights}
          </strong>

          <span>
            In Flight
          </span>
        </div>

        <div>
          <strong>
            {groundedFlights}
          </strong>

          <span>
            On Ground
          </span>
        </div>

        <div>
          <strong>
            {aircraftTypes.size}
          </strong>

          <span>
            Aircraft Types
          </span>
        </div>

      </div>

    </main>
  );
}

export default Tracking;