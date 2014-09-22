var joi = require("joi");

var helpers = require("./lib/helpers.js");
var request = require("./lib/request.js");
var conf = require("./lib/conf/base_conf.js");
var cotationModel = require("./lib/models/cotation.js");

function assertArgument(val, name){
  if (!val){
    throw new Error(name + " is missing.");
  }
  if (typeof val !== "string"){
    throw new TypeError(name + " type should be string.");
  }
}

function doCommonRequest(resource){
  return function(cb){
    request({
      resource:resource,
      conf: conf
    }, cb);
};
}

exports.create = function(emc){
  assertArgument(emc.username, "username");
  assertArgument(emc.password, "password");
  assertArgument(emc.key, "key");

  conf.options.auth = emc.username + ":" + emc.password;
  conf.options.headers.access_key = emc.key;
  conf.options.hostname = conf.hostnames[emc.env || "test"];

  return conf;
};

exports.categories = doCommonRequest("/content_categories");
exports.contents = doCommonRequest("/contents");
exports.countries = doCommonRequest("/countries");

exports.contentsByCategory = function(id, cb) {
  request({
    resource:"/content_category/"+ id +"/contents",
    conf: conf
  }, cb);
};

exports.cotation = function(json, cb){
  joi.validate(json, cotationModel, function(err){
    if(err) return cb(err);

    request({
      resource: "/cotation",
      json: json,
      conf: conf
    }, function(err, data) {
      if(err) return cb(err);

      data.filterByCollection = helpers.filter.bind(data, "collection");
      data.filterByDelivery = helpers.filter.bind(data, "delivery");
      return cb(null, data);
    });
  });
};

exports.commande = function(){

};
