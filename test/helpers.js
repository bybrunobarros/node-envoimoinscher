/* jshint maxlen:false */
/* global describe, it */

var assert = require("assert");

var helpers = require("../lib/helpers.js");
var cotationRequest = require("./fixtures/cotation_request.js");
var now = new Date();
var tomorrow = (new Date(now.setDate(now.getDate()+1))).toISOString();

describe("Helpers", function(){
  it("should format the JSON object to the EnvoiMoinsCher format", function(){
    var flattenJson = helpers.flattenJson(cotationRequest.ok(tomorrow));

    assert.strictEqual(typeof flattenJson["colis_1.type"], "undefined");
    assert.equal(flattenJson["colis_1.hauteur"], 10);
    assert.equal(flattenJson["expediteur.pays"], "FR");
  });
});
