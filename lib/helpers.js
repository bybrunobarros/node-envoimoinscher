var util = require("util");

function formatCourriers(json){
  var courriers = json.courriers;
  var o = {};
  var type = "";

  if(courriers && util.isArray(courriers)){
    for(var i = courriers.length; i--;){
      type = courriers[i].type;
      delete courriers[i].type;
      for(var key in courriers[i]){
        if(key === type) continue;
        if("description,valeur".indexOf(key) > -1){
          o[type + "." + key] = courriers[i][key];
        } else {
          o[type + "_" + (i+1) + "." + key] = courriers[i][key];
        }

      }
    }
  }
  return o;
}

exports.flattenJson = function(json){
  var o = formatCourriers(json);
  var key = "";
  var subkey = "";

  for(key in json){
    if(key === "courriers") continue;

    if (Object.prototype.toString.call(json[key]).indexOf("Object") > -1) {
      for(subkey in json[key]){
        o[key + "." + subkey] = json[key][subkey];
      }
    } else {
      o[key] = json[key];
    }
  }

  return o;
};
