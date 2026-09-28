/**
 * Website → Clover → { Barista station, Customer text }. Inline SVG in brand
 * colors; a vertical layout under 768px keeps labels readable on phones.
 */
const label = "Order flow: the website sends the order to Clover; Clover prints a ticket at the barista station and texts the customer when the order is ready for pickup.";

export function FlowDiagram() {
  return (
    <figure className="rounded-3xl bg-matcha-deep p-4 text-cream md:p-6">
      <svg viewBox="0 0 360 420" role="img" aria-label={label} className="mx-auto block w-full max-w-[420px] md:hidden">
        <title>{label}</title>
        <Box x={80} y={16} w={200} h={64} title="Website" sub="casamatcha · Order ahead" tone="cream" />
        <Arrow x1={180} y1={80} x2={180} y2={132} text="order" />
        <Box x={80} y={134} w={200} h={64} title="Clover" sub="your existing system" tone="matcha" />
        <path d="M180 198 v28 M180 226 H70 v22 M180 226 H290 v22" fill="none" stroke="#9CCB6B" strokeWidth="2.5" />
        <Tip x={70} y={248} />
        <Tip x={290} y={248} />
        <Box x={6} y={254} w={158} h={90} title="Barista station" sub="ticket prints" tone="cream" small />
        <Box x={196} y={254} w={158} h={90} title="Customer text" sub="ready for pickup" tone="cream" small />
        <text x={180} y={392} textAnchor="middle" fontFamily="var(--font-bricolage), sans-serif" fontSize="14" fontWeight="700" fill="#9CCB6B" letterSpacing="2">
          NOTHING ON THIS SITE TOUCHES CARDS
        </text>
      </svg>
      <svg viewBox="0 0 760 250" role="img" aria-label={label} className="mx-auto hidden w-full max-w-[760px] md:block">
        <title>{label}</title>
        <Box x={16} y={88} w={190} h={70} title="Website" sub="casamatcha · Order ahead" tone="cream" />
        <Arrow x1={206} y1={123} x2={286} y2={123} text="order" horizontal />
        <Box x={288} y={88} w={190} h={70} title="Clover" sub="your existing system" tone="matcha" />
        <path d="M478 123 h36 M514 123 V54 h40 M514 123 V192 h40" fill="none" stroke="#9CCB6B" strokeWidth="2.5" />
        <Tip x={554} y={54} horizontal />
        <Tip x={554} y={192} horizontal />
        <Box x={556} y={20} w={188} h={68} title="Barista station" sub="ticket prints" tone="cream" small />
        <Box x={556} y={158} w={188} h={68} title="Customer text" sub="ready for pickup" tone="cream" small />
        <text x={380} y={238} textAnchor="middle" fontFamily="var(--font-bricolage), sans-serif" fontSize="13" fontWeight="700" fill="#9CCB6B" letterSpacing="2">
          NOTHING ON THIS SITE TOUCHES CARDS
        </text>
      </svg>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}

function Box({ x, y, w, h, title, sub, tone, small }: { x: number; y: number; w: number; h: number; title: string; sub: string; tone: "cream" | "matcha"; small?: boolean }) {
  const fill = tone === "matcha" ? "#6A9A3F" : "#F6F1E7";
  const text = "#171A14";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={16} fill={fill} stroke={tone === "matcha" ? "#9CCB6B" : "#171A14"} strokeWidth="1.5" />
      <text x={x + w / 2} y={y + (small ? h / 2 - 4 : h / 2 - 5)} textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontSize={small ? 19 : 22} fontWeight="800" fill={text}>
        {title}
      </text>
      <text x={x + w / 2} y={y + (small ? h / 2 + 18 : h / 2 + 17)} textAnchor="middle" fontFamily="var(--font-bricolage), sans-serif" fontSize="13" fill={text} opacity="0.75">
        {sub}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, text, horizontal }: { x1: number; y1: number; x2: number; y2: number; text: string; horizontal?: boolean }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9CCB6B" strokeWidth="2.5" />
      <Tip x={x2} y={y2} horizontal={horizontal} />
      <text x={horizontal ? (x1 + x2) / 2 : x1 + 12} y={horizontal ? y1 - 10 : (y1 + y2) / 2 + 5} textAnchor={horizontal ? "middle" : "start"} fontFamily="var(--font-bricolage), sans-serif" fontSize="13" fontWeight="700" fill="#D9832E" letterSpacing="1.5">
        {text.toUpperCase()}
      </text>
    </g>
  );
}

function Tip({ x, y, horizontal }: { x: number; y: number; horizontal?: boolean }) {
  return horizontal ? <path d={`M${x - 8} ${y - 6} L${x} ${y} L${x - 8} ${y + 6}`} fill="none" stroke="#9CCB6B" strokeWidth="2.5" /> : <path d={`M${x - 6} ${y - 8} L${x} ${y} L${x + 6} ${y - 8}`} fill="none" stroke="#9CCB6B" strokeWidth="2.5" />;
}
