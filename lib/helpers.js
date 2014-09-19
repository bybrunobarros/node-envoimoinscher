var https = require("https");
var qs = require("querystring");
var util = require("util");
var xml2json = require("xml2json");
var EnvoiMoinsCherError = require("./emc_error.js");



function flattenJson(json){
  var o = {};
  var i = 0;
  var key = "";
  var subkey = "";
  var type = "";

  for(key in json){
    if(util.isArray(json[key])){
      for(i = json[key].length; i--;){
        if(!json[key][i].type) continue;

        type = json[key][i].type;
        for(subkey in json[key][i]){
          if(subkey === type) continue;

          o[type + "_" + (i+1) + "." + subkey] = json[key][i][subkey];
        }
      }
    } else if (Object.prototype.toString.call(json[key]).indexOf("Object") > -1) {
      for(subkey in json[key]){
        o[key + "." + subkey] = json[key][subkey];
      }
    } else {
      o[key] = json[key];
    }
  }

  return o;
}

exports.doRequest = function(obj, cb){
  var querystring = obj.flattenedJson || obj.json ?
    "?" + qs.stringify(obj.flattenedJson || flattenJson(obj.json)) :
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
/*
      fs.writeFile("cotation_response.json", JSON.stringify(data, null, "\t"), function (err) {
        if (err) throw err;
        console.log("It\"s saved!");
      });
*/
      return cb(null, data);
    });
  });
  req.end();

  req.on("error", function(err) {
    return cb(err, null);
  });
};
