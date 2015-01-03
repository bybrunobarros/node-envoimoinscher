var joi = require("joi");

var conf = require("./lib/conf/base_conf.js");
var query = require("./lib/query.js");
var request = require("./lib/request.js");
var model = require("./lib/models");

function setupRequest(resource){
  return function(){ // (id, country, cb) or (id, cb) or (cb)
    var id = arguments.length > 1 ? arguments[0] : "";
    var country = arguments.length === 3 ? arguments[1] : "FR";
    var cb = arguments[arguments.length-1];

    request({
      resource: resource.
        replace("{id}", id).
        replace("{country}", country),
      conf: conf
    }, cb);
  };
}

function quotation(json, cb){
  joi.validate(json, model.quotation, function(err, validQuotation){
    if(err) return cb(err);

    request({
      resource: "/cotation",
      json: validQuotation,
      conf: conf
    }, function(err, data) {
      if(err) return cb(err);
      return cb(null, data);
    });
  });
}

function order(json, cb){
  joi.validate(json, model.order, function(err, validOrder){
    if(err) return cb(err);

    conf.options.method = "POST";
    request({
      resource: "/order",
      json: validOrder,
      conf: conf
    }, function(err, data) {
      if(err) return cb(err);
      return cb(null, data);
    });
  });
}

module.exports = function init(credentials){
  var isValid = joi.validate(credentials, model.credentials);
  if(isValid.error){
    throw isValid.error;
  }

  conf.options.auth = credentials.username + ":" + credentials.password;
  conf.options.headers.access_key = credentials.key;
  conf.options.hostname = conf.hostnames[credentials.environment || "test"];

  return {
    config: conf,
    categories: setupRequest("/content_categories"),
    contents: setupRequest("/contents"),
    countries: setupRequest("/countries"),
    dropoff: setupRequest("/dropoff_point/{id}/{country}/informations"),
    pickup: setupRequest("/pickup_point/{id}/{country}/informations"),
    contentsByCategory: setupRequest("/content_category/{id}/contents"),
    orderStatus: setupRequest("/order_status/{id}/informations"),
    quotation: quotation,
    order: order,
    find: query.find
  };
};
