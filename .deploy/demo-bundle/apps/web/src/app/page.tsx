import { DigitalWillWizard } from "../components/digital-will-wizard";
import { Hero } from "../components/hero";
import { SubscriptionSteward } from "../components/subscription-steward";
import { TimeCapsuleStudio } from "../components/time-capsule-studio";
import { TrustArchitecture } from "../components/trust-architecture";
import { scanFallback } from "../lib/fallback-data";
import { getDashboardSnapshot, listCapsules } from "../lib/api";

export default async function Home() {
  const [snapshot, capsules] = await Promise.all([
    getDashboardSnapshot(),
    listCapsules(),
  ]);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-full border border-white/60 bg-white/55 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-[#6b6259]">
            <span className="inline-flex h-3 w-3 rounded-full bg-[#1b4c44]" />
            Consumer digital legacy platform
          </div>
          <nav className="flex flex-wrap gap-2 text-sm text-[#534a41]">
            <a className="nav-pill" href="#digital-will">
              Digital Will
            </a>
            <a className="nav-pill" href="#subscriptions">
              Subscription Steward
            </a>
            <a className="nav-pill" href="#capsules">
              Time Capsule Vault
            </a>
          </nav>
        </header>

        <main className="space-y-6 pb-10">
          <Hero snapshot={snapshot} />
          <DigitalWillWizard
            householdsProtected={snapshot.willDraft.householdsProtected}
            beneficiariesConfigured={snapshot.willDraft.beneficiariesConfigured}
            vaultStatus={snapshot.willDraft.vaultStatus}
          />
          <SubscriptionSteward
            summary={snapshot.subscriptionSummary}
            initialScan={scanFallback}
          />
          <TimeCapsuleStudio
            summary={snapshot.capsuleSummary}
            initialCapsules={capsules}
          />
          <TrustArchitecture />
        </main>
      </div>
    </div>
  );
}
