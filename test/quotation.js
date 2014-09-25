/* jshint maxlen:false */
/* global describe, before, beforeEach, it */

var assert = require("assert");
var nock = require("nock");

var request = require("../lib/request.js");
var EnvoiMoinsCherError = require("../lib/emc_error.js");

var quotationRequest = require("./fixtures/quotation_request.js");
var now = new Date();
var tomorrow = (new Date(now.setDate(now.getDate()+1))).toISOString();
var emc = {};

describe("EMC cotation", function(){
  before(function(){
    emc = require("../index.js")(require("./fixtures/credentials.js"));
  });

  beforeEach(function(){
    nock.cleanAll();
  });

  it("should get an \"EnvoiMoinsCherError\" error type when the resource is wrong", function(){
    nock("https://"+ emc.config.hostnames.test).
      get("/api/v1/dog").
      reply(404, {
        "content-type": "text/html"
      });

    assert.ifError(request({
      resource:"/dog",
      conf: emc.config
    }, function(err){
      assert.equal(err.message, "HTTP code 404: wrong resource - /dog");
      assert.ok(err instanceof EnvoiMoinsCherError, "err is not an instance of EnvoiMoinsCherError");
    }));
  });

  it("should get an \"EnvoiMoinsCherError\" error type when the EnvoiMoinsCher server is not responding", function(){
    nock("https://"+ emc.config.hostnames.test).
      get("/api/v1/cotation?colis_1.hauteur=10&colis_1.largeur=10&"+
        "colis_1.longueur=10&colis_1.poids=1&colis.valeur=0&code_contenu=80100&"+
        "destinataire.pays=FR&destinataire.code_postal=75001&destinataire.type=entreprise&"+
        "expediteur.pays=FR&expediteur.code_postal=13001&expediteur.type=entreprise&"+
        "collecte="+ encodeURIComponent(tomorrow) +"&delai=aucun").
      reply(502, {
        "content-type": "text/html"
      });

    assert.ifError(request({
      resource:"/cotation",
      json:quotationRequest.ok(tomorrow),
      conf:emc.config
    }, function(err){
      assert.equal(err.message, "HTTP code 502: problem with EnvoiMoinsCher server");
      assert.ok(err instanceof EnvoiMoinsCherError);
    }));
  });

  it("should get an error from EnvoiMoinsCher when a wrong request is done", function(){
    nock("https://"+ emc.config.hostnames.test).
      get("/api/v1/cotation?"+
        "colis_1.largeur=10&colis_1.longueur=10&colis_1.poids=1&"+ //&colis_1.hauteur=10
        "colis.valeur=0&code_contenu=80100&"+
        "destinataire.pays=FR&destinataire.code_postal=75001&destinataire.type=entreprise&"+
        "expediteur.pays=FR&expediteur.code_postal=13001&expediteur.type=entreprise&"+
        "collecte="+ encodeURIComponent(tomorrow) +"&delai=aucun").
      replyWithFile(400, __dirname + "/fixtures/quotation_response_error.xml", {
        "content-type": "application/xml"
      });

    assert.ifError(request({
      resource:"/cotation",
      json:quotationRequest.heightMissing(tomorrow),
      conf:emc.config
    }, function(err){
      assert.equal(err.message, "HTTP code 400: bad_request - invalid content: Veuillez renseigner les dimensions de votre envoi.");
      assert.ok(err instanceof EnvoiMoinsCherError);
    }));
  });

  it("should get a validation error when the request doesn't follow the model", function(){
    nock("https://"+ emc.config.hostnames.test).
      get("/api/v1/cotation?colis_1.hauteur=10&colis_1.largeur=10&"+
        "colis_1.longueur=10&colis_1.poids=1&colis.valeur=0&code_contenu=80100&"+
        "destinataire.pays=FR&destinataire.code_postal=75001&destinataire.type=entreprise&"+
        "expediteur.pays=FR&expediteur.code_postal=13001&expediteur.type=entreprise&"+
        "collecte="+ encodeURIComponent(tomorrow) +"&delai=aucun").
      replyWithFile(200, __dirname + "/fixtures/quotation_response_ok.xml", {
        "content-type": "application/xml"
      });

    emc.quotation(quotationRequest.heightMissing(tomorrow), function(err){
      assert.equal(err.name, "ValidationError");
      assert.ok(err instanceof Error);
    });
  });
});
