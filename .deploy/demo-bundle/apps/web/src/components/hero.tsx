import type { DashboardSnapshot } from "../lib/types";

type HeroProps = {
  snapshot: DashboardSnapshot;
};

export function Hero({ snapshot }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(245,238,224,0.92),rgba(255,250,244,0.74),rgba(229,240,235,0.8))] px-6 py-8 shadow-[0_30px_80px_rgba(72,52,37,0.12)] sm:px-10 sm:py-10 lg:px-14 lg:py-14">
      <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top,rgba(45,116,102,0.18),transparent_55%)]" />
      <div className="absolute -left-16 top-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(173,79,50,0.22),transparent_65%)] blur-2xl" />

      <div className="relative flex flex-col gap-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#26463b]/15 bg-white/65 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#26463b]">
              The Trojan Horse Approach
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.92] text-[#2f261f] sm:text-6xl lg:text-7xl">
              {snapshot.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f554a] sm:text-lg">
              {snapshot.subheadline}
            </p>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-[#26463b]/10 bg-[#f7f1e8]/70 p-5 text-sm text-[#51473f] sm:min-w-[320px]">
            <div className="text-xs uppercase tracking-[0.28em] text-[#8a6b57]">
              Dead-man switch
            </div>
            <div className="text-2xl font-semibold text-[#2f261f]">
              {snapshot.deadManSwitch.status}
            </div>
            <p>
              Last check-in on {snapshot.deadManSwitch.lastCheckIn}.{" "}
              {snapshot.deadManSwitch.daysUntilTrigger} days remain before the
              delivery sequence arms itself.
            </p>
            <div className="rounded-2xl bg-white/80 px-4 py-3">
              Trusted contact:{" "}
              <span className="font-semibold">
                {snapshot.deadManSwitch.trustedContact}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-3">
            {snapshot.metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-[1.6rem] border border-white/60 bg-white/75 p-5 backdrop-blur"
              >
                <div className="text-xs uppercase tracking-[0.28em] text-[#8a6b57]">
                  {metric.label}
                </div>
                <div className="mt-3 text-3xl font-semibold text-[#2f261f]">
                  {metric.value}
                </div>
                <p className="mt-3 text-sm leading-6 text-[#61584d]">
                  {metric.detail}
                </p>
              </article>
            ))}
          </div>

          <div className="rounded-[1.6rem] border border-[#26463b]/10 bg-[#19342f] p-5 text-[#e9efe9]">
            <div className="text-xs uppercase tracking-[0.28em] text-[#c4d6d1]">
              Product path
            </div>
            <div className="mt-5 space-y-5">
              {snapshot.timeline.map((event) => (
                <div key={event.stage} className="grid gap-1">
                  <div className="font-medium text-[#f8fbf9]">{event.stage}</div>
                  <p className="text-sm leading-6 text-[#cdd9d4]">
                    {event.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

