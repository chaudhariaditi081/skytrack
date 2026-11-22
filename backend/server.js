
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Cache successful responses for 2 minutes.
const CACHE_MS = 2 * 60 * 1000;
const RETRY_MS = 5 * 60 * 1000;

const cache = {
  flights: { data: null, expires: 0, retryAfter: 0 },
  positions: { data: null, expires: 0, retryAfter: 0 },
};

async function cachedFetch(key, fetchData) {
  const entry = cache[key];
  const now = Date.now();

  if (entry.data && now < entry.expires) {
    return entry.data;
  }

  if (now < entry.retryAfter) {
    if (entry.data) return entry.data;

    const error = new Error(
      "API rate limit reached. Please wait before trying again."
    );
    error.status = 429;
    throw error;
  }

  try {
    const data = await fetchData();

    entry.data = data;
    entry.expires = Date.now() + CACHE_MS;
    entry.retryAfter = 0;

    return data;
  } catch (error) {
    if (error.status === 429) {
      entry.retryAfter = Date.now() + RETRY_MS;
    }

    // Keep old data available when a refresh fails.
    if (entry.data) return entry.data;

    throw error;
  }
}

function sendError(res, error, provider) {
  console.error(`${provider} error:`, error.message);

  res.status(error.status || 502).json({
    success: false,
    message: error.message || `${provider} request failed`,
  });
}

// Aviationstack flight details
app.get("/api/flights", async (req, res) => {
  try {
    const data = await cachedFetch("flights", async () => {
      if (
        !process.env.AVIATIONSTACK_API_URL ||
        !process.env.AVIATIONSTACK_ACCESS_KEY
      ) {
        throw new Error("Aviationstack configuration is missing.");
      }

      const url = new URL(process.env.AVIATIONSTACK_API_URL);

      url.searchParams.set(
        "access_key",
        process.env.AVIATIONSTACK_ACCESS_KEY
      );
      url.searchParams.set(
        "limit",
        process.env.AVIATIONSTACK_LIMIT || "100"
      );

      if (process.env.AVIATIONSTACK_DEPARTURE_IATA) {
        url.searchParams.set(
          "dep_iata",
          process.env.AVIATIONSTACK_DEPARTURE_IATA
        );
      }

      const response = await fetch(url);

      if (response.status === 429) {
        const error = new Error("Aviationstack rate limit reached.");
        error.status = 429;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(
          `Aviationstack returned ${response.status}`
        );
        error.status = 502;
        throw error;
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(
          data.error.message || "Aviationstack API error."
        );
      }

      return data;
    });

    res.json(data);
  } catch (error) {
    sendError(res, error, "Aviationstack");
  }
});

// Live aircraft positions over India
app.get("/api/positions", async (req, res) => {
  try {
    const data = await cachedFetch("positions", async () => {
      const url = new URL(
        "https://opensky-network.org/api/states/all"
      );

      url.searchParams.set("lamin", "5");
      url.searchParams.set("lomin", "68");
      url.searchParams.set("lamax", "38");
      url.searchParams.set("lomax", "98");

      const response = await fetch(url);

      if (response.status === 429) {
        const error = new Error("OpenSky rate limit reached.");
        error.status = 429;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(
          `OpenSky returned ${response.status}`
        );
        error.status = 502;
        throw error;
      }

      const result = await response.json();

      const positions = (result.states || [])
        .filter((state) => state[5] != null && state[6] != null)
        .map((state) => ({
          icao24: state[0],
          callsign: state[1]?.trim() || "",
          country: state[2] || "",
          lon: state[5],
          lat: state[6],
          altitude: state[7],
          onGround: state[8],
          speed: state[9],
          heading: state[10],
          verticalRate: state[11],
          squawk: state[14] || "",
        }));

      return {
        success: true,
        count: positions.length,
        data: positions,
      };
    });

    res.json(data);
  } catch (error) {
    sendError(res, error, "OpenSky");
  }
});

// Start the server only once.
app.listen(PORT, () => {
  console.log(`Skytrack API server running on http://localhost:${PORT}`);
});
