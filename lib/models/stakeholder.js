var j = require("joi");

exports.core = j.object().keys({
  pays: j.string().min(2).max(2),
  code_postal: j.string(),
  type: j.valid("particulier", "entreprise")
});

exports.extended = j.object().keys({
  pays: j.string().min(2).max(2),
  code_postal: j.string(),
  type: j.valid("particulier", "entreprise"),
  societe:j.string().when("type", {
    is: "entreprise",
    then: j.required(),
    otherwise: j.forbidden()
  }),
  ville: j.string().required(),
  adresse: j.string().required().
    notes("numéro et rue - s'il y a plusieurs lignes, les séparer avec '|'"),
  titre: j.string(),
  prenom: j.string(),
  nom: j.string(),
  email: j.string().email(),
  tel: j.string(),
  tel2: j.string()
});
