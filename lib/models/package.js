/* jshint maxlen:false */
var j = require("joi");

exports.quotation = j.object().keys({
  hauteur: j.number().integer().when("type", {
    is: "pli",
    then: j.forbidden(),
    otherwise: j.required()
  }),
  largeur: j.number().integer().required(),
  longueur: j.number().integer().required(),
  poids: j.number().integer().required(),
  type: j.string().valid("pli", "colis", "encombrant", "palette").required(),
  valeur: j.number()
});

exports.order = j.object().keys({
  description: j.string(),
  hauteur: j.number().integer().when("type", {
    is: "pli",
    then: j.forbidden(),
    otherwise: j.required()
  }),
  largeur: j.number().integer().required(),
  longueur: j.number().integer().required(),
  poids: j.number().integer().required(),
  type: j.string().valid("pli", "colis", "encombrant", "palette").required(),
  valeur: j.number()
});
