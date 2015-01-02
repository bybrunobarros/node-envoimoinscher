var https = require("https");
var qs = require("querystring");
var parser = new require("xml2js").Parser({explicitArray: false});

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
      try{
        parser.parseString(buffer, function(err, result) {
          if (res.statusCode >= 400) {
            return cb(new EnvoiMoinsCherError(res.statusCode, result.error.message));
          }
          return cb(null, JSON.parse(JSON.stringify(result)));
        });
      } catch(err){
        return cb(err);
      }
    });
  });
  req.end();

  req.on("error", function(err) {
    return cb(err, null);
  });
};
