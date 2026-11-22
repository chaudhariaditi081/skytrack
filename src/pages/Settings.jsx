import {
  User,
  Shield,
  Moon,
} from "lucide-react";


function Settings({ darkMode, setDarkMode }) {

  const handlePasswordChange = () => {
    const confirmed = window.confirm(
      "Password change is not connected to a backend in this demo. Would you like to continue with a simulated change?"
    );

    if (!confirmed) return;

    window.alert(
      "Password change request received. This demo app does not save passwords, so no real change was made."
    );
  };

  return (

    <main className="page">


      {/* Heading */}

      <div className="page-heading">

        <div>

          <span className="breadcrumb">
            SKYTRACK / SETTINGS
          </span>

          <h1>
            Settings
          </h1>

          <p>
            Manage your account and dashboard preferences.
          </p>

        </div>

      </div>



      {/* Profile */}

      <div className="settings-card">

        <div className="settings-title">

          <User size={19} />

          <div>

            <h2>
              Profile
            </h2>

            <p>
              Manage your profile information.
            </p>

          </div>

        </div>


        <div className="profile-info">

          <div className="profile-avatar">
            A
          </div>

          <div>

            <strong>
              Aditi
            </strong>

            <span>
              Administrator
            </span>

          </div>

        </div>

      </div>



      {/* Appearance */}

      <div className="settings-card">

        <div className="settings-title">

          <Moon size={19} />

          <div>

            <h2>
              Appearance
            </h2>

            <p>
              Customize your dashboard appearance.
            </p>

          </div>

        </div>


        <div className="setting-option">

          <div>

            <strong>
              Dark Mode
            </strong>

            <span>
              Use dark mode for the dashboard.
            </span>

          </div>


          <button
            className={
              darkMode
                ? "toggle active"
                : "toggle"
            }

            onClick={() =>
              setDarkMode(!darkMode)
            }
          >

            <span></span>

          </button>

        </div>

      </div>



      {/* Security */}

      <div className="settings-card">

        <div className="settings-title">

          <Shield size={19} />

          <div>

            <h2>
              Security
            </h2>

            <p>
              Manage account security settings.
            </p>

          </div>

        </div>


        <button
          className="password-button"
          onClick={handlePasswordChange}
        >
          Change Password
        </button>

      </div>

    </main>

  );
}

export default Settings;