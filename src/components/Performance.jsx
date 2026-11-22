import { useFlights } from "../context/useFlights";

// Create Performance component
function Performance() {
  const { flights } = useFlights();
  const statusLabels = ["In Flight", "On Ground", "Other"];
  const statuses = statusLabels.map((label, index) => ({
    label,
    className: ["green", "orange", "red"][index],
    count: label === "Other"
      ? flights.filter((flight) => !["In Flight", "On Ground"].includes(flight.status)).length
      : flights.filter((flight) => flight.status === label).length,
  }));
  const percentage = (count) => flights.length ? `${Math.round((count / flights.length) * 100)}%` : "0%";
  const inFlightPercentage = flights.length ? (statuses[0].count / flights.length) * 100 : 0;
  const onGroundPercentage = flights.length ? (statuses[1].count / flights.length) * 100 : 0;
  const otherPercentage = flights.length ? (statuses[2].count / flights.length) * 100 : 0;

  return (

    <div className="performance-panel">


      {/* Heading */}

      <div className="panel-heading">

        <div>

          <h2>
            Today's Performance
          </h2>

          <p>
            Sample aircraft status
          </p>

        </div>

      </div>



      {/* Performance Content */}

      <div className="performance-content">


        {/* Donut Chart */}

        <div
          className="donut-chart"
          style={{
            background: `conic-gradient(#16a36a 0% ${inFlightPercentage}%, #ed8b2d ${inFlightPercentage}% ${inFlightPercentage + onGroundPercentage}%, #8e79a4 ${inFlightPercentage + onGroundPercentage}% ${inFlightPercentage + onGroundPercentage + otherPercentage}%, #dce4ed ${inFlightPercentage + onGroundPercentage + otherPercentage}% 100%)`,
          }}
        >

          <div className="donut-center">

            <strong>
              {flights.length}
            </strong>

            <span>
              Aircraft
            </span>

          </div>

        </div>



        {/* Statistics */}

        <div className="performance-stats">
          {statuses.map((status) => (
            <div key={status.label}>
              <span className={`dot ${status.className}`}></span>
              {status.label}
              <strong>{percentage(status.count)}</strong>
            </div>
          ))}
        </div>

      </div>



      {/* Small Bar Chart */}

      <div className="mini-chart">

        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>

      </div>


    </div>

  );
}


// Export
export default Performance;