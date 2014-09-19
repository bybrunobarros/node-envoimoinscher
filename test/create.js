/* jshint maxlen:200 */
/* global describe, it */

var assert = require("assert");
var emc = require("../index.js");

describe("EMC create", function(){
  it("set conf.options properties", function(){
    var conf = emc.create({
      username:"fake_username",
      password:"fake_password",
      key:"fake_key"
    });
    assert.equal(conf.options.auth, "fake_username:fake_password");
    assert.equal(conf.options.headers.access_key, "fake_key");
    assert.equal(conf.options.hostname, "test.envoimoinscher.com");
  });
  it("should throw an error when username is missing", function(){
    assert.throws(function(){
        emc.create({
          password:"fake_password",
          key:"fake_key"
        });
      },
      Error,
      "username is missing."
    );
  });
  it("should throw an error when password is missing", function(){
    assert.throws(function(){
        emc.create({
          username:"fake_username",
          key:"fake_key"
        });
      },
      Error,
      "password is missing."
    );
  });
  it("should throw an error when api key is missing", function(){
    assert.throws(function(){
        emc.create({
          username:"fake_username",
          password:"fake_password"
        });
      },
      Error,
      "key is missing."
    );
  });
  it("should throw an error when username is not a string", function(){
      assert.throws(function(){
        emc.create({
          username:42,
          password:"fake_password",
          key:"fake_key"
        });
      },
      TypeError,
      "username type should be string."
    );
  });
  it("should throw an error when password is not a string", function(){
      assert.throws(function(){
        emc.create({
          username:"fake_username",
          password:42,
          key:"fake_key"
        });
      },
      TypeError,
      "password type should be string."
    );
  });
  it("should throw an error when api key is not a string", function(){
      assert.throws(function(){
        emc.create({
          username:"fake_username",
          password:"fake_password",
          key:42
        });
      },
      TypeError,
      "key type should be string."
    );
  });
});
