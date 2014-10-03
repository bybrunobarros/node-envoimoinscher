/* jshint maxlen:false */
var j = require("joi");
var package = require("./package.js").quotation;
var stakeholder = require("./stakeholder.js").quotation;

module.exports = j.object().keys({
  collecte: j.string().isoDate().required(),
  packagess: j.array().includes(package).required(),
  code_contenu: j.number().integer().required(),
  delai: j.string().valid("aucun", "minimum", "course").required(),
  destinataire: stakeholder.required(),
  expediteur: stakeholder.required()
});
