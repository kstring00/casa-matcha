import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Casa Matcha — matcha splashing out of a Casa Matcha cup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [img, fraunces, bricolage] = await Promise.all([
    readFile(path.join(process.cwd(), "public/og/splash-1200x630.jpg")),
    readFile(path.join(process.cwd(), "app/fonts/fraunces-900.woff")),
    readFile(path.join(process.cwd(), "app/fonts/bricolage-600.woff")),
  ]);
  const src = `data:image/jpeg;base64,${img.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#171A14", fontFamily: "Fraunces" }}>
        <img src={src} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(23,26,20,0.85) 0%, rgba(23,26,20,0.2) 55%, rgba(23,26,20,0) 100%)" }} />
        <div style={{ position: "absolute", left: 64, right: 64, bottom: 56, display: "flex", flexDirection: "column", color: "#F6F1E7" }}>
          <div style={{ fontSize: 132, fontWeight: 900, letterSpacing: -6, lineHeight: 0.9 }}>CASA MATCHA</div>
          <div style={{ marginTop: 18, fontSize: 30, fontWeight: 600, color: "#F6F1E7", opacity: 0.95, fontFamily: "Bricolage" }}>
            Matcha, café y buena vibra · Friendswood & Webster, TX
          </div>
        </div>
        <div style={{ position: "absolute", top: 40, left: 64, display: "flex", alignItems: "center", gap: 12, color: "#F6F1E7", fontFamily: "Bricolage", fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#6A9A3F" }} />
          LATINO-OWNED · TWO LOCATIONS
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 900, style: "normal" },
        { name: "Bricolage", data: bricolage, weight: 600, style: "normal" },
      ],
    },
  );
}
