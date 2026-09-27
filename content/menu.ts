/** Menu highlights. No prices on purpose. Tags: signature | seasonal | favorite | bakery */
export type MenuTag = "signature" | "seasonal" | "favorite" | "bakery";

export const menu = {
  eyebrow: "Menu highlights",
  title: "Whisked to order. Every cup.",
  fullMenuHref: "/menu",
  items: [
    {
      id: "iced-matcha",
      name: "Iced Matcha Latte",
      line: "Ceremonial-grade matcha, whisked, poured over your milk of choice.",
      tag: "signature" as MenuTag,
      image: "/menu/iced-matcha.jpg",
      alt: "Layered iced matcha latte dusted with cinnamon in a Casa Matcha cup",
    },
    {
      id: "dirty-matcha",
      name: "Dirty Matcha",
      line: "Matcha meets a shot of espresso. The best of both houses.",
      tag: "signature" as MenuTag,
      image: "/menu/dirty-matcha.jpg",
      alt: "Iced dirty matcha with espresso swirls and a Biscoff-stamped cold foam",
    },
    {
      id: "strawberry-matcha",
      name: "Strawberry Matcha",
      line: "Fresh strawberry purée under a bright green pour.",
      tag: "favorite" as MenuTag,
      image: "/menu/strawberry-matcha.jpg",
      alt: "Pink strawberry matcha over ice with real strawberries",
    },
    {
      id: "sea-salt-cold-brew",
      name: "Sea-Salt Cold Brew",
      line: "Slow-steeped cold brew with a salted cream cap.",
      tag: "signature" as MenuTag,
      image: "/menu/sea-salt-cold-brew.jpg",
      alt: "Cold brew topped with sea-salt cream and a caramel drizzle",
    },
    {
      id: "conchas",
      name: "Conchas & Pan Dulce",
      line: "Baked fresh most mornings. Gone by noon.",
      tag: "bakery" as MenuTag,
      image: "/menu/conchas.jpg",
      alt: "Conchas, cookies and pan dulce on a wooden board",
    },
    {
      id: "fruity-pebbles-matcha",
      name: "Fruity Pebbles Matcha",
      line: "Cereal-milk matcha with a crunchy rainbow top.",
      tag: "seasonal" as MenuTag,
      image: "/menu/fruity-pebbles-matcha.jpg",
      alt: "Iced matcha topped with cold foam and Fruity Pebbles cereal",
    },
  ],
} as const;
