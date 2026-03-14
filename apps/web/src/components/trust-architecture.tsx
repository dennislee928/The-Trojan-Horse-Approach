export function TrustArchitecture() {
  const layers = [
    {
      title: "Go core API",
      detail:
        "Owns the user journey, dead-man switch timers, mock receipt scanning, and delivery orchestration.",
    },
    {
      title: "Rust vault",
      detail:
        "Seals guides and capsules with AES-256-GCM so the stored payload stays unreadable until release.",
    },
    {
      title: "Next.js front door",
      detail:
        "Creates the trust-building consumer experience that makes a sensitive topic feel approachable.",
    },
    {
      title: "Proto-ready bridge",
      detail:
        "Shared contracts prepare the repo for a gRPC handoff once the MVP outgrows HTTP orchestration.",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_18px_50px_rgba(72,52,37,0.08)] lg:p-8">
      <div className="section-kicker">Architecture</div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <h2 className="section-title">One platform, three on-ramps.</h2>
          <p className="section-copy">
            The product strategy is deliberately layered: solve a daily problem,
            earn trust, then convert that trust into a durable digital legacy
            workflow. The code mirrors that structure.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {layers.map((layer) => (
            <article
              key={layer.title}
              className="rounded-[1.5rem] border border-[#eadfd0] bg-[#fffaf3] p-5"
            >
              <div className="text-lg font-semibold text-[#2f261f]">
                {layer.title}
              </div>
              <p className="mt-3 text-sm leading-7 text-[#66594c]">
                {layer.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
