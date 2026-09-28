/** Small fixed badge so nobody mistakes the demo flow for live ordering. */
export function DemoBadge() {
  return (
    <div className="demo-badge" role="note" aria-label="Demo. Nothing is charged.">
      DEMO
    </div>
  );
}
