# DM PASS — NOVAKORAX Music & Studio DM Record

PWA mobile-first (React + TypeScript + Vite + Tailwind + vite-plugin-pwa).

## Lancer
```bash
npm install
npm run dev      # développement
npm run build    # production (dossier dist)
```

## Déployer
1. `git init && git add . && git commit -m "DM PASS"` puis pousser sur GitHub.
2. Netlify : « Import from Git » — `netlify.toml` est déjà configuré (build `npm run build`, publish `dist`, redirection SPA).

## Administration cachée
Aucun bouton visible. Deux accès :
- ajouter `?panel=admin` à l'URL (ex. `https://ton-site.netlify.app/?panel=admin`) ;
- ou cliquer 5 fois rapidement (moins de 3 s) sur le logo DM PASS.

Codes PIN par défaut (**à changer dès la première connexion**, onglet « Liens & PIN ») :
- Admin général NOVAKORAX : `2026` — liens, PIN, dossiers KYC, réservations
- Admin studio DM Record : `1234` — réservations uniquement (statut Nouveau / Confirmé / Terminé, suppression)

## Données : mode local ou temps réel
- **Sans configuration** : tout est stocké en LocalStorage, donc propre à chaque appareil. Un dossier envoyé par un artiste depuis son téléphone n'apparaît PAS dans l'admin sur un autre appareil ; l'envoi WhatsApp / Telegram / Email reste le canal de réception fiable.
- **Avec Firebase** (synchronisation multi-appareils en temps réel) : créer un projet Firestore, copier `.env.example` en `.env` (ou variables d'environnement Netlify) et renseigner les 4 variables `VITE_FIREBASE_*`.
  Règles Firestore minimales pour tester (à durcir ensuite) : lecture/écriture ouvertes sur `dmpass`, `submissions` et `bookings`.

### Limite de sécurité à connaître
Les codes PIN sont vérifiés côté navigateur : ils protègent contre la curiosité, pas contre une personne technique. Avec Firebase, les données restent lisibles selon vos règles Firestore. Pour une vraie sécurité, il faudra ajouter Firebase Authentication (comptes admin) et restreindre les règles.

## Envoi des messages
Les liens `wa.me/c/…` (catalogue) et `wa.me/message/…` ne permettent pas de pré-remplir un texte. L'app copie donc le message dans le presse-papiers, ouvre le canal, et affiche un aperçu avec un bouton « Ouvrir » au cas où le navigateur bloquerait la fenêtre. L'email utilise `mailto:` avec sujet et corps pré-remplis.

## Contenu à relire
Les textes en lingala (`src/i18n/ln.ts`) sont à faire relire par un locuteur natif avant publication.
