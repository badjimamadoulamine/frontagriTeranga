# Agriteranga Frontend

> Frontend de la plateforme Agriteranga - Application React avec Tailwind CSS

##  Technologies utilisées

- **React 18** - Bibliothèque JavaScript pour l'interface utilisateur
- **Vite** - Build tool rapide et moderne
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Routing côté client
- **Axios** - Client HTTP pour les appels API
- **React Toastify** - Notifications toast
- **React Icons** - Bibliothèque d'icônes

##  Structure du projet

```
front-agriteranga/
├── public/             # Fichiers statiques
├── src/
│   ├── components/    # Composants réutilisables
│   ├── context/       # Contextes React
│   ├── hooks/         # Custom hooks
│   ├── layouts/       # Layouts de page
│   ├── pages/         # Pages de l'application
│   ├── services/      # Services API
│   ├── utils/         # Fonctions utilitaires
│   ├── App.jsx        # Composant principal
│   ├── main.jsx       # Point d'entrée
│   └── index.css      # Styles globaux
├── .env.example       # Exemple de variables d'environnement
├── package.json       # Dépendances
├── tailwind.config.js # Configuration Tailwind
└── vite.config.js     # Configuration Vite
```

##  Installation

### Prérequis

- Node.js 18+ et npm
- Backend API en cours d'exécution (agriculture-api)

### Étapes

1. **Installer les dépendances**

```bash
npm install
```

2. **Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Modifiez `.env` avec vos paramètres :

```env
VITE_API_URL=http://localhost:5000/api
```

3. **Lancer le serveur de développement**

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

##  Scripts disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Construire pour la production
npm run preview  # Prévisualiser la build de production
npm run lint     # Vérifier le code avec ESLint
```

##  Personnalisation Tailwind

Les couleurs primaires sont configurées dans `tailwind.config.js`. Modifiez-les selon vos besoins :

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Votre palette de couleurs
      }
    }
  }
}
```

##  Authentification

Le service d'authentification gère :
- Inscription
- Connexion
- Déconnexion
- Stockage du token JWT dans localStorage
- Intercepteur Axios pour ajouter le token aux requêtes

##  Build pour production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`

##  Prochaines étapes

- [ ] Ajouter les composants selon les maquettes
- [ ] Implémenter les pages manquantes
- [ ] Ajouter la gestion d'état globale (Context API)
- [ ] Implémenter les routes protégées
- [ ] Ajouter les tests unitaires

##  Auteurs

Ndeye Koria Dramé, 
Mamadou Lamine Badji
