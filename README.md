# node-envoimoinscher [![Build Status](https://travis-ci.org/bybrunobarros/node-envoimoinscher.svg?branch=master)](https://travis-ci.org/bybrunobarros/node-envoimoinscher)

Client pour le service EnvoiMoinsCher (http://www.envoimoinscher.com).

Le module traduit le XML de l'API d'EnvoiMoinsCher en JSON.

## Installation

```bash
$ npm install node-envoimoinscher
```

## Utilisation
Avant toute chose, l'identifiant, le mot de passe et une clé d'API sont nécessaires à l'authentification auprès d'EnvoiMoinsCher.
La clé d'API est à demander par mail.

Ces information sont nécessaires à l'initialisation du module:
```javascript
var emc = require("node-envoimoinscher")({
  username: "...",
  password: "...",
  key: "...",
  environment: "..."
});
```
La propriété `environment` est optionnelle et peut prendre deux valeurs `"prod"` et `"test"`. La valeur par défaut est `"test"`.

### Généralités
`callback` suit la convention habituelle de Node.js, c'est à dire qu'il attend deux arguments :
  * `err`: (object) objet de type `Error` s'il existe une erreur, sinon `null`.
  * `data`: (json) réponse de l'API convertie en JSON s'il n'y a pas d'erreur, sinon `null`.


### emc.quotation(`conf`, `callback`)
Obtient l'ensemble des offres possibles ainsi qu'un récapitulatif de la demande.
  * `conf`: (json) contient les informations nécessaires à la demande de cotations.

Exemple:
```json
{
  "courriers": [{           // (array) une collection d'objets représentant l'envoi
    "type": "colis",        // (string) type d'envoi: "pli", "colis", "encombrant", "palette"
    "hauteur": 10,          // (int) la hauteur, ne pas renseigner si le courrier est un "pli"
    "largeur": 11,          // (int)
    "longueur": 12,         // (int)
    "poids": 13,            // (int)
    "valeur": 14            // (number) en euros
  }],
  "code_contenu": 80100,    // (int) id obtenu via emc.contentsByCategory(), par exemple
  "destinataire": {
    "pays": "FR",           // (string) code ISO du pays via emc.countries(), par exemple
    "code_postal": "75001", // (string)
    "type": "entreprise"    // (string) type d'interlocuteur: "particulier", "entreprise"
  },
  "expediteur": {
    "pays": "FR",
    "code_postal": "13001",
    "type": "entreprise"
  },
  "collecte": "2014-10-02", // (string) date au format ISO YYYY-MM-DD
  "delai": "aucun"          // (string) le tri de la réponse dépend de sa valeur: "aucun", "minimum", "course"
}
```
Exemple:
```javascript
emc.quotation(conf, function(err, data){
  if(err) return console.log(err);
  return console.log(data);
});
```

Extrait de réponse:
Il est possible voir à quoi ressemble une réponse dans [quotation_response.json](test/fixtures/quotation_response.json).

### emc.order(`conf`, `callback`)
Effectue la commande et récupère l'objet retourné par EnvoiMoinsCher.
  * `conf`: (json) contient les informations nécessaires à la soumission d'une commande. C'est un objet `conf` de cotation étendu.

Exemple:
```json
{
  "courriers": [{
    "type": "colis",
    "hauteur": 10,
    "largeur": 10,
    "longueur": 10,
    "poids": 1,
    "valeur": 0,
    "description": "Du vide."
  }],
  "code_contenu": 80100,
  "destinataire": {
    "adresse": "1 rue de Rivoli",
    "civilite": "M.",
    "code_postal": "75001",
    "email": "bernard@lesbronzes.com",
    "nom": "Morin",
    "pays": "FR",
    "prenom": "Bernard",
    "type": "particulier",
    "ville": "Paris",
    "tel": "06060606060"
  },
  "expediteur": {
    "adresse": "1 avenue de la Canebière",
    "civilite": "M.",
    "code_postal": "13001",
    "email": "jc@lesbronzes.com",
    "nom": "Dusse",
    "pays": "FR",
    "prenom": "Jean-Claude",
    "societe": "bitbucket",           // (string) si la partie prenante est de type "entreprise"
    "type": "entreprise",
    "ville": "Marseille",
    "tel": "06060606060"
  },
  "collecte": "2014-10-02",
  "delai": "aucun",
  "operateur": "UPSE",
  "service": "Express",
  "disponibilite": {
    "HDE": "11:00",                    // (string) au format ISO hh:mm
    "HLE": "19:00"
  }
}
```

Exemple:
```javascript
emc.order(conf, function(err, data){
  if(err) return console.log(err);
  return console.log(data);
});
```

Extrait de réponse:
Il est possible voir à quoi ressemble une réponse dans [order_response_ok.json](test/fixtures/order_response_ok.json).

### emc.find(`quotation`)
Rend les offres d'une cotation requêtable. Les méthodes mises à la chaîne rendent la requête facilement lisible et sont exécutées dans l'ordre.

L'exemple suivant retourne cinq offres de l'opérateur UPSE (UPS) classé dans le sens alphabétique contraire:
```javascript
emc.
  find(data).
  where("operator").
  is("UPSE").
  orderBy("service").
  desc().
  limitTo(5).
  then(function(offers){
    offers.forEach(function(elt){
      console.log(elt.service.label);
    });
  });
```

### emc.find(`data`).where(`type`).is(`value`)
Ces deux méthodes doivent être utilisées de pair.
  * `type`: (string) peut prendre pour valeur `"collection"`, `"delivery"`, `"mode"`, `"operator"`, `"service"`
  * `value`: (string) peut prendre différentes valeur selon le filtre associé
    * `collection`: `"COMPANY"`, `"DROPOFF_POINT"`, `"HOME"`, `"POST_OFFICE"`
    * `delivery`: `"COMPANY"`, `"HOME"`, `"PICKUP_POINT"`
    * `mode`: `"COM"`, `"SYN"`
    * `operator`: (string) libre, correspond au code de l'opérateur, par exemple `"USPE"`
    * `service`: (string) libre, correspond au code du service, par exemple `"ExpressNational18H"`

### emc.find(`data`).orderBy(`type`)
Permet d'ordonner les offres par `type`.

### emc.find(`data`).desc()
Permet d'inverser l'ordre des offres.

### emc.find(`data`).limitTo(`limit`)
Permet de imiter le nombre de résultats.
  * `limit`: (int)

### emc.find(`data`).then(`callback`)
Exécute le callback (function), return() et when() ne peuvent pas être utilisées ensemble.
`callback` ne prend qu'un seul argument:
  * `offers`: (array) collection d'offres.

### emc.find(`data`).return()
Retourne la collection d'offres (array), return() et when() ne peuvent pas être utilisées ensemble.

Exemple:
```javascript
var offers = emc.
  find(data).
  where("operator").
  is("UPSE").
  orderBy("service").
  desc().
  limitTo(5).
  return();
```

### emc.countries(`callback`)
Obtient la liste complète des pays.

Exemple:
```javascript
emc.countries(function(err, data){
  if(err) return console.log(err);
  return console.log(data);
});
```

Extrait de réponse:
```json
{
  "countries": {
    "country": [
      {
        "code": "P1",
        "label": "ACORES &amp;&#35;40;PORTUGAL&#41;"
      },
      {
        "code": "AF",
        "label": "AFGHANISTAN"
      },
      // ...
    ]
  }
}
```

### emc.categories(`callback`)
Obtient la liste complète des catégories de contenus possibles.

Exemple:
```javascript
emc.categories(function(err, data){
  if(err) return console.log(err);
  return console.log(data);
});
```
Extrait de réponse:
```json
{
  "content_categories": {
    "content_category": [
      {
        "code": 10000,
        "label": "Livres et documents"
      },
      {
        "code": 20000,
        "label": "Alimentation et matières périssables"
      },
      // ...
    ]
  }
}
```

### emc.contents(`callback`)
Obtient la liste complète des contenus possibles.

Exemple:
```javascript
emc.contents(function(err, data){
  if(err) return console.log(err);
  return console.log(data);
});
```

Extrait de réponse:
```json
{
  "contents": {
    "content": [
      {
        "code": 100,
        "label": "Contenu non spécifié",
        "category": 0
      },
      {
        "code": 10100,
        "label": "Documents sans valeur commerciale",
        "category": 10000
      },
      {
        "code": 10120,
        "label": "Journaux",
        "category": 10000
      },
      // ...
    ]
  }
}

```
### emc.contentsByCategory(`id`, `callback`)
Obtient la liste des contenus d'une catégorie.
  * `id`: (string) référence de la catégorie.

Exemple:
```javascript
emc.contentsByCategory(80000, function(err, data){
  if(err) return console.log(err);
  return console.log(data);
});
```
Extrait de réponse:
```json
{
  "contents": {
    "content": [
      {
        "code": 80100,
        "label": "Produits culturels : livres, jeux, CD, DVD etc"
      },
      {
        "code": 80200,
        "label": "Appareils électroniques, Image et son etc"
      },
      // ...
    ]
  }
}
```

### emc.dropoff(`id`, [`country`,] `callback`)
Obtient le détail d'un point relais de départ.
  * `id`: (string) référence du point relai.
  * `country`: (string) code pays ISO, `"FR"` par défaut.

Exemple:
```javascript
emc.dropoff("SOGP-C3084", function(err, data){
  if(err) return console.log(err);
  return console.log(data);
});
```
Extrait de réponse:
```json
{
  "dropoff_point": {
    "code": "SOGP-C3084",
    "name": "STOCK PREMIUM",
    "address": "25 RUE RICHARD LENOIR",
    "city": "PARIS 11",
    "zipcode": 75011,
    "country": "FR",
    "phone": {},
    "description": {},
    "schedule": {
      "day": [
        {
          "weekday": 1,
          "open_am": "11:00:00",
          "close_am": "15:00:00",
          "open_pm": "15:00:00",
          "close_pm": "20:00:00"
        },
      // ...
      ]
    }
  }
}
```

### emc.pickup(`id`, [`country`,] `callback`)
Obtient le détail d'un point relais d'arrivée.
  * `id`: (string) référence du point relai.
  * `country`: (string) code pays ISO, `"FR"` par défaut.

Exemple:
```javascript
emc.pickup("SOGP-C3059", function(err, data){
  if(err) return console.log(err);
  return console.log(data);
});

Extrait de réponse:
```json
{
  "pickup_point": {
    "code": "SOGP-C3059",
    "name": "PLASTIC SOUL RECORDS",
    "address": "93, AVENUE LEDRU ROLLIN",
    "city": "PARIS 11",
    "zipcode": 75011,
    "country": "FR",
    "phone": {},
    "description": {},
    "schedule": {
      "day": [
        {
          "weekday": 1,
          "open_am": "$horaire.debut_am",
          "close_am": "$horaire.fin_am",
          "open_pm": "16:30:00",
          "close_pm": "20:00:00"
        },
        // ...
      ]
    }
  }
}
```
