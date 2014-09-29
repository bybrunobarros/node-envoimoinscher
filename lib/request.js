var https = require("https");
var qs = require("querystring");
var xml2json = require("xml2json");

var helpers = require("./helpers.js");
var EnvoiMoinsCherError = require("./emc_error.js");

module.exports = function(obj, cb){
  var querystring = obj.flattenedJson || obj.json ?
    "?" + qs.stringify(obj.flattenedJson || helpers.flattenJson(obj.json)) :
    "";
  var conf = JSON.parse(JSON.stringify(obj.conf));
  conf.options.path += obj.resource + querystring;

  var req = https.request(conf.options, function(res) {
    var buffer = "";

    if(res.headers["content-type"].indexOf("application/xml") === -1) {
      var message = res.statusCode === 404 ? "wrong resource - " + obj.resource :
        res.statusCode >= 500 ? "problem with EnvoiMoinsCher server" : // try to request again?
        "unknown";

      return cb(new EnvoiMoinsCherError(res.statusCode, message));
    }

    res.on("data", function(d) {
      buffer += d;
    });

    res.on("end", function(){
      var data = "";

      try{
        data = JSON.parse(xml2json.toJson(buffer));
      } catch(err){
        return cb(err);
      }

      if (res.statusCode >= 400) {
        return cb(new EnvoiMoinsCherError(res.statusCode, data.error.message));
      }

      return cb(null, data);
    });
  });
  req.end();

  req.on("error", function(err) {
    return cb(err, null);
  });
};
