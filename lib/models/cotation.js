/* jshint maxlen:false */
var j = require("joi");
var courrier = require("./courrier.js").cotation;
var stakeholder = require("./stakeholder.js").cotation;

module.exports = j.object().keys({
  collecte: j.string().isoDate().required(),
  courriers: j.array().includes(courrier).required(),
  code_contenu: j.number().integer().required(),
  delai: j.string().valid("aucun", "minimum", "course").required(),
  destinataire: stakeholder.required(),
  expediteur: stakeholder.required()
});
