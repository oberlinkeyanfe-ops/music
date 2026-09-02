# Music App — Vue 3 + Pinia + Vue Router + Firebase

Application de partage de musique : inscription/connexion, upload de titres (MP3),
lecture audio, commentaires, gestion des titres. Basée sur le guide chronologique
du cours (validation, Firebase, routing, upload, player).

Projet vérifié : tous les fichiers `.js` passent `node --check` (syntaxe valide),
tous les composants importés existent et leurs props correspondent entre parent
et enfant, tous les exports Firebase sont utilisés de façon cohérente, et toutes
les règles de validation utilisées dans les formulaires sont bien enregistrées.

## Prérequis

- [Node.js](https://nodejs.org) version 18 ou supérieure (vérifiez avec `node -v`)
- Un compte gratuit sur [Firebase](https://console.firebase.google.com)

## 1. Installation des dépendances

Dans le dossier du projet :

```bash
npm install
```

1. Créez un projet sur https://console.firebase.google.com
2. Activez **Authentication** → méthode "E-mail/Mot de passe"
3. Créez une base **Firestore** (mode test pour démarrer)
4. Activez **Storage**
5. Dans les paramètres du projet → "Vos applications" → ajoutez une app Web,
   copiez la config, et collez-la dans `src/includes/firebase.js` :

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  appId: "...",
};
```

### Règles Firestore (à publier dans la console Firebase)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow create: if request.auth != null;
      allow write, delete: if request.auth != null && request.auth.uid == resource.data.uid;
    }
  }
}
```

### Règles Storage (à publier dans la console Firebase)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && request.resource.contentType == 'audio/mpeg'
        && request.resource.size < 10 * 1024 * 1024;
      allow delete: if request.auth != null;
    }
  }
}
```

## 3. Lancer en développement

```bash
npm run dev
```

Le terminal affichera une URL du type `http://localhost:5173` — ouvrez-la dans
votre navigateur. Le serveur se recharge automatiquement à chaque modification.

## 4. Build de production

```bash
npm run build
npm run preview
```

`npm run build` génère le dossier `dist/` (optimisé, prêt à déployer).
`npm run preview` sert ce build localement pour le tester avant déploiement.

## Dépannage rapide

- **Page blanche / rien ne s'affiche** : ouvrez la console du navigateur (F12).
  Dans 90 % des cas, c'est que `src/includes/firebase.js` contient encore les
  valeurs `VOTRE_...` non remplacées par votre vraie config Firebase.
- **Erreur "Missing or insufficient permissions"** : les règles Firestore/Storage
  n'ont pas été publiées dans la console Firebase (voir section 2 ci-dessus).
- **`npm install` échoue** : vérifiez votre version de Node (`node -v`, ≥ 18
  recommandé) et votre connexion internet.
- **Le style Tailwind ne s'applique pas** : vérifiez que le serveur (`npm run dev`)
  a bien été relancé après l'installation des dépendances.

## Structure du projet

```
src/
  main.js               # point d'entrée, attend Firebase Auth avant de monter l'app
  App.vue                # layout global (Header + page + Player + modale Auth)
  router/index.js        # routes + guard d'authentification (meta.requiresAuth)
  stores/
    modal.js             # état d'ouverture de la modale de connexion
    user.js               # inscription / connexion / déconnexion
    player.js             # lecteur audio (Howler.js)
  includes/
    firebase.js           # config + instances Firebase (auth, db, storage, collections)
    validation.js         # règles et messages VeeValidate
    helper.js              # formatage du temps (mm:ss)
  components/
    Header.vue             # navigation + liens conditionnels selon l'auth
    Auth.vue                # modale login/register avec validation complète
    Upload.vue               # zone de dépôt de fichiers + upload Firebase Storage
    CompositionItem.vue       # édition / suppression d'un titre
    SongItem.vue               # item de la liste sur la page d'accueil
    Player.vue                  # lecteur audio fixe en bas de page
  views/
    Home.vue                     # liste des titres + scroll infini
    About.vue                     # page statique
    Manage.vue                     # page protégée : upload + gestion des titres
    Song.vue                        # page d'un titre + commentaires
```

## Fonctionnalités couvertes

- Inscription / connexion / déconnexion (Firebase Auth)
- Validation de formulaires (VeeValidate) : requis, email, longueur, âge min/max,
  confirmation de mot de passe, CGU
- Modale de connexion pilotée par un store Pinia dédié
- Route protégée `/manage` (redirection si non connecté)
- Upload de fichiers MP3 par glisser-déposer, avec barre de progression,
  validation du type de fichier, gestion des erreurs et annulation à la navigation
- Gestion des titres : édition (titre, genre), suppression (Storage + Firestore)
- Page d'accueil avec défilement infini (pagination Firestore)
- Page individuelle par titre (route dynamique `/song/:id`)
- Commentaires : ajout, tri (récents/anciens) persistant via un query parameter
- Lecteur audio global (Howler.js) : lecture/pause, barre de progression,
  déplacement du curseur au clic

## Ce qui n'est pas inclus (voir le guide pour les détails)
