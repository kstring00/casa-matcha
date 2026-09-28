/**
 * Demo ordering menu for /order. Items and photos come from the site's menu
 * and drop content; PRICES ARE SAMPLE PRICES. The real menu, prices and
 * modifiers come straight from Clover once Online Ordering is on.
 */
export type Choice = { id: string; label: string; deltaCents: number };

export type DemoItem = {
  id: string;
  name: string;
  line: string;
  image: string;
  alt: string;
  baseCents: number;
  sizes?: Choice[];
  milks?: Choice[];
  tag?: string;
};

const drinkSizes: Choice[] = [
  { id: "12", label: "12 oz", deltaCents: 0 },
  { id: "16", label: "16 oz", deltaCents: 75 },
  { id: "20", label: "20 oz", deltaCents: 150 },
];

const milks: Choice[] = [
  { id: "whole", label: "Whole", deltaCents: 0 },
  { id: "oat", label: "Oat", deltaCents: 75 },
  { id: "almond", label: "Almond", deltaCents: 75 },
  { id: "coconut", label: "Coconut", deltaCents: 75 },
];

export const demoMenu: DemoItem[] = [
  {
    id: "iced-matcha",
    name: "Iced Matcha Latte",
    line: "Ceremonial-grade matcha, whisked, over your milk of choice.",
    image: "/menu/iced-matcha.jpg",
    alt: "Layered iced matcha latte dusted with cinnamon in a Casa Matcha cup",
    baseCents: 575,
    sizes: drinkSizes,
    milks,
    tag: "Signature",
  },
  {
    id: "dirty-matcha",
    name: "Dirty Matcha",
    line: "Matcha meets a shot of espresso.",
    image: "/menu/dirty-matcha.jpg",
    alt: "Iced dirty matcha with espresso swirls and a Biscoff-stamped cold foam",
    baseCents: 675,
    sizes: drinkSizes,
    milks,
    tag: "Signature",
  },
  {
    id: "strawberry-matcha",
    name: "Strawberry Matcha",
    line: "Fresh strawberry purée under a bright green pour.",
    image: "/menu/strawberry-matcha.jpg",
    alt: "Pink strawberry matcha over ice with real strawberries",
    baseCents: 650,
    sizes: drinkSizes,
    milks,
    tag: "Fan favorite",
  },
  {
    id: "sea-salt-cold-brew",
    name: "Sea-Salt Cold Brew",
    line: "Slow-steeped cold brew with a salted cream cap.",
    image: "/menu/sea-salt-cold-brew.jpg",
    alt: "Cold brew topped with sea-salt cream and a caramel drizzle",
    baseCents: 525,
    sizes: drinkSizes,
  },
  {
    id: "pumpkin-biscoff-matcha",
    name: "Pumpkin Biscoff Matcha",
    line: "Whisked matcha, pumpkin cold foam, Biscoff crumble.",
    image: "/drop/pumpkin-biscoff-matcha.jpg",
    alt: "Two iced Pumpkin Biscoff Matcha drinks topped with cookie crumble next to a small pumpkin",
    baseCents: 700,
    sizes: drinkSizes,
    milks,
    tag: "Pumpkin Drop",
  },
  {
    id: "pumpkin-creme-cold-brew",
    name: "Pumpkin Crème Cold Brew",
    line: "Cold brew under pumpkin crème and a caramel drizzle.",
    image: "/drop/pumpkin-creme-cold-brew.jpg",
    alt: "Pumpkin Crème Cold Brew with caramel drizzle and cinnamon beside a pothos plant",
    baseCents: 625,
    sizes: drinkSizes,
    tag: "Pumpkin Drop",
  },
  {
    id: "smores-pumpkin-cookie",
    name: "S'mores Pumpkin Cookie",
    line: "Pumpkin cookie, toasted marshmallow, a little chocolate.",
    image: "/drop/smores-pumpkin-cookie.jpg",
    alt: "S'mores pumpkin cookie with a toasted marshmallow center on a wooden board",
    baseCents: 425,
    tag: "Pumpkin Drop",
  },
  {
    id: "conchas",
    name: "Concha",
    line: "Baked fresh most mornings. Gone by noon.",
    image: "/menu/conchas.jpg",
    alt: "Conchas, cookies and pan dulce on a wooden board",
    baseCents: 350,
    tag: "Bakery",
  },
];

export const demoItem = (id: string) => demoMenu.find((i) => i.id === id);
