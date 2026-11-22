// Create reusable StatCard component
function StatCard({
  icon,
  title,
  value,
  change
}) {

  return (

    <div className="stat-card">


      {/* Icon */}

      <div className="stat-icon">
        {icon}
      </div>



      {/* Card Information */}

      <div className="stat-content">

        <span>
          {title}
        </span>


        <h2>
          {value}
        </h2>


        <small>
          {change}
        </small>

      </div>


    </div>

  );
}


// Export component
export default StatCard;