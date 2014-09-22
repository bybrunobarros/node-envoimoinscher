var util = require("util");

exports.filter = function(type, val, cb) {
  var filters = {
    collection: ["COMPANY", "DROPOFF_POINT", "HOME", "POST_OFFICE"],
    delivery: ["COMPANY", "HOME", "PICKUP_POINT"]
  };

  if(filters[type].indexOf(val) === -1){
    cb(new Error("wrong "+ type +" value: "+ val));
  }

  var offers = this.cotation.shipment.offer.forEach(function(elt){
    return elt[type].type.code === val;
  });

  cb(null, offers);
};

exports.flattenJson = function(json){
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
        delete json[key][i].type;
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
};
