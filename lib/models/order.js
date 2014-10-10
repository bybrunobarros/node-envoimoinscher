/* jshint maxlen:false */
var j = require("joi");
var package = require("./package.js").order;
var stakeholder = require("./stakeholder.js").order;
var version = require("../../package.json").version;

module.exports = j.object().keys({
  platform: j.string().default("api"),
  platform_version: j.string(),
  module_version: j.string().default(version),
  collecte: j.string().isoDate().required(),
  packages: j.array().includes(package).required(),
  code_contenu: j.number().integer().required(),
  delai: j.string().valid("aucun", "minimum", "course").required(),
  destinataire: stakeholder.required(),
  expediteur: stakeholder.required(),
  url_tracking: j.string(),
  operateur: j.string().required(),
  service: j.string().required(),
  disponibilite: j.object().keys({
    HDE: j.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/),
    HLE: j.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
  }),
  assurance: j.object().keys({
    emballage: j.string().valid("Boîte", "Caisse", "Bac", "Emballage isotherme", "Etui", "Malle", "Sac", "Tube"),
    fermeture: j.string().valid("Fermeture autocollante", "Ruban adhésif", "Agrafes", "Clous", "Collage", "Ruban de cerclage", "Sangle ou feuillard", "Agraphes et cerclage", "Clous et cerclage"),
    fixation: j.string().valid("Sans système de stabilisation", "Film transparent", "Film opaque", "Film opaque et sangles", "Film transparent et sangles", "Sangle ou feuillard uniquement"),
    materiau: j.string().valid("Carton", "Bois", "Carton blindé", "Film opaque", "Film transparent", "Métal", "Papier", "Papier armé", "Plastique et carton", "Plastique", "Plastique opaque", "Plastique transparent", "Polystyrène"),
    nombre: j.number().integer(),
    protection: j.string().valid("Sans protection particulière", "Calage papier", "Bulles plastiques", "Carton antichoc", "Coussin air", "Coussin mousse", "Manchon carton (bouteille)", "Manchon mousse (bouteille)", "Matelassage", "Plaque mousse", "Polystyrène", "Coussin de calage", "Sachet bulles"),
    selection: j.boolean()
  }),
  "contre-remboursement": j.object().keys({
    selection: j.boolean(),
    valeur: j.number()
  }),
  depot: j.object().keys({
    pointrelais: j.string()
  }),
  livraison_imperative: j.object().keys({
    DIL: j.string().regex(/^(0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])[-](20)\d\d$/)
  }),
  retrait: j.object().keys({
    pointrelais: j.string()
  }),
  type_emballage: j.object().keys({
    emballage: j.string()
  })
});
