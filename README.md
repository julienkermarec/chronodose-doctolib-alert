# Chronodose-doctolib-alert

Le but de ce projet est d'avoir une alternative a l'outil chronodose de l'application vitemadose développé par l'équipe de @GuillaumeRozier qui a 30min de retard car Doctolib a imposé un délai a cause des nombreux utilisateurs qui utilisent l'application Vitemadose.

## Techno

Le projet est un projet NodeJS développé en quelques heures, il peut être utilisé en local ou hebergé sur un serveur.

Les alertes sont soit visibles sur le terminal dans les logs, soit en utilisant des notifications push avec Firebase et une application mobile.

## Variables

La clé Firebase d'envoie de notification
> FIREBASE_CLOUD_MESSAGING_SERVER_KEY = "XXXX";

Le token FCM pour envoyer une notification a un utilisateur
> USER_FCM_TOKEN = "XXXX";

L'url du JSON des différents centre de vaccination de doctolib
> DOCTOLIB_VILLE_JSON_URL = "https://www.doctolib.fr/vaccination-covid-19/rennes.json?ref_visit_motive_ids%5B%5D=6970&ref_visit_motive_ids%5B%5D=7005";


## Initialisation

> npm i

> node index.js

