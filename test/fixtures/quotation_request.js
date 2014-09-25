
exports.ok = function(tomorrow){
  return {
    "courriers": [{
      "type": "colis",
      "hauteur": 10,
      "largeur": 11,
      "longueur": 12,
      "poids": 13,
      "valeur": 14
    }],
    "code_contenu": 80100,
    "destinataire": {
      "pays": "FR",
      "code_postal": "75001",
      "type": "entreprise"
    },
    "expediteur": {
      "pays": "FR",
      "code_postal": "13001",
      "type": "entreprise"
    },
    "collecte": tomorrow,
    "delai": "aucun"
  };
};

exports.heightMissing = function(tomorrow){
  return {
    "courriers": [{
      "type": "colis",
      "largeur": 11,
      "longueur": 12,
      "poids": 13,
      "valeur": 14
    }],
    "code_contenu": 80100,
    "destinataire": {
      "pays": "FR",
      "code_postal": "75001",
      "type": "entreprise"
    },
    "expediteur": {
      "pays": "FR",
      "code_postal": "13001",
      "type": "entreprise"
    },
    "collecte": tomorrow,
    "delai": "aucun"
  };
};
