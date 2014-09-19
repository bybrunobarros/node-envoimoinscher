//var request = require("request");
var joi = require("joi");

var helpers = require("./lib/helpers");
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

function filter(type, val, cb) {
  var filters = {
    collection: ["COMPANY", "DROPOFF_POINT", "HOME", "POST_OFFICE"],
    delivery: ["COMPANY", "HOME", "PICKUP_POINT"]
  };

  if(filters[type].indexOf(val) === -1){
    cb(new Error("wrong "+ type +" value: "+ val));
  }

  var offers = [];

  this.cotation.shipment.offer.forEach(function(elt){ // vérifier array.filter
    if(elt[type].type.code === val){
      offers.push(elt);
    }
  });

  cb(null, offers);
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

// exports.countries = function(){
//   helpers.doRequest({resource:"/countries"}, conf); // partials??
// };
//
//
// exports.categories = function() { // live ou offline
//   helpers.doRequest({resource:"/content_categories"}, conf);
// };
//
// exports.contents = function() { // live ou offline
//   helpers.doRequest({resource:"/content_categories"}, conf);
// };
//
// exports.contentsByCategory = function(id) { // live ou offline
//   helpers.doRequest({resource:"/content_category/"+ id +"/contents"}, conf);
// };

exports.cotation = function(json, cb){
  joi.validate(json, cotationModel, function(err){
    if(err) return cb(err);

    helpers.doRequest({
      resource: "/cotation",
      json: json,
      conf: conf
    }, function(err, data) {
      if(err) return cb(err);

      data.filterByCollection = filter.bind(data, "collection");
      data.filterByDelivery = filter.bind(data, "delivery");
      return cb(null, data);
    });
  });
};

exports.commande = function(){

};
