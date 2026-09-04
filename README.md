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

## 2. Configurer Firebase (authentification + base de données)

1. Créez un projet sur https://console.firebase.google.com
2. Activez **Authentication** → méthode "E-mail/Mot de passe"
3. Créez une base **Firestore** (mode test pour démarrer)
4. Dans les paramètres du projet → "Vos applications" → ajoutez une app Web,
   copiez la config, et collez-la dans `src/includes/firebase.js` :

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
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

## 3. Configurer Supabase (stockage des fichiers MP3)

Le stockage de fichiers de Firebase (Firebase Storage) exige désormais une carte
bancaire (forfait Blaze), même s'il reste gratuit dans les quotas. Ce projet
utilise donc **Supabase Storage** à la place — 1 Go gratuit, **aucune carte
bancaire requise**.

1. Créez un compte gratuit sur https://supabase.com et un nouveau projet
   (choisissez un mot de passe de base de données, ce n'est pas grave si vous
   ne l'utilisez pas — on ne se sert que du Storage ici).
2. Dans le menu de gauche, allez dans **Storage** → **New bucket**.
   - Nom du bucket : `songs` (doit correspondre exactement à `SONGS_BUCKET`
     dans `src/includes/supabase.js`)
   - Cochez **Public bucket** (pour que les fichiers soient lisibles par tous,
     comme pour l'écoute publique des morceaux)
3. Toujours dans **Storage** → onglet **Policies**, ajoutez une policy
   permissive pour permettre l'upload et la suppression sans authentification
   Supabase (l'app utilise l'authentification Firebase, pas celle de Supabase) :
   - Cliquez sur **New Policy** → **For full customization** (ou "Create a
     policy from scratch")
   - Nom : `allow all (dev)` — Opération : `ALL` — Cible : `anon` et
     `authenticated` — Expression `USING`/`WITH CHECK` : `true`
   - **Important** : ceci équivaut au "mode test" de Firestore — pratique pour
     développer, mais à restreindre avant une vraie mise en production.
4. Dans **Project Settings** → **API**, copiez l'**URL** du projet et la clé
   **anon public**. Collez-les dans `src/includes/supabase.js` :

```js
const supabaseUrl = "https://xxxxxxxx.supabase.co";
const supabaseAnonKey = "eyJhbGciOi...";
```

## 4. Lancer en développement

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
  Dans la plupart des cas, c'est que `src/includes/firebase.js` ou
  `src/includes/supabase.js` contiennent encore des valeurs `VOTRE_...` non
  remplacées.
- **Erreur Firestore "Missing or insufficient permissions"** : les règles
  Firestore n'ont pas été publiées dans la console Firebase (voir section 2).
- **L'upload de musique échoue** : vérifiez que le bucket `songs` existe bien
  dans Supabase, qu'il est public, et que la policy "allow all" a été créée
  (voir section 3).
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
    firebase.js           # config + instances Firebase (auth, db, collections)
    supabase.js            # client Supabase (stockage des fichiers MP3)
    validation.js          # règles et messages VeeValidate
    helper.js               # formatage du temps (mm:ss)
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
- Upload de fichiers MP3 par glisser-déposer (stockage sur **Supabase**, gratuit
  sans carte bancaire), avec barre de progression et validation du type de fichier
- Gestion des titres : édition (titre, genre), suppression (Supabase + Firestore)
- Page d'accueil avec défilement infini (pagination Firestore)
- Page individuelle par titre (route dynamique `/song/:id`)
- Commentaires : ajout, tri (récents/anciens) persistant via un query parameter
- Lecteur audio global (Howler.js) : lecture/pause, barre de progression,
  déplacement du curseur au clic

## Ce qui n'est pas inclus (voir le guide pour les détails)

Internationalisation (vue-i18n), PWA (vite-plugin-pwa), tests automatisés
(Vitest / Cypress), Composition API, patterns avancés (composants contrôlés,
Teleport). Le guide chronologique complet fourni précédemment détaille comment
les ajouter par-dessus cette base.
