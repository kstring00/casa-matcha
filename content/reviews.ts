/**
 * Google reviews. First name + last initial only.
 * `sample: true` renders a small "sample" tag on the card. Paste the real
 * reviews, set sample to false (or remove the field) and you're done.
 */
export type Review = { name: string; quote: string; rating: 1 | 2 | 3 | 4 | 5; sample?: boolean };

export const reviews: Review[] = [
  {
    name: "Andrea M.",
    rating: 5,
    sample: true,
    quote:
      "Best matcha in the Bay Area, hands down. You can taste that they actually whisk it. The Webster spot is tiny and so cozy.",
  },
  {
    name: "Luis R.",
    rating: 5,
    sample: true,
    quote:
      "Came for the dirty matcha, stayed for the conchas. Owners remember your name by the second visit. Familia energy for real.",
  },
  {
    name: "Priya K.",
    rating: 5,
    sample: true,
    quote:
      "The DJ night was such a vibe. Matcha, reggaetón and a room full of nice people. Friendswood needed this.",
  },
];
