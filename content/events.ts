/**
 * DJ nights. `next.date` is an ISO string with the Central offset.
 * The "DJ night this Friday" toast fires only if the date is within 7 days.
 */
export const events = {
  eyebrow: "Events",
  series: "Matcha, Café y Perreo",
  blurb: "DJ night at Casa Matcha. Good matcha, good beats, good people. Bring your familia.",
  next: {
    /** PLACEHOLDER date. Update every event. */
    date: "2026-10-02T19:00:00-05:00",
    doors: "7 pm",
    locationId: "webster" as const,
    /** From the Instagram bio. Verify it points at the current event. */
    ticketsUrl: "https://www.eventbrite.com/e/1997638683076?aff=oddtdtcreator",
  },
  image: {
    src: "/events/dj-night.jpg",
    alt: "A DJ behind the decks at Casa Matcha under a neon sign, with a 'Matcha, Café y Perreo' banner",
    width: 542,
    height: 728,
  },
} as const;
