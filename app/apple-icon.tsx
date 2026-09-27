import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#6A9A3F", borderRadius: 40 }}>
        <svg viewBox="0 0 64 64" width="150" height="150">
          <g stroke="#FFFCF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="31" cy="24" r="9" />
            <path d="M25 23c1-4 4-5 6-5s5 2 6 5c-2 2-4 3-6 3s-4-1-6-3z" fill="#FFFCF6" />
            <rect x="22" y="33" width="18" height="17" rx="5" fill="#6A9A3F" />
            <path d="M40 37c4-2 7-6 8-11" />
            <path d="M46 22h7l-1 8h-5z" fill="#FFFCF6" />
          </g>
          <g fill="#FFFCF6">
            <circle cx="14" cy="16" r="1.6" />
            <circle cx="52" cy="46" r="1.4" />
            <circle cx="12" cy="44" r="1.2" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
