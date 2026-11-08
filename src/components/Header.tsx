import { getCategories, getCategoryTree, getSettings } from "@/lib/data";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const [categories, tree, settings] = await Promise.all([
    getCategories(),
    getCategoryTree(),
    getSettings(),
  ]);
  return (
    <HeaderClient categories={categories} tree={tree} logo={settings.logo} />
  );
}
