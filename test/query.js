/* jshint maxlen:false */
/* global describe, it */

var assert = require("assert");
var util = require("util");
var query = require("../lib/query.js");
var data = require("./fixtures/quotation_response.json");

// describe("Query", function(){
//   it("should throw an error when data is invalid", function(){
//     assert.ifError(query.find(), function(err){
//       console.log(err);
//       assert.equal(err.message, "Method find() waits for an object like this : data.cotation.shipment.offer");
//     });
//   });
// });

describe("Query", function(){
  it("should find offers", function(){
    query.find(data).then(function(offers){
      assert(util.isArray(offers), "offers is an array");
      assert(offers[0].operator && offers[0].service && offers[0].collection && offers[0].delivery, "offers items have specifics properties");
    });

    var offers = query.find(data).return();
    assert(util.isArray(offers), "offers is an array");
    assert(offers[0].operator && offers[0].service && offers[0].collection && offers[0].delivery, "offers items have specifics properties");
  });

  it("should filter", function(){
    query.
      find(data).
      where("mode").
      is("SYN").
      then(function(offers){
        assert.equal(offers.length, 0, "there are 0 items with a SYN mode");
      });
    query.
      find(data).
      where("collection").
      is("DROPOFF_POINT").
      then(function(offers){
        assert.equal(offers.length, 4, "there are 4 items with a DROPOFF_POINT collection");
      });
    query.
      find(data).
      where("operator").
      is("TNTE").
      then(function(offers){
        assert.equal(offers.length, 7, "there are 7 items with a TNTE operator");
      });
      query.
        find(data).
        where("operator").
        is().
        then(function(offers){
          assert.equal(offers.length, 20, "there are 20 items when badly filtered");
        });
  });

  it("should order the array", function(){
    query.
      find(data).
      orderBy("price").
      then(function(offers){
        assert.equal(offers[0].price["tax-exclusive"], 9.41, "first price is 9.41");
        assert.equal(offers[19].price["tax-exclusive"], 62.47, "last price is 62.47");
      });
    query.
      find(data).
      orderBy("service").
      then(function(offers){
        assert.equal(offers[0].service.label, "13:00 Express", "first service is 13:00 Express");
        assert.equal(offers[19].service.label, "UPS Standard", "last service is UPS Standard");
      });
  });

  it("should reverse the array order", function(){
    query.
      find(data).
      desc().
      then(function(offers){
        assert.equal(offers[0].operator.label, "UPS", "first operator is UPS");
        assert.equal(offers[19].operator.label, "Chronopost", "last operator is Chronopost");
      });
  });

  it("should limit the number of items", function(){
    query.
      find(data).
      limitTo(3).
      then(function(offers){
        assert.equal(offers.length, 3, "there are 3 items when limited to 3");
      });
  });
});
