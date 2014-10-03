/* jshint maxlen:false */
var j = require("joi");

exports.quotation = j.object().keys({
  pays: j.string().min(2).max(2),
  code_postal: j.string(),
  type: j.string().valid("particulier", "entreprise")
});

exports.order = j.object().keys({
  pays: j.string().min(2).max(2),
  code_postal: j.string(),
  type: j.string().valid("particulier", "entreprise"),
  societe:j.string().when("type", {
    is: "entreprise",
    then: j.required(),
    otherwise: j.forbidden()
  }),
  ville: j.string().required(),
  adresse: j.string().required().
    notes("numéro et rue - s'il y a plusieurs lignes, les séparer avec '|'"),
  civilite: j.string().required(),
  prenom: j.string().required(),
  nom: j.string().required(),
  email: j.string().email().required(),
  tel: j.string(),
  tel2: j.string()
});
