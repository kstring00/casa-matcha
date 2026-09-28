/**
 * Locations, hours, phones. Hours are America/Chicago, 24h "HH:MM".
 * A day set to null is closed. Override a location's hours by giving it
 * its own `hours` object instead of `defaultHours`.
 */
export type DayKey = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
export type DayHours = { open: string; close: string } | null;
export type WeekHours = Record<DayKey, DayHours>;

export const defaultHours: WeekHours = {
  0: null,
  1: { open: "08:00", close: "18:00" },
  2: { open: "08:00", close: "18:00" },
  3: { open: "08:00", close: "16:00" },
  4: { open: "08:00", close: "18:00" },
  5: { open: "08:00", close: "18:00" },
  6: { open: "08:00", close: "14:00" },
};

export type LocationId = "friendswood" | "webster";

export type Location = {
  id: LocationId;
  name: string;
  /** Short label for chips and toasts. */
  short: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  /** E.164, used in tel: links and JSON-LD. */
  phone: string;
  phoneDisplay: string;
  /** Approximate. Verify against Google Maps before launch. */
  geo: { lat: number; lng: number };
  callout?: string;
  hours: WeekHours;
  image: { src: string; alt: string; width: number; height: number };
};

export const locations: Location[] = [
  {
    id: "friendswood",
    name: "Friendswood",
    short: "Friendswood",
    street: "1616 S Friendswood Dr",
    city: "Friendswood",
    state: "TX",
    zip: "77546",
    phone: "+12819934437",
    phoneDisplay: "(281) 993-4437",
    geo: { lat: 29.5141, lng: -95.1893 },
    hours: defaultHours,
    image: {
      src: "/locations/friendswood.jpg",
      alt: "Inside Casa Matcha Friendswood: arched green wall, neon sign, plants and warm wood tables",
      width: 542,
      height: 728,
    },
  },
  {
    id: "webster",
    name: "Webster",
    short: "Webster",
    street: "1199 E NASA Pkwy",
    city: "Webster",
    state: "TX",
    zip: "77058",
    phone: "+18323794041",
    phoneDisplay: "(832) 379-4041",
    geo: { lat: 29.5523, lng: -95.1012 },
    callout: "Tucked in a small entrance off NASA Pkwy — look for the astronaut on the door.",
    hours: defaultHours,
    image: {
      src: "/locations/webster.jpg",
      alt: "The front door of Casa Matcha Webster with the astronaut logo sticker",
      width: 542,
      height: 568,
    },
  },
];

/** Which location the sticky bar and hours toast default to. */
export const defaultLocationId: LocationId = "webster";

export const fullAddress = (l: Location) => `${l.street}, ${l.city}, ${l.state} ${l.zip}`;
export const directionsUrl = (l: Location) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Casa Matcha, ${fullAddress(l)}`)}`;
export const getLocation = (id: LocationId) => locations.find((l) => l.id === id) ?? locations[0];

/** Human summary used in the footer and JSON-LD. */
export const hoursSummary = [
  { days: "Mon – Tue", time: "8 am – 6 pm" },
  { days: "Wed", time: "8 am – 4 pm" },
  { days: "Thu – Fri", time: "8 am – 6 pm" },
  { days: "Sat", time: "8 am – 2 pm" },
  { days: "Sun", time: "Closed" },
];
