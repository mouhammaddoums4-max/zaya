import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

type SeedProduct = {
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  description: string;
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  sold?: number;
  featured?: boolean;
  isFlashDeal?: boolean;
  brand?: string;
};

type SeedCategory = {
  name: string;
  slug: string;
  icon: string;
  image: string;
  products: SeedProduct[];
};

// Les prix du catalogue ci-dessous sont saisis en unités de base ;
// on les convertit en Franc Guinéen (GNF) à une échelle réaliste,
// arrondis au millier le plus proche pour des montants propres.
const toGNF = (v: number) => Math.round((v * 15) / 5000) * 5000;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const categories: SeedCategory[] = [
  {
    name: "Téléphones & Tablettes",
    slug: "telephones-tablettes",
    icon: "smartphone",
    image: img("1511707171634-5f897ff02aa9"),
    products: [
      { name: "Smartphone ZAYA X9 Pro 256Go", brand: "ZAYA", price: 189900, compareAtPrice: 249900, images: [img("1511707171634-5f897ff02aa9"), img("1592750475338-74b7b21085ab")], description: "Écran AMOLED 6.7\" 120Hz, triple caméra 108MP, batterie 5000mAh charge rapide 67W.", featured: true, isFlashDeal: true, rating: 4.8, reviewsCount: 412, sold: 1280 },
      { name: "Smartphone Infinix Hot 40i", brand: "Infinix", price: 74900, compareAtPrice: 99900, images: [img("1598327105666-5b89351aff97")], description: "Grand écran 6.56\", 128Go, batterie longue durée, double SIM.", featured: true, rating: 4.5, reviewsCount: 230, sold: 870 },
      { name: "Tablette ZAYA Tab 10\" 128Go", brand: "ZAYA", price: 119900, compareAtPrice: 159900, images: [img("1544244015-0df4b3ffc6b0")], description: "Écran 10 pouces Full HD, idéale pour le travail et le divertissement.", rating: 4.6, reviewsCount: 95, sold: 310 },
      { name: "Smartphone Samsung Galaxy A15", brand: "Samsung", price: 134900, compareAtPrice: 149900, images: [img("1610945265064-0e34e5519bbf")], description: "Super AMOLED, caméra 50MP, 6Go RAM / 128Go.", featured: true, rating: 4.7, reviewsCount: 540, sold: 2100 },
    ],
  },
  {
    name: "Électronique & TV",
    slug: "electronique-tv",
    icon: "tv",
    image: img("1593359677879-a4bb92f829d1"),
    products: [
      { name: "TV LED ZAYA 43\" Smart Android", brand: "ZAYA", price: 179900, compareAtPrice: 229900, images: [img("1593359677879-a4bb92f829d1"), img("1461151304267-38535e780c79")], description: "Smart TV Full HD, Netflix / YouTube intégrés, 2 ports HDMI.", featured: true, isFlashDeal: true, rating: 4.7, reviewsCount: 188, sold: 640 },
      { name: "Casque Bluetooth ZAYA SoundMax", brand: "ZAYA", price: 24900, compareAtPrice: 39900, images: [img("1505740420928-5e560c06d30e"), img("1583394838336-acd977736f90")], description: "Réduction de bruit, autonomie 40h, basses profondes.", featured: true, isFlashDeal: true, rating: 4.6, reviewsCount: 760, sold: 3200 },
      { name: "Enceinte JBL portable Go", brand: "JBL", price: 34900, compareAtPrice: 44900, images: [img("1608043152269-423dbba4e7e1")], description: "Son puissant, étanche IPX7, parfaite pour les sorties.", rating: 4.8, reviewsCount: 420, sold: 1500 },
      { name: "Écouteurs sans fil ZAYA Buds", brand: "ZAYA", price: 17900, compareAtPrice: 29900, images: [img("1590658268037-6bf12165a8df")], description: "True wireless, boîtier de charge, appels clairs.", isFlashDeal: true, rating: 4.4, reviewsCount: 310, sold: 980 },
    ],
  },
  {
    name: "Informatique",
    slug: "informatique",
    icon: "laptop",
    image: img("1496181133206-80ce9b88a853"),
    products: [
      { name: "PC Portable ZAYA Book 15 i5 8Go", brand: "ZAYA", price: 389900, compareAtPrice: 459900, images: [img("1496181133206-80ce9b88a853"), img("1517336714731-489689fd1ca8")], description: "Intel Core i5, 8Go RAM, SSD 512Go, écran 15.6\" Full HD.", featured: true, rating: 4.7, reviewsCount: 142, sold: 320 },
      { name: "Souris sans fil ergonomique", brand: "Logitech", price: 9900, compareAtPrice: 14900, images: [img("1527864550417-7fd91fc51a46")], description: "Silencieuse, précise, autonomie 12 mois.", rating: 4.6, reviewsCount: 680, sold: 2400 },
      { name: "Clé USB 64Go ZAYA", brand: "ZAYA", price: 6900, compareAtPrice: 9900, images: [img("1618410320928-25228d811631")], description: "USB 3.0 haute vitesse, boîtier métal.", isFlashDeal: true, rating: 4.5, reviewsCount: 230, sold: 1100 },
      { name: "Imprimante HP DeskJet", brand: "HP", price: 74900, compareAtPrice: 89900, images: [img("1612815154858-60aa4c59eaa6")], description: "Impression, scan, copie, Wi-Fi.", rating: 4.3, reviewsCount: 90, sold: 210 },
    ],
  },
  {
    name: "Électroménager",
    slug: "electromenager",
    icon: "refrigerator",
    image: img("1571175443880-49e1d25b2bc5"),
    products: [
      { name: "Réfrigérateur ZAYA 2 portes 250L", brand: "ZAYA", price: 289900, compareAtPrice: 349900, images: [img("1571175443880-49e1d25b2bc5")], description: "Froid ventilé, faible consommation, grand congélateur.", featured: true, rating: 4.6, reviewsCount: 76, sold: 180 },
      { name: "Mixeur / Blender 1.5L", brand: "ZAYA", price: 29900, compareAtPrice: 44900, images: [img("1570222094114-d054a817e56b")], description: "4 lames inox, 2 vitesses + pulse, bol en verre.", isFlashDeal: true, rating: 4.5, reviewsCount: 340, sold: 1250 },
      { name: "Fer à repasser vapeur", brand: "Philips", price: 18900, compareAtPrice: 24900, images: [img("1626806787461-102c1bfaaea1")], description: "Semelle anti-adhésive, jet de vapeur puissant.", rating: 4.4, reviewsCount: 210, sold: 760 },
      { name: "Ventilateur sur pied 3 vitesses", brand: "ZAYA", price: 24900, compareAtPrice: 34900, images: [img("1565814329452-e1efa11c5b89")], description: "Oscillation large, silencieux, hauteur réglable.", isFlashDeal: true, rating: 4.3, reviewsCount: 155, sold: 540 },
    ],
  },
  {
    name: "Mode Femme",
    slug: "mode-femme",
    icon: "shirt",
    image: img("1490481651871-ab68de25d43d"),
    products: [
      { name: "Robe élégante Wax moderne", brand: "ZAYA Mode", price: 24900, compareAtPrice: 34900, images: [img("1490481651871-ab68de25d43d")], description: "Tissu wax premium, coupe ajustée, finitions soignées.", featured: true, rating: 4.7, reviewsCount: 320, sold: 890 },
      { name: "Sac à main cuir synthétique", brand: "ZAYA Mode", price: 19900, compareAtPrice: 29900, images: [img("1584917865442-de89df76afd3")], description: "Grand compartiment, bandoulière, élégant et résistant.", isFlashDeal: true, rating: 4.6, reviewsCount: 410, sold: 1500 },
      { name: "Ensemble voile brodé", brand: "ZAYA Mode", price: 34900, compareAtPrice: 49900, images: [img("1515372039744-b8f02a3ae446")], description: "Broderie fine, confortable, parfait pour les cérémonies.", rating: 4.8, reviewsCount: 95, sold: 220 },
      { name: "Escarpins à talons", brand: "ZAYA Mode", price: 22900, compareAtPrice: 32900, images: [img("1543163521-1bf539c55dd2")], description: "Confortables, élégants, plusieurs pointures.", rating: 4.4, reviewsCount: 130, sold: 380 },
    ],
  },
  {
    name: "Mode Homme",
    slug: "mode-homme",
    icon: "shirt",
    image: img("1521572163474-6864f9cf17ab"),
    products: [
      { name: "T-shirt coton premium ZAYA", brand: "ZAYA Mode", price: 9900, compareAtPrice: 14900, images: [img("1521572163474-6864f9cf17ab")], description: "100% coton, coupe droite, plusieurs coloris.", featured: true, isFlashDeal: true, rating: 4.6, reviewsCount: 520, sold: 2200 },
      { name: "Baskets sport tendance", brand: "ZAYA Sport", price: 29900, compareAtPrice: 44900, images: [img("1542291026-7eec264c27ff"), img("1600185365926-3a2ce3cdb9eb")], description: "Semelle amortie, légères, respirantes.", featured: true, rating: 4.7, reviewsCount: 640, sold: 1800 },
      { name: "Montre homme classique", brand: "ZAYA", price: 27900, compareAtPrice: 39900, images: [img("1523275335684-37898b6baf30")], description: "Bracelet acier, étanche, cadran élégant.", isFlashDeal: true, rating: 4.5, reviewsCount: 280, sold: 920 },
      { name: "Boubou grand modèle brodé", brand: "ZAYA Mode", price: 39900, compareAtPrice: 54900, images: [img("1489987707025-afc232f7ea0f")], description: "Tissu bazin riche, broderie traditionnelle.", rating: 4.8, reviewsCount: 110, sold: 260 },
    ],
  },
  {
    name: "Beauté & Santé",
    slug: "beaute-sante",
    icon: "sparkles",
    image: img("1596462502278-27bfdc403348"),
    products: [
      { name: "Coffret parfum homme & femme", brand: "ZAYA Beauty", price: 29900, compareAtPrice: 44900, images: [img("1541643600914-78b084683601")], description: "Eau de parfum longue tenue, coffret cadeau.", featured: true, isFlashDeal: true, rating: 4.7, reviewsCount: 360, sold: 1300 },
      { name: "Kit maquillage complet", brand: "ZAYA Beauty", price: 19900, compareAtPrice: 29900, images: [img("1596462502278-27bfdc403348")], description: "Palette, pinceaux, fonds de teint, tout-en-un.", rating: 4.5, reviewsCount: 240, sold: 780 },
      { name: "Crème éclaircissante naturelle", brand: "ZAYA Beauty", price: 12900, compareAtPrice: 18900, images: [img("1556228720-195a672e8a03")], description: "Hydrate et unifie le teint, ingrédients naturels.", rating: 4.3, reviewsCount: 190, sold: 650 },
      { name: "Tondeuse cheveux & barbe", brand: "ZAYA", price: 17900, compareAtPrice: 26900, images: [img("1621607512214-68297480165e")], description: "Sans fil, rechargeable, précise et silencieuse.", isFlashDeal: true, rating: 4.6, reviewsCount: 300, sold: 1050 },
    ],
  },
  {
    name: "Maison & Cuisine",
    slug: "maison-cuisine",
    icon: "home",
    image: img("1556911220-bff31c812dba"),
    products: [
      { name: "Batterie de cuisine 12 pièces", brand: "ZAYA Home", price: 44900, compareAtPrice: 64900, images: [img("1556911220-bff31c812dba")], description: "Anti-adhésif, compatible tous feux, poignées ergonomiques.", featured: true, rating: 4.6, reviewsCount: 180, sold: 520 },
      { name: "Parure de lit 2 places", brand: "ZAYA Home", price: 24900, compareAtPrice: 34900, images: [img("1522771739844-6a9f6d5f14af")], description: "Microfibre douce, housse + 2 taies, infroissable.", isFlashDeal: true, rating: 4.5, reviewsCount: 220, sold: 690 },
      { name: "Lot de 6 verres design", brand: "ZAYA Home", price: 11900, compareAtPrice: 16900, images: [img("1510812431401-41d2bd2722f3")], description: "Verre épais, élégants, résistants.", rating: 4.4, reviewsCount: 140, sold: 430 },
      { name: "Tapis de salon moderne", brand: "ZAYA Home", price: 34900, compareAtPrice: 49900, images: [img("1600585154340-be6161a56a0c")], description: "Doux, antidérapant, motif contemporain.", rating: 4.7, reviewsCount: 90, sold: 180 },
    ],
  },
  {
    name: "Supermarché",
    slug: "supermarche",
    icon: "shopping-basket",
    image: img("1542838132-92c53300491e"),
    products: [
      { name: "Huile végétale 5L", brand: "ZAYA Food", price: 7900, compareAtPrice: 9900, images: [img("1550989460-0adf9ea622e2")], description: "Huile de qualité pour toute la cuisine.", isFlashDeal: true, rating: 4.5, reviewsCount: 160, sold: 1400 },
      { name: "Café soluble 200g", brand: "ZAYA Food", price: 4900, compareAtPrice: 6900, images: [img("1559056199-641a0ac8b55e")], description: "Arôme intense, se dissout instantanément.", rating: 4.6, reviewsCount: 210, sold: 1900 },
      { name: "Lait en poudre 900g", brand: "ZAYA Food", price: 8900, compareAtPrice: 10900, images: [img("1563636619-e9143da7973b")], description: "Riche en calcium, pour toute la famille.", rating: 4.4, reviewsCount: 120, sold: 880 },
      { name: "Pack détergent & savon", brand: "ZAYA Home", price: 6900, compareAtPrice: 9900, images: [img("1585421514738-01798e348b17")], description: "Nettoie en profondeur, parfum frais longue durée.", isFlashDeal: true, rating: 4.3, reviewsCount: 95, sold: 760 },
    ],
  },
  {
    name: "Bébé & Enfants",
    slug: "bebe-enfants",
    icon: "baby",
    image: img("1522771930-7a19c3f5a3e2"),
    products: [
      { name: "Pack 2 body bébé coton", brand: "ZAYA Kids", price: 9900, compareAtPrice: 14900, images: [img("1522771930-7a19c3f5a3e2")], description: "Coton doux, pression pratique, hypoallergénique.", featured: true, rating: 4.7, reviewsCount: 180, sold: 540 },
      { name: "Jouet éducatif enfant", brand: "ZAYA Kids", price: 12900, compareAtPrice: 18900, images: [img("1515488042361-ee00e0ddd4e4")], description: "Développe l'éveil et la motricité, sans danger.", isFlashDeal: true, rating: 4.6, reviewsCount: 140, sold: 420 },
      { name: "Couches bébé taille M (x44)", brand: "ZAYA Kids", price: 8900, compareAtPrice: 11900, images: [img("1584820927498-cfe5211fd8bf")], description: "Ultra absorbantes, douces pour la peau.", rating: 4.5, reviewsCount: 260, sold: 1600 },
    ],
  },
  {
    name: "Sport & Loisirs",
    slug: "sport-loisirs",
    icon: "dumbbell",
    image: img("1517649763962-0c623066013b"),
    products: [
      { name: "Tapis de yoga antidérapant", brand: "ZAYA Sport", price: 14900, compareAtPrice: 22900, images: [img("1517649763962-0c623066013b")], description: "Épais, confortable, sangle de transport incluse.", rating: 4.6, reviewsCount: 150, sold: 480 },
      { name: "Haltères réglables 20kg", brand: "ZAYA Sport", price: 39900, compareAtPrice: 54900, images: [img("1534438327276-14e5300c3a48")], description: "Poids ajustables, revêtement protecteur.", featured: true, rating: 4.7, reviewsCount: 110, sold: 290 },
      { name: "Ballon de football officiel", brand: "ZAYA Sport", price: 11900, compareAtPrice: 16900, images: [img("1614632537190-23e4146777db")], description: "Taille 5, cousu main, résistant.", isFlashDeal: true, rating: 4.5, reviewsCount: 320, sold: 1250 },
    ],
  },
];

async function main() {
  console.log("🌱 Nettoyage…");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("🌱 Insertion des catégories & produits…");
  let order = 0;
  for (const cat of categories) {
    const createdCat = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        image: cat.image,
        order: order++,
      },
    });

    for (const p of cat.products) {
      await prisma.product.create({
        data: {
          name: p.name,
          slug: `${slugify(p.name)}-${Math.random().toString(36).slice(2, 6)}`,
          description: p.description,
          price: toGNF(p.price),
          compareAtPrice: p.compareAtPrice ? toGNF(p.compareAtPrice) : null,
          images: p.images,
          stock: p.stock ?? 100,
          rating: p.rating ?? 4.6,
          reviewsCount: p.reviewsCount ?? 0,
          sold: p.sold ?? 0,
          featured: p.featured ?? false,
          isFlashDeal: p.isFlashDeal ?? false,
          brand: p.brand ?? null,
          categoryId: createdCat.id,
        },
      });
    }
  }

  const cCount = await prisma.category.count();
  const pCount = await prisma.product.count();
  console.log(`✅ Terminé : ${cCount} catégories, ${pCount} produits.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
