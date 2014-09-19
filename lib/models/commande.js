var j = require("joi");
var courier = require("./courier.js");
var stakeholder = require("./stakeholder.js");

module.exports = j.object().keys({
  collecte: j.string().isoDate().required(),
  courier: j.array().includes(courier).required(),
  code_contenu: j.number().integer().required(),
  delai: j.string().valid("aucun", "minimum", "course").required(),
  destinataire: stakeholder.extended.required(),
  expediteur: stakeholder.extended.required(),
  url_tracking: j.string()
});
