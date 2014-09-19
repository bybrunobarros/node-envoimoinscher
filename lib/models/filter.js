var j = require("joi");

module.exports = j.object().keys({
  description: j.string(),
  hauteur: j.number().integer(),
  largeur: j.number().integer().required(),
  longueur: j.number().integer().required(),
  poids: j.number().integer().required(),
  type: j.string().valid("pli", "colis", "encombrant", "palette").required(),
  valeur: j.number().when("type", {
    is: "pli",
    then: j.forbidden(),
    otherwise: j.required()
  }),

  operateur: j.string(),
  service: j.string().when("operateur", {
    is: j.string(),
    then: j.optional(),
    otherwise: j.forbidden()
  }),
  prix_max_ttc: j.number().integer(),
  prix_max_ht: j.number().integer(),
  prix_exact_ttc: j.number().integer(),
  prix_exact_ht: j.number().integer()
});
