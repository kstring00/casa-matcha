/**
 * "What's new" section. To swap the drop: change title/tag/intro and the
 * three items. Images live in /public/drop (portrait 3:4 works best).
 */
export const drop = {
  eyebrow: "What's new",
  title: "The Pumpkin Drop",
  tag: "Limited · Fall '26",
  intro: "Three fall things we can't stop making. Here until the pumpkins run out.",
  items: [
    {
      id: "pumpkin-biscoff-matcha",
      name: "Pumpkin Biscoff Matcha",
      line: "Whisked matcha, pumpkin cold foam, Biscoff crumble on top.",
      image: "/drop/pumpkin-biscoff-matcha.jpg",
      alt: "Two iced Pumpkin Biscoff Matcha drinks topped with cookie crumble next to a small pumpkin",
      width: 542,
      height: 728,
    },
    {
      id: "smores-pumpkin-cookie",
      name: "S'mores Pumpkin Cookie",
      line: "Pumpkin cookie, toasted marshmallow, a little chocolate. Warm it if you ask nice.",
      image: "/drop/smores-pumpkin-cookie.jpg",
      alt: "S'mores pumpkin cookie with a toasted marshmallow center on a wooden board between two fall drinks",
      width: 542,
      height: 728,
    },
    {
      id: "pumpkin-creme-cold-brew",
      name: "Pumpkin Crème Cold Brew",
      line: "Slow-steeped cold brew under pumpkin crème and a caramel drizzle.",
      image: "/drop/pumpkin-creme-cold-brew.jpg",
      alt: "Pumpkin Crème Cold Brew with caramel drizzle and cinnamon on a wood table beside a pothos plant",
      width: 1086,
      height: 1448,
    },
  ],
} as const;
