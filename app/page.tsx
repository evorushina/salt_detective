"use client";

import { useEffect, useMemo, useState } from "react";

type IonKey =
  | "Na+" | "K+" | "Ca2+" | "Mg2+"
  | "Cu2+" | "Fe3+" | "Co2+" | "Ni2+" | "Mn2+" | "Ba2+"
  | "Cl-" | "Br-" | "I-" | "SO4^2-" | "NO3-" | "Cr2O7^2-" | "MnO4-";

type Salt = {
  name: string;
  cation: IonKey;
  anion: IonKey;
  clues: {
    solidColor: string;
    solutionColor: string;
  };
  flame?: "orange" | "lilac" | "green" | "none";
  reagents: {
    AgNO3?: "white" | "cream" | "yellow" | "none";
    BaCl2?: "white" | "none";
    NaOH?: "brown" | "blue" | "green" | "white" | "pink" | "none";
  };
};

const SALTS: Salt[] = [
  {
    name: "Sodium Chloride",
    cation: "Na+",
    anion: "Cl-",
    clues: { solidColor: "white", solutionColor: "colorless" },
    flame: "orange",
    reagents: { AgNO3: "white", BaCl2: "none", NaOH: "none" },
  },
  {
    name: "Potassium Bromide",
    cation: "K+",
    anion: "Br-",
    clues: { solidColor: "white", solutionColor: "colorless" },
    flame: "lilac",
    reagents: { AgNO3: "cream", BaCl2: "none", NaOH: "none" },
  },
  {
    name: "Copper(II) Chloride",
    cation: "Cu2+",
    anion: "Cl-",
    clues: { solidColor: "green", solutionColor: "blue" },
    flame: "green",
    reagents: { AgNO3: "white", BaCl2: "none", NaOH: "blue" },
  },
  {
    name: "Barium Sulfate",
    cation: "Ba2+",
    anion: "SO4^2-",
    clues: { solidColor: "white", solutionColor: "colorless" },
    flame: "none",
    reagents: { AgNO3: "none", BaCl2: "white", NaOH: "white" },
  },
  {
    name: "Sodium Iodide",
    cation: "Na+",
    anion: "I-",
    clues: { solidColor: "white", solutionColor: "colorless" },
    flame: "orange",
    reagents: { AgNO3: "yellow", BaCl2: "none", NaOH: "none" },
  },
  // Enhanced edition specific examples
  {
    name: "Eisen(III)-chlorid (Iron(III) Chloride)",
    cation: "Fe3+",
    anion: "Cl-",
    clues: { solidColor: "brown", solutionColor: "brown" },
    flame: "none",
    reagents: { AgNO3: "white", BaCl2: "none", NaOH: "brown" },
  },
  {
    name: "Cobalt(II) Chloride",
    cation: "Co2+",
    anion: "Cl-",
    clues: { solidColor: "pink", solutionColor: "pink" },
    flame: "none",
    reagents: { AgNO3: "white", BaCl2: "none", NaOH: "pink" },
  },
  {
    name: "Nickel(II) Sulfate",
    cation: "Ni2+",
    anion: "SO4^2-",
    clues: { solidColor: "green", solutionColor: "green" },
    flame: "none",
    reagents: { AgNO3: "none", BaCl2: "white", NaOH: "green" },
  },
  {
    name: "Potassium Permanganate",
    cation: "K+",
    anion: "MnO4-",
    clues: { solidColor: "dark-violet", solutionColor: "violet" },
    flame: "lilac",
    reagents: { AgNO3: "none", BaCl2: "none", NaOH: "none" },
  },
  {
    name: "Sodium Dichromate",
    cation: "Na+",
    anion: "Cr2O7^2-",
    clues: { solidColor: "orange", solutionColor: "orange" },
    flame: "orange",
    reagents: { AgNO3: "none", BaCl2: "none", NaOH: "none" },
  },
  {
    name: "Copper(II) Sulfate",
    cation: "Cu2+",
    anion: "SO4^2-",
    clues: { solidColor: "blue", solutionColor: "blue" },
    flame: "green",
    reagents: { AgNO3: "none", BaCl2: "white", NaOH: "blue" },
  },
  {
    name: "Calcium Chloride",
    cation: "Ca2+",
    anion: "Cl-",
    clues: { solidColor: "white", solutionColor: "colorless" },
    flame: "none",
    reagents: { AgNO3: "white", BaCl2: "none", NaOH: "white" },
  },
];

