import {
  Smartphone,
  Tv,
  Laptop,
  Refrigerator,
  Shirt,
  Sparkles,
  Home,
  ShoppingBasket,
  Baby,
  Dumbbell,
  Tag,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  tv: Tv,
  laptop: Laptop,
  refrigerator: Refrigerator,
  shirt: Shirt,
  sparkles: Sparkles,
  home: Home,
  "shopping-basket": ShoppingBasket,
  baby: Baby,
  dumbbell: Dumbbell,
};

export function CategoryIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && map[name]) || Tag;
  return <Icon className={className} />;
}
