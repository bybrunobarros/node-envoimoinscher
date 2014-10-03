var util = require("util");

exports.find = function find(data){
  if(
    Object.prototype.toString.call(data).indexOf("object") === -1 ||
    !(
      data &&
      data.cotation &&
      data.cotation.shipment &&
      data.cotation.shipment.offer
    )){
    throw new Error("Method find() waits for an object like this : data.cotation.shipment.offer");
  }

  var offers = JSON.parse(JSON.stringify(data.cotation.shipment.offer));
  var filters = {
    collection: ["COMPANY", "DROPOFF_POINT", "HOME", "POST_OFFICE"],
    delivery: ["COMPANY", "HOME", "PICKUP_POINT"],
    mode: ["COM", "SYN"],
    operator: true,
    service: true
  };
  var orders = {
    operator: "label",
    service: "label",
    price: "tax-exclusive",
    delivery: "date"
  };
  var _type = "";

  return {
    where: function where(type){
      _type = type;
      if(!filters[_type]){
        throw new Error("The filter {type} doesn't exist".replace("{type}", _type));
      }

      return this;
    },
    is: function is(val){
      if(!val) return this;

      if(!_type){
        throw new Error("is() needs to be called after where()");
      }
      if(util.isArray(filters[_type]) && filters[_type].indexOf(val) === -1){
        throw new Error("Wrong value {val} for {type}, it accepts {enum}".
          replace("{type}", _type).
          replace("{val}", val).
          replace("{enum}", filters[_type].join(", "))
        );
      }

      offers = offers.filter(function(elt){
        return _type === "mode" ? elt.mode === val :
          elt[_type].type ? elt[_type].type.code === val : // collection, delivery
          elt[_type].code ? elt[_type].code === val : // operator, service
          false;
      });

      return this;
    },
    orderBy: function orderBy(type){
      if(!orders[type]){
        throw new Error("Wrong order  type {type}, it accepts {enum}".
          replace("{type}", type).
          replace("{enum}", orders.join(", "))
        );
      }

      if ("operator,service".indexOf(type) > -1){
        offers = offers.sort(function(a, b){
          return a[type][orders[type]] > b[type][orders[type]] ? 1 :
            a[type][orders[type]] < b[type][orders[type]] ? -1 :
            0;
        });
      } else {
        offers = offers.sort(function(a, b){
          return a[type][orders[type]] - b[type][orders[type]];
        });
      }

      return this;
    },
    desc: function desc(){
      offers.reverse();
      return this;
    },
    limitTo: function limitTo(val){
      offers.splice(val);
      return this;
    },
    then: function then(cb){
      return cb(offers);
    },
    return: function ret(){
      return offers;
    }
  };
};
