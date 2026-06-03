/**
 * config.js
 * ---------
 * Set USE_BACKEND = false  → works offline with localStorage (no Flask needed)
 * Set USE_BACKEND = true   → calls your Flask backend at API_BASE_URL
 */
const CONFIG = {
  USE_BACKEND:  false,                      // ← change to true when Flask is running
  API_BASE_URL: "http://localhost:5000",    // ← your Render URL when deployed
};
