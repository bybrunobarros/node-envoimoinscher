/* jshint maxlen:200 */
/* global describe, before, beforeEach, it */

var assert = require("assert");
var nock = require("nock");

var emc = require("../index.js");

var request = require("../lib/request.js");
var EnvoiMoinsCherError = require("../lib/emc_error.js");

var conf = require("../lib/conf/base_conf.js");
var credentials = require("./fixtures/credentials.js");

var cotationRequest = require("./fixtures/cotation_request.js");
var now = new Date();
var tomorrow = (new Date(now.setDate(now.getDate()+1))).toISOString();
var scope;

describe("EMC cotation", function(){
  before(function(){
    conf = emc.create(credentials);
  });

  beforeEach(function(){
    nock.cleanAll();
  });

// after(function(){
//   scope.done();
// });

  it("should get an \"EnvoiMoinsCherError\" error type and a message \"HTTP code 404: wrong resource - /dog\"", function(){
    scope = nock("https://"+ conf.hostnames.test).
      get("/api/v1/dog").
      reply(404, {
        "content-type": "text/html"
      });

    assert.ifError(request({
      resource:"/dog",
      conf: conf
    }, function(err){
      assert.ok(err instanceof EnvoiMoinsCherError, "err is not an instance of EnvoiMoinsCherError");
      assert.equal(err.message, "HTTP code 404: wrong resource - /dog");
    }));
  });

  it("should get an \"EnvoiMoinsCherError\" error type when EnvoiMoinsCher server is not responding", function(){
    scope = nock("https://"+ conf.hostnames.test).
    get("/api/v1/cotation?colis_1.hauteur=10&colis_1.largeur=10&"+
      "colis_1.longueur=10&colis_1.poids=1&colis_1.valeur=0&code_contenu=80100&"+
      "destinataire.pays=FR&destinataire.code_postal=75001&destinataire.type=entreprise&"+
      "expediteur.pays=FR&expediteur.code_postal=13001&expediteur.type=entreprise&"+
      "collecte="+ encodeURIComponent(tomorrow) +"&delai=aucun").
      reply(502, {
        "content-type": "text/html"
      });

    assert.ifError(request({
      resource:"/cotation",
      json:cotationRequest.ok(tomorrow),
      conf:conf
    }, function(err){
      assert.ok(err instanceof EnvoiMoinsCherError);
      assert.equal(err.message, "HTTP code 502: problem with EnvoiMoinsCher server");
    }));
  });

  it("should get an error from \"EnvoiMoinsCherError\" when a wrong request is done", function(){
    scope = nock("https://"+ conf.hostnames.test).
      get("/api/v1/cotation?"+
        "colis_1.largeur=10&colis_1.longueur=10&colis_1.poids=1&"+ //&colis_1.hauteur=10
        "colis_1.valeur=0&code_contenu=80100&"+
        "destinataire.pays=FR&destinataire.code_postal=75001&destinataire.type=entreprise&"+
        "expediteur.pays=FR&expediteur.code_postal=13001&expediteur.type=entreprise&"+
        "collecte="+ encodeURIComponent(tomorrow) +"&delai=aucun").
      replyWithFile(400, __dirname + "/fixtures/cotation_response_error.xml", {
        "content-type": "application/xml"
      });


    assert.ifError(request({
      resource:"/cotation",
      json:cotationRequest.heightMissing(tomorrow),
      conf:conf
    }, function(err){
      assert.ok(err instanceof EnvoiMoinsCherError);
      assert.equal(err.message, "HTTP code 400: bad_request - invalid content: Veuillez renseigner les dimensions de votre envoi.");
    }));
  });

  it("should get a validation error when the request doesn't follow the model", function(){
    scope = nock("https://"+ conf.hostnames.test).
      get("/api/v1/cotation?colis_1.hauteur=10&colis_1.largeur=10&"+
        "colis_1.longueur=10&colis_1.poids=1&colis_1.valeur=0&code_contenu=80100&"+
        "destinataire.pays=FR&destinataire.code_postal=75001&destinataire.type=entreprise&"+
        "expediteur.pays=FR&expediteur.code_postal=13001&expediteur.type=entreprise&"+
        "collecte="+ encodeURIComponent(tomorrow) +"&delai=aucun").
      replyWithFile(200, __dirname + "/fixtures/cotation_response_ok.xml", {
        "content-type": "application/xml"
      });

    emc.cotation(cotationRequest.heightMissing(tomorrow), function(err){
      assert.ok(err instanceof Error);
      assert.equal(err.name, "ValidationError");
    });
  });
});
