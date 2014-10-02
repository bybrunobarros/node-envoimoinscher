var joi = require("joi");

var conf = require("./lib/conf/base_conf.js");
var query = require("./lib/query.js");
var request = require("./lib/request.js");
var model = require("./lib/models");


function assertArgument(val, name){
  if (!val){
    throw new Error(name + " is missing.");
  }
  if (typeof val !== "string"){
    throw new TypeError(name + " type should be string.");
  }
}

function setupRequest(resource){
  return function(){ // (id, cb) or (cb)
    request({
      resource: arguments.length === 2 ?
        resource.replace("{id}", arguments[0]) :
        resource,
      conf: conf
    }, arguments[1] || arguments[0]);
  };
}

function quotation(json, cb){
  joi.validate(json, model.cotation, function(err){
    if(err) return cb(err);

    request({
      resource: "/cotation",
      json: json,
      conf: conf
    }, function(err, data) {
      if(err) return cb(err);
      return cb(null, data);
    });
  });
}

function order(json, cb){
  joi.validate(json, model.commande, function(err){
    if(err) return cb(err);

    conf.options.method = "POST";
    request({
      resource: "/order",
      json: json,
      conf: conf
    }, function(err, data) {
      if(err) return cb(err);
      return cb(null, data);
    });
  });
}

module.exports = function create(credentials){
  assertArgument(credentials.username, "username");
  assertArgument(credentials.password, "password");
  assertArgument(credentials.key, "key");

  conf.options.auth = credentials.username + ":" + credentials.password;
  conf.options.headers.access_key = credentials.key;
  conf.options.hostname = conf.hostnames[credentials.env || "test"];

  return {
    config: conf,
    categories: setupRequest("/content_categories"),
    contents: setupRequest("/contents"),
    countries: setupRequest("/countries"),
    dropoffs: setupRequest("/dropoff_point/dropoff_point_code/informations"),
    pickups: setupRequest("/pickup_point/pickup_point_code/informations"),
    contentsByCategory: setupRequest("/content_category/{id}/contents"),
    orderStatus: setupRequest("/order_status/{id}/informations"),
    quotation: quotation,
    order: order,
    find: query.find
  };
};
