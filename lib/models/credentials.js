/* jshint maxlen:false */
var j = require("joi");

module.exports = j.object().keys({
  username:j.string().required(),
  password:j.string().required(),
  key:j.string().required(),
  environment:j.string().valid("prod", "test")
});
