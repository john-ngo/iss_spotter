/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API
  let ip = null;

  request("https://api.ipify.org?format=json", (error, response, body) => {
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);

      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;

      callback(Error(msg), null);

      return;
    }

    ip = JSON.parse(body).ip;

    callback(error, ip);
    // if we get here, all's well and we got the data
  });
};

const fetchCoordsByIP = (ip, callback) => {
  let data = null;

  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);

      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;

      callback(Error(msg), null);

      return;
    }

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;

      callback(Error(message), null);

      return;
    }

    const { latitude, longitude } = parsedBody;
    data = { latitude, longitude };

    callback(error, data);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };