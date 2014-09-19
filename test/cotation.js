/* jshint maxlen:200 */
/* global describe, before, beforeEach, it */

var assert = require("assert");
var nock = require("nock");

var emc = require("../index.js");

var helpers = require("../lib/helpers.js");
var EnvoiMoinsCherError = require("../lib/emc_error.js");

var conf = require("../lib/conf/base_conf.js");
var credentials = require("./fixtures/credentials.js");

var cotationRequest = require("./fixtures/cotation_request.json");


describe("EMC cotation", function(){
  before(function(){
    conf = emc.create(credentials);
  });

  beforeEach(function(){
    nock.cleanAll();
  });


  it("should get an error type \"EnvoiMoinsCherError\" and a message \"HTTP code 404: wrong resource - /dog\"", function(){
    nock("https://"+ conf.hostnames.test).
      get("/api/v1/dog").
      reply(404, {
        "content-type": "text/html"
      });

    assert.ifError(helpers.doRequest({
      resource:"/dog",
      conf: conf
    }, function(err){
      assert.ok(err instanceof EnvoiMoinsCherError, "err is not an instance of EnvoiMoinsCherError");
      assert.equal("HTTP code 404: wrong resource - /dog", err.message);
    }));
  });

  it("should get an error type \"EnvoiMoinsCherError\" and a message \"HTTP code 502: problem with EnvoiMoinsCher server\"", function(){
    nock("https://"+ conf.hostnames.test).
      get("/api/v1/cotation?colis_1.type=colis&colis_1.hauteur=10&colis_1.largeur=10&"+
        "colis_1.longueur=10&colis_1.poids=1&colis_1.valeur=0&code_contenu=80100&"+
        "destinataire.pays=FR&destinataire.code_postal=93400&destinataire.type=entreprise&"+
        "expediteur.pays=FR&expediteur.code_postal=13001&expediteur.type=entreprise&"+
        "collecte=2014-09-18T00%3A00%3A00.000Z&delai=aucun").
      reply(502, {
        "content-type": "text/html"
      });

    assert.ifError(helpers.doRequest({
      resource:"/cotation",
      json:cotationRequest.ok,
      conf:conf
    }, function(err){
      assert.ok(err instanceof EnvoiMoinsCherError);
      assert.equal("HTTP code 502: problem with EnvoiMoinsCher server", err.message);
    }));
  });

  it("should get an error from \"EnvoiMoinsCherError\"", function(){
    nock("https://"+ conf.hostnames.test).
      get("/api/v1/cotation?colis_1.type=colis&colis_1.largeur=10&"+ //&colis_1.hauteur=10
        "colis_1.longueur=10&colis_1.poids=1&colis_1.valeur=0&code_contenu=80100&"+
        "destinataire.pays=FR&destinataire.code_postal=93400&destinataire.type=entreprise&"+
        "expediteur.pays=FR&expediteur.code_postal=13001&expediteur.type=entreprise&"+
        "collecte=2014-09-18T00%3A00%3A00.000Z&delai=aucun").
      replyWithFile(400, __dirname + "/fixtures/cotation_response_error.xml", {
        "content-type": "application/xml"
      });


    assert.ifError(helpers.doRequest({
      resource:"/cotation",
      json:cotationRequest.height_missing,
      conf:conf
    }, function(err){
      assert.ok(err instanceof EnvoiMoinsCherError);
      assert.equal("HTTP code 400: bad_request - invalid content: Veuillez renseigner les dimensions de votre envoi.", err.message);
    }));
  });

  it("should get a validation error", function(){
    nock("https://"+ conf.hostnames.test).
      get("/api/v1/cotation?colis_1.type=colis&colis_1.hauteur=10&colis_1.largeur=10&"+
        "colis_1.longueur=10&colis_1.poids=1&colis_1.valeur=0&code_contenu=80100&"+
        "destinataire.pays=FR&destinataire.code_postal=93400&destinataire.type=entreprise&"+
        "expediteur.pays=FR&expediteur.code_postal=13001&expediteur.type=entreprise&"+
        "collecte=2014-09-18T00%3A00%3A00.000Z&delai=aucun").
      replyWithFile(200, __dirname + "/fixtures/cotation_response_ok.xml", {
        "content-type": "application/xml"
      });

    emc.cotation(cotationRequest.height_missing, function(err){
      assert.ok(err instanceof Error);
      assert.equal(err.name, "ValidationError");
    });
  });
});
