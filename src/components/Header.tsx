import { getCategories, getSettings } from "@/lib/data";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);
  return <HeaderClient categories={categories} logo={settings.logo} />;
}
