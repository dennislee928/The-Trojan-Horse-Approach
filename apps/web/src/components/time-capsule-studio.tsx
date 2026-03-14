"use client";

import { useState, useTransition } from "react";

import { createCapsule } from "../lib/api";
import type { Capsule, CapsuleRequest, CapsuleResponse, DashboardSnapshot } from "../lib/types";

type TimeCapsuleStudioProps = {
  summary: DashboardSnapshot["capsuleSummary"];
  initialCapsules: Capsule[];
};

export function TimeCapsuleStudio({
  summary,
  initialCapsules,
}: TimeCapsuleStudioProps) {
  const [title, setTitle] = useState("A note for the difficult days");
  const [recipient, setRecipient] = useState("Kai");
  const [deliverOn, setDeliverOn] = useState("2026-08-12");
  const [unlockRule, setUnlockRule] = useState("Confirm inactivity, then release");
  const [message, setMessage] = useState(
    "If you are hearing this, I wanted you to have clarity, not chaos. The practical items are in the guide; this capsule is only the human part.",
  );
  const [capsules, setCapsules] = useState<Capsule[]>(initialCapsules);
  const [result, setResult] = useState<CapsuleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreateCapsule() {
    setError(null);
    const payload: CapsuleRequest = {
      title,
      recipient,
      deliverOn,
      unlockRule,
      message,
    };

    startTransition(async () => {
      try {
        const response = await createCapsule(payload);
        setResult(response);
        setCapsules((current) => [
          {
            capsuleId: response.capsuleId,
            title,
            recipient,
            deliverOn,
            unlockRule,
            storageStatus: response.storageStatus,
          },
          ...current,
        ]);
      } catch (createError) {
        setError(
          createError instanceof Error
            ? createError.message
            : "Unable to create time capsule.",
        );
      }
    });
  }

  return (
    <section
      id="capsules"
      className="grid gap-6 rounded-[2rem] border border-[#ead9e0] bg-[#fff6f7]/90 p-6 shadow-[0_18px_50px_rgba(104,51,68,0.08)] lg:grid-cols-[1fr_1fr] lg:p-8"
    >
      <div className="space-y-6">
        <div>
          <div className="section-kicker">Product 3</div>
          <h2 className="section-title">Time capsules that feel human, not forensic.</h2>
          <p className="section-copy">
            Users can store intimate messages, milestone notes, and file-based
            artifacts that release on a chosen date or after the trigger logic
            is satisfied.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="stat-card">
            <div className="stat-label">Scheduled deliveries</div>
            <div className="stat-value">{summary.scheduledDeliveries}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Encrypted artifacts</div>
            <div className="stat-value">{summary.encryptedArtifacts}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Next release</div>
            <div className="stat-value text-lg">{summary.nextReleaseWindow}</div>
          </article>
        </div>

        <div className="grid gap-5">
          <label className="field">
            <span>Capsule title</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="field">
              <span>Recipient</span>
              <input value={recipient} onChange={(event) => setRecipient(event.target.value)} />
            </label>
            <label className="field">
              <span>Deliver on</span>
              <input
                type="date"
                value={deliverOn}
                onChange={(event) => setDeliverOn(event.target.value)}
              />
            </label>
          </div>

          <label className="field">
            <span>Unlock rule</span>
            <input
              value={unlockRule}
              onChange={(event) => setUnlockRule(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Message</span>
            <textarea
              rows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleCreateCapsule}
          className="primary-button bg-[#7f3551] text-white hover:bg-[#65263f]"
          disabled={isPending}
        >
          {isPending ? "Sealing capsule..." : "Seal time capsule"}
        </button>

        {error ? <p className="text-sm text-[#a84f35]">{error}</p> : null}
      </div>

      <aside className="space-y-5">
        <div className="rounded-[1.7rem] bg-[#2f1f2a] p-6 text-[#f4edf1]">
          <div className="text-xs uppercase tracking-[0.28em] text-[#d4b8c5]">
            Release ledger
          </div>
          <div className="mt-5 space-y-3">
            {capsules.map((capsule) => (
              <article
                key={capsule.capsuleId}
                className="rounded-[1.3rem] border border-white/8 bg-white/6 p-4"
              >
                <div className="font-medium">{capsule.title}</div>
                <div className="mt-1 text-sm text-[#dbcad2]">
                  {capsule.recipient} · {capsule.deliverOn}
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.2em] text-[#f0d7e1]">
                  {capsule.unlockRule}
                </div>
                <div className="mt-2 text-sm text-[#d7c7cf]">
                  {capsule.storageStatus}
                </div>
              </article>
            ))}
          </div>
        </div>

        {result ? (
          <div className="rounded-[1.7rem] border border-[#ead9e0] bg-white/88 p-6">
            <div className="text-xs uppercase tracking-[0.28em] text-[#8c5a6b]">
              Vault receipt
            </div>
            <div className="mt-3 text-xl font-semibold text-[#3c2531]">
              Capsule {result.capsuleId}
            </div>
            <p className="mt-3 text-sm leading-6 text-[#654857]">
              {result.storageStatus}
            </p>
            <div className="mt-4 rounded-[1.2rem] bg-[#f8f0f4] p-4 font-mono text-xs text-[#70495a]">
              {result.cipherPreview}
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[#5a3f4b]">
              {result.manifest.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>
    </section>
  );
}

