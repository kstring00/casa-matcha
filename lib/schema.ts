import { site } from "@/content/site";
import { locations, fullAddress } from "@/content/locations";
import { openingHoursSpec } from "./hours";
import { ordering } from "@/content/ordering";

function orderAction(id: keyof typeof ordering) {
  const url = ordering[id].pickup ?? ordering[id].delivery;
  if (!url) return {};
  const isPickup = !!ordering[id].pickup;
  return {
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: url,
        actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
        inLanguage: "en-US",
      },
      deliveryMethod: isPickup ? "http://purl.org/goodrelations/v1#DeliveryModePickUp" : "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
    },
  };
}

export function localBusinessJsonLd() {
  return locations.map((l) => ({
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${site.url}/#${l.id}`,
    name: `Casa Matcha ${l.name}`,
    alternateName: "Casa Matcha and Coffee",
    description: site.description,
    url: `${site.url}/#locations`,
    image: `${site.url}/hero/still-splash.png`,
    logo: `${site.url}/brand/logo.svg`,
    telephone: l.phone,
    priceRange: "$",
    servesCuisine: ["Matcha", "Coffee", "Pan dulce"],
    address: {
      "@type": "PostalAddress",
      streetAddress: l.street,
      addressLocality: l.city,
      addressRegion: l.state,
      postalCode: l.zip,
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: l.geo.lat, longitude: l.geo.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Casa Matcha, ${fullAddress(l)}`)}`,
    openingHoursSpecification: openingHoursSpec(l.hours),
    sameAs: [site.instagram.url],
    parentOrganization: { "@type": "Organization", name: site.legalName, url: site.url },
    ...orderAction(l.id),
  }));
}
