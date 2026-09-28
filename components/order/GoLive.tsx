/** "Turning this on is easy": the owner-facing section. Wording is fixed; keep it as written. */
export function GoLive({ id = "go-live" }: { id?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className="rounded-3xl border border-matcha/40 bg-foam p-6 md:p-8">
      <p className="eyebrow text-matcha-deep">For Casa Matcha</p>
      <h2 id={`${id}-title`} className="font-display mt-3 text-[1.9rem] leading-tight font-black tracking-tight md:text-[2.3rem]">
        Going live takes one setting.
      </h2>
      <ol className="mt-6 space-y-5">
        {[
          {
            lead: "Turn on Online Ordering in your Clover dashboard.",
            body: "Clover has an Online Ordering section built in. Your menu, prices, and photos come from what's already in Clover.",
          },
          {
            lead: "Send me your ordering link.",
            body: "I connect every Order button on your site to it, one for Webster and one for Friendswood.",
          },
          {
            lead: "Orders show up where they already do.",
            body: "Online orders land on your Clover devices like any other ticket. There's nothing new for your team to learn.",
          },
        ].map((s, i) => (
          <li key={s.lead} className="flex gap-4">
            <span className="font-display grid h-9 w-9 shrink-0 place-items-center rounded-full bg-matcha text-[1rem] font-black text-ink" aria-hidden="true">
              {i + 1}
            </span>
            <p className="text-[1rem] leading-relaxed text-ink/85">
              <strong className="text-ink">{s.lead}</strong> {s.body}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-6 rounded-2xl bg-cream px-4 py-3 text-[0.92rem] leading-relaxed text-ink/85">
        Clover doesn&apos;t charge a separate setup fee for online ordering. Online orders run at your card-not-present processing rate, so check the rate on your plan.
      </p>
      <p className="font-display mt-5 text-[1.15rem] leading-snug font-semibold text-matcha-deep">
        Want to try it together? I can walk you through turning it on in about 15 minutes.
      </p>
    </section>
  );
}
