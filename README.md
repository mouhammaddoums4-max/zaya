# 🛍️ ZAYA — Marketplace e-commerce (Guinée)

Site e-commerce moderne et premium inspiré de Jumia, construit avec **Next.js 15**, **Prisma + PostgreSQL**, **Three.js** et **Framer Motion**. Design africain premium (orange & noir), 100% responsive mobile, prix en **GNF**, paiement à la livraison.

## ✨ Fonctionnalités

- 🏠 Accueil cinématique avec **hero 3D** (Three.js) et animations fluides
- 🔎 Recherche, catégories, filtres et tri
- 🛒 Panier persistant + tunnel de **commande sans inscription** (nom, téléphone, lieu)
- ⚡ Ventes flash avec compte à rebours
- 📱 **Ultra responsive** + navigation mobile façon application
- 🔗 **Partage Facebook / WhatsApp / X** avec aperçu enrichi (Open Graph)
- 🔐 **Espace admin sécurisé** (produits, catégories, commandes)
- 🛡️ Sécurité : sessions JWT (cookies httpOnly), validation Zod, prix recalculés côté serveur, en-têtes de sécurité

## 🚀 Démarrage local

```bash
npm install
cp .env.example .env   # puis renseigner les variables
npm run db:push        # crée les tables
npm run db:seed        # (optionnel) données de démo
npm run dev
```

Ouvrir http://localhost:3000

## 🔑 Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chaîne PostgreSQL (Railway) |
| `ADMIN_PASSWORD` | Mot de passe de l'espace `/admin` |
| `AUTH_SECRET` | Clé secrète de signature des sessions |
| `NEXT_PUBLIC_WHATSAPP` | Numéro WhatsApp (format international sans `+`) |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site |

## 📦 Déploiement

Déployé sur **Vercel**. Base de données sur **Railway**. Ajouter les variables ci-dessus dans les paramètres Vercel, puis déployer.

---

© ZAYA — Fait avec passion en Guinée 🇬🇳
