const request = require("request");

const fetchMyIP = (callback) => {
  let ip = null;

  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      callback(error, null);

      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;

      callback(Error(msg), null);

      return;
    }

    ip = JSON.parse(body).ip;

    callback(error, ip);
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

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);

      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching. Response: ${body}`;

      callback(Error(msg), null);

      return;
    }

    const data = JSON.parse(body).response;

    callback(error, data);
  });
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(error, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };