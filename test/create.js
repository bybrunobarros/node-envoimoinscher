/* jshint maxlen:false */
/* global describe, it */

var assert = require("assert");

describe("EMC create", function(){
  it("should set conf.options properties", function(){
    var emc = require("../index.js")({
      username:"fake_username",
      password:"fake_password",
      key:"fake_key"
    });
    assert.equal(emc.config.options.auth, "fake_username:fake_password");
    assert.equal(emc.config.options.headers.access_key, "fake_key");
    assert.equal(emc.config.options.hostname, "test.envoimoinscher.com");
  });

  it("should throw an error when username is missing", function(){
    assert.throws(function(){
        require("../index.js")({
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
        require("../index.js")({
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
        require("../index.js")({
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
        require("../index.js")({
          username:42,
          password:"fake_password",
          key:"fake_key"
        });
      },
      Error,
      "username type should be string."
    );
  });

  it("should throw an error when password is not a string", function(){
      assert.throws(function(){
        require("../index.js")({
          username:"fake_username",
          password:42,
          key:"fake_key"
        });
      },
      Error,
      "password type should be string."
    );
  });

  it("should throw an error when api key is not a string", function(){
      assert.throws(function(){
        require("../index.js")({
          username:"fake_username",
          password:"fake_password",
          key:42
        });
      },
      Error,
      "key type should be string."
    );
  });
});