const CATIONS: IonKey[] = ["Na+", "K+", "Ca2+", "Mg2+", "Cu2+", "Fe3+", "Co2+", "Ni2+", "Mn2+"];
const ANIONS: IonKey[] = ["Cl-", "Br-", "I-", "SO4^2-", "NO3-", "Cr2O7^2-", "MnO4-"];

type ViewMode = "idle" | "flame" | "reagent";

export default function Home() {
  const [unknownSalt, setUnknownSalt] = useState<Salt | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [mode, setMode] = useState<ViewMode>("idle");
  const [isDissolving, setIsDissolving] = useState(true);
  const [currentFlame, setCurrentFlame] = useState<"orange" | "lilac" | "green" | "none">("none");
  const [currentReagent, setCurrentReagent] = useState<"AgNO3" | "BaCl2" | "NaOH" | null>(null);
  const [precipitateColor, setPrecipitateColor] = useState<"white" | "cream" | "yellow" | "brown" | "blue" | "green" | "pink" | "none">("none");
  const [cationGuess, setCationGuess] = useState<IonKey>(CATIONS[0]);
  const [anionGuess, setAnionGuess] = useState<IonKey>(ANIONS[0]);
  const [showWin, setShowWin] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const resetGame = () => {
    const next = SALTS[Math.floor(Math.random() * SALTS.length)];
    setUnknownSalt(next);
    setLog([
      `A sample of an unknown salt appears ${next.clues.solidColor}.`,
      `Its solution looks ${next.clues.solutionColor}.`,
    ]);
    setMode("idle");
    setIsDissolving(true);
    setCurrentFlame("none");
    setCurrentReagent(null);
    setPrecipitateColor("none");
    setCationGuess(CATIONS[0]);
    setAnionGuess(ANIONS[0]);
    setShowWin(false);
    setFeedback(null);
  };

  // Initialize sample only on client to avoid SSR/client mismatch
  useEffect(() => {
    if (!unknownSalt) {
      const start = SALTS[Math.floor(Math.random() * SALTS.length)];
      setUnknownSalt(start);
      setLog([
        `A sample of an unknown salt appears ${start.clues.solidColor}.`,
        `Its solution looks ${start.clues.solutionColor}.`,
      ]);
      setIsDissolving(true);
    }
  }, [unknownSalt]);

  useEffect(() => {
    if (isDissolving) {
      const t = setTimeout(() => setIsDissolving(false), 1800);
      return () => clearTimeout(t);
    }
  }, [isDissolving, unknownSalt]);

  const doFlameTest = () => {
    if (!unknownSalt) return;
    setMode("flame");
    const color = unknownSalt.flame ?? "orange";
    setCurrentFlame(unknownSalt.flame ? unknownSalt.flame : "none");
    const message = unknownSalt.flame
      ? `Flame test shows a ${color} flame.`
      : "Flame test is inconclusive.";
    setLog((prev) => [...prev, message]);
  };

  const addReagent = (reagent: "AgNO3" | "BaCl2" | "NaOH") => {
    if (!unknownSalt) return;
    setMode("reagent");
    setCurrentReagent(reagent);
    const outcome = unknownSalt.reagents[reagent] ?? "none";
    setPrecipitateColor(outcome === "none" ? "none" : outcome);
    const description =
      outcome === "none"
        ? `Adding ${reagent}: no visible reaction.`
        : `Adding ${reagent}: a ${outcome} precipitate forms.`;
    setLog((prev) => [...prev, description]);
  };

  const guess = () => {
    if (!unknownSalt) return;
    const correct = cationGuess === unknownSalt.cation && anionGuess === unknownSalt.anion;
    if (correct) {
      setShowWin(true);
    } else {
      setFeedback("Not quite, try another test!");
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const flameClass = useMemo(() => {
    switch (currentFlame) {
      case "orange":
        return "flame-orange";
      case "lilac":
        return "flame-lilac";
      case "green":
        return "flame-green";
      default:
        return "flame-none";
    }
  }, [currentFlame]);

  function solutionHexFor(salt: Salt): string {
    // Choose a tint based on characteristic solution color hints.
    const color = salt.clues.solutionColor.toLowerCase();
    if (color.includes("blue")) return "#2aa3ff";
    if (color.includes("green")) return "#22c55e";
    if (color.includes("violet")) return "#7c3aed";
    if (color.includes("pink")) return "#ec4899";
    if (color.includes("orange")) return "#f97316";
    if (color.includes("brown")) return "#8b5e3c";
    return "#3b82f6"; // default soft blue for colorless/neutral
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="w-full border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Salt Detective</h1>
        <button className="text-sm px-3 py-1 rounded border border-white/20 hover:bg-white/5" onClick={resetGame}>
          New Sample
        </button>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Visualization Area */}
        <section className="relative p-6 md:p-8 flex items-center justify-center bg-black/5">
          {!unknownSalt ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="beaker skeleton" style={{ width: 220, height: 260, borderRadius: 12 }} />
            </div>
          ) : mode === "flame" ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <div className={`bunsen`}></div>
              <div className={`flame ${flameClass}`}>
                <div className={`sparks ${flameClass}`}></div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="beaker" style={{ ["--solution" as any]: unknownSalt ? solutionHexFor(unknownSalt) : "#3b82f6" }}>
                <div className="liquid tinted"></div>
                {isDissolving ? (
                  <>
                    <div className="crystals"></div>
                    <div className="crystal-particles"></div>
                  </>
                ) : null}
                {mode === "reagent" && currentReagent ? (
                  <div className={`dropper ${currentReagent === "AgNO3" ? "drop-ag" : currentReagent === "BaCl2" ? "drop-ba" : "drop-naoh"}`}></div>
                ) : null}
                {mode === "reagent" && precipitateColor !== "none" ? (
                  <>
                    <div className={`cloud cloud-${precipitateColor}`}></div>
                    <div className={`precip precip-${precipitateColor}`}></div>
                    <div className={`grains grains-${precipitateColor}`}></div>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </section>

        {/* Control Panel */}
        <section className="p-6 md:p-8 border-l border-white/10 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Experiment Log</h2>
            <div className="h-40 md:h-56 overflow-auto rounded border border-white/15 bg-white/5 p-3 text-sm space-y-1">
              {!unknownSalt ? (
                <>
                  <div className="skeleton h-4 rounded w-3/4" />
                  <div className="skeleton h-4 rounded w-5/6" />
                  <div className="skeleton h-4 rounded w-2/3" />
                </>
              ) : (
                (log.length ? log : ["Preparing sample..."]).map((entry, idx) => (
                  <div key={idx}>• {entry}</div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-medium">Run Tests</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10" onClick={doFlameTest}>
                🔥 Flame Test
              </button>
              <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10" onClick={() => addReagent("AgNO3")}>
                💧 Add AgNO₃
              </button>
              <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10" onClick={() => addReagent("BaCl2")}>
                💧 Add BaCl₂
              </button>
              <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10" onClick={() => addReagent("NaOH")}>
                💧 Add NaOH
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-medium">Make a Guess</h3>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="px-2 py-2 rounded bg-white/10 border border-white/10"
                value={cationGuess}
                onChange={(e) => setCationGuess(e.target.value as IonKey)}
              >
                {CATIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span>+</span>
              <select
                className="px-2 py-2 rounded bg-white/10 border border-white/10"
                value={anionGuess}
                onChange={(e) => setAnionGuess(e.target.value as IonKey)}
              >
                {ANIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <button className="px-3 py-2 rounded bg-green-600 hover:bg-green-500 text-white" onClick={guess}>
                Guess!
              </button>
            </div>
          </div>

          {feedback ? (
            <div className="text-amber-400 text-sm">{feedback}</div>
          ) : null}

          <div className="mt-auto text-xs text-white/50">
            Tip: Different tests reveal cations vs anions. Try multiple!
          </div>
        </section>
      </main>

      {showWin && unknownSalt ? (
        <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-lg border border-white/20 bg-black/80 p-6 text-center space-y-3">
            <div className="text-2xl">🎉 Correct!</div>
            <div className="text-white/90">The salt was <span className="font-semibold">{unknownSalt.name}</span>.</div>
            <button className="mt-2 px-4 py-2 rounded bg-white/15 hover:bg-white/25 border border-white/15" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
