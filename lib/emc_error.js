var util = require("util");

function EnvoiMoinsCherError(httpCode, message) {
  Error.captureStackTrace(this, this.constructor);

  this.name = "EnvoiMoinsCherError";
  this.message = "HTTP code " + httpCode + ": " + message;
}
util.inherits(EnvoiMoinsCherError, Error);

module.exports = EnvoiMoinsCherError;
