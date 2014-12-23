/* jshint maxlen:false */
var j = require("joi");
var pkg = require("./package.js").quotation;
var stakeholder = require("./stakeholder.js").quotation;

module.exports = j.object().keys({
  collecte: j.string().isoDate().required(),
  courriers: j.array().includes(pkg).required(),
  code_contenu: j.number().integer().required(),
  delai: j.string().valid("aucun", "minimum", "course").required(),
  destinataire: stakeholder.required(),
  expediteur: stakeholder.required()
});
