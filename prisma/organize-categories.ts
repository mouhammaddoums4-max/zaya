/**
 * Organise les catégories existantes en parents thématiques + sous-catégories,
 * selon les articles qu'elles contiennent actuellement.
 *
 * - Idempotent : relançable sans risque (upsert par slug, aucune suppression).
 * - N'affecte pas les produits (ils restent dans leur sous-catégorie).
 *
 * Lancer :  npm run db:organize   (avec DATABASE_URL vers la base cible)
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ParentDef = {
  name: string;
  slug: string;
  icon: string;
  children: string[]; // slugs des catégories existantes à rattacher
};

const PARENTS: ParentDef[] = [
  {
    name: "High-Tech",
    slug: "high-tech",
    icon: "smartphone",
    children: ["telephones-tablettes", "electronique-tv", "informatique"],
  },
  {
    name: "Maison & Électroménager",
    slug: "maison-electromenager",
    icon: "home",
    children: ["electromenager", "maison-cuisine"],
  },
  {
    name: "Mode & Beauté",
    slug: "mode-beaute",
    icon: "shirt",
    children: ["mode-femme", "mode-homme", "beaute-sante"],
  },
  {
    name: "Famille & Quotidien",
    slug: "famille-quotidien",
    icon: "shopping-basket",
    children: ["supermarche", "bebe-enfants", "sport-loisirs"],
  },
];

async function main() {
  for (const [pIndex, p] of PARENTS.entries()) {
    const parent = await prisma.category.upsert({
      where: { slug: p.slug },
      update: { name: p.name, icon: p.icon, order: pIndex, parentId: null },
      create: { name: p.name, slug: p.slug, icon: p.icon, order: pIndex },
    });

    let childOrder = 0;
    for (const childSlug of p.children) {
      const child = await prisma.category.findUnique({
        where: { slug: childSlug },
      });
      if (!child) {
        console.warn(`  ⚠ sous-catégorie introuvable: ${childSlug}`);
        continue;
      }
      // Évite de rattacher un parent à lui-même
      if (child.id === parent.id) continue;
      await prisma.category.update({
        where: { id: child.id },
        data: { parentId: parent.id, order: childOrder++ },
      });
      console.log(`  ✔ ${childSlug} → ${p.name}`);
    }
    console.log(`▸ ${p.name} (${p.children.length} sous-catégories)`);
  }

  const parents = await prisma.category.count({ where: { parentId: null } });
  const children = await prisma.category.count({
    where: { parentId: { not: null } },
  });
  console.log(`\nTerminé ✅  ${parents} parents, ${children} sous-catégories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
