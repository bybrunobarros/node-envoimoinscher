/* jshint maxlen:false */
var j = require("joi");

exports.options = j.object().keys({
  assurance: {
    emballage: j.string().valid("Boîte", "Caisse", "Bac", "Emballage isotherme", "Etui", "Malle", "Sac", "Tube"),
    fermeture: j.string().valid("Fermeture autocollante", "Ruban adhésif", "Agrafes", "Clous", "Collage", "Ruban de cerclage", "Sangle ou feuillard", "Agraphes et cerclage", "Clous et cerclage"),
    fixation: j.string().valid("Sans système de stabilisation", "Film transparent", "Film opaque", "Film opaque et sangles", "Film transparent et sangles", "Sangle ou feuillard uniquement"),
    materiau: j.string().valid("Carton", "Bois", "Carton blindé", "Film opaque", "Film transparent", "Métal", "Papier", "Papier armé", "Plastique et carton", "Plastique", "Plastique opaque", "Plastique transparent", "Polystyrène"),
    nombre: j.number().integer(), //!\ 1)
    protection: j.string().valid("Sans protection particulière", "Calage papier", "Bulles plastiques", "Carton antichoc", "Coussin air", "Coussin mousse", "Manchon carton (bouteille)", "Manchon mousse (bouteille)", "Matelassage", "Plaque mousse", "Polystyrène", "Coussin de calage", "Sachet bulles"),
    selection: j.boolean()
  },
  "contre-remboursement": {
    selection: j.boolean(),
    valeur: j.number()
  },
  depot: {
    pointrelais: j.string()
  },
  disponibilite: {
    HDE: j.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/),
    HLE: j.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
  },
  livraison_imperative: {
    DIL: j.string().regex(/^(0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])[-](20)\d\d$/)
  },
  retrait: {
    pointrelais: j.string()
  },
  type_emballage: {
    emballage: j.string()
  }
});


// 1) assurance.nombre	le nombre des colis sur la palette (int, uniquement pour l'envoi d'une palette)