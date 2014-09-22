
exports.ok = function(tomorrow){
  return {
    "courier": [{
      "type": "colis",
      "hauteur": 10,
      "largeur": 10,
      "longueur": 10,
      "poids": 1,
      "valeur": 0
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
    "courier": [{
      "type": "colis",
      "largeur": 10,
      "longueur": 10,
      "poids": 1,
      "valeur": 0
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
