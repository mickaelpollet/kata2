# Kata 2 – Keycloak Angular Testing Application 2

Kata 2 est une application Angular permettant de tester et d'explorer dynamiquement des configurations de serveurs **Keycloak**. Elle permet de se connecter à différents serveurs Keycloak, de s’authentifier via OIDC et d’examiner en détail les informations contenues dans les **jetons JWT** (access token, ID token, refresh token).

Cette application est une **refonte majeure** de la première version disponible ici : [Kata (v1)](https://github.com/mickaelpollet/kata). Elle introduit notamment une configuration dynamique et persistante via les cookies, permettant une grande souplesse d'utilisation.

---

## ✨ Fonctionnalités principales

- Connexion dynamique à un ou plusieurs serveurs Keycloak (via OIDC).
- Gestion multi-profils Keycloak (URL, realm, clientId, secret, scope, etc.).
- Sauvegarde locale de la configuration (via cookie).
- Affichage complet des informations contenues dans les jetons.
- Interface Angular claire et responsive.

---

## ⚙️ Installation

> Prérequis : Node.js ≥ 18 recommandé (compatible avec les versions LTS).

```bash
# Cloner le dépôt
git clone https://github.com/mickaelpollet/kata2.git
cd kata2

# Installer les dépendances
npm install

# Lancer l'application en local
ng serve --open
```

L’application sera alors accessible sur : [http://localhost:4200](http://localhost:4200)

---

## 🛠️ Configuration

Le projet contient un fichier `environment.ts` (et ses variantes pour les autres environnements) avec une **configuration par défaut**. Cette configuration est utilisée uniquement lors du démarrage local, et contient une URL `http://localhost:8080/realms/demo` fournie à titre d’exemple.

**⚠️ Aucun secret sensible n’est stocké dans le code.**

> La configuration Keycloak réelle utilisée par l’application est **dynamique** : elle est saisie par l’utilisateur dans l’interface (via un formulaire accessible dans le menu) et **stockée dans un cookie**. Cela permet de changer de configuration sans modifier le code ni redéployer.

---

## 🧪 Objectif du projet

Ce projet a été conçu pour les développeurs, administrateurs ou intégrateurs souhaitant :

- Tester la configuration d’un serveur Keycloak.
- Vérifier la validité des jetons retournés.
- Explorer et déboguer des flux d’authentification OIDC dans un contexte Angular.

---

## 📁 Structure du projet

- `/src/app/` – Composants principaux de l'application Angular.
- `/src/environments/` – Fichiers de configuration pour les environnements (`environment.ts`...).
- `keycloak/` – Intégration Keycloak (via `keycloak-angular` et `keycloak-js`).
- `auth/` – Gestion des profils de connexion, interface de configuration dynamique.

---

## 📌 Notes complémentaires

- Le projet n'utilise pas encore de pipeline CI/CD, mais peut être facilement intégré avec GitHub Actions.
- Aucun test unitaire n'est encore implémenté à ce jour, mais des cas de test automatisables sont identifiés (ex : parsing JWT, persistance de profil, etc.).

---

## 🔗 Liens utiles

- 🔐 [Keycloak Documentation](https://www.keycloak.org/documentation.html)
- 📘 [OIDC Specs](https://openid.net/connect/)
- 💡 [Kata v1 – Projet initial](https://github.com/mickaelpollet/kata)

---

## 📄 Licence

Ce projet est distribué sous licence MIT.
