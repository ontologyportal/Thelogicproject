import { useState, useEffect } from "react";
import { Globe2, Eye, ShieldCheck, ChevronRight } from "lucide-react";
import { Mark } from "../shared";

/**
 * HeroNodesGraphic — decorative monochrome network: scattered contributor
 * "nodes" around a globe, converging on the brand mark itself. The globe +
 * scattered dots are the neural/perceptual half (many independent, uncertain
 * observations of the world); the convergence terminating in the actual
 * turnstile mark is the symbolic half (everything gets forced through the
 * one part of the system that isn't fuzzy). One shape, not two separate
 * ideas glued together — kept deliberately thin/faint, no illustration.
 */
function HeroNodesGraphic() {
  const nodes = [
    { x: 165, y: 25, r: 3 },
    { x: 240, y: 10, r: 4 },
    { x: 300, y: 45, r: 3 },
    { x: 175, y: 110, r: 5 },
    { x: 355, y: 60, r: 3 },
    { x: 385, y: 160, r: 4 },
    { x: 150, y: 195, r: 3 },
    { x: 220, y: 230, r: 5 },
    { x: 300, y: 180, r: 3 },
    { x: 400, y: 250, r: 3 },
  ];
  const center = { x: 300, y: 328 };
  const globe = { cx: 220, cy: 150, r: 128 };
  return (
    <svg
      viewBox="0 0 420 380"
      className="absolute right-0 top-0 h-full w-[48%] min-w-[380px] opacity-40 pointer-events-none"
      aria-hidden="true"
    >
      {/* globe: outline + two latitude arcs, thin and faint */}
      <circle cx={globe.cx} cy={globe.cy} r={globe.r} stroke="#e0e0e8" strokeWidth={0.6} strokeOpacity={0.22} fill="none" />
      <ellipse cx={globe.cx} cy={globe.cy} rx={globe.r} ry={globe.r * 0.32} stroke="#e0e0e8" strokeWidth={0.5} strokeOpacity={0.16} fill="none" />
      <ellipse cx={globe.cx} cy={globe.cy} rx={globe.r * 0.42} ry={globe.r} stroke="#e0e0e8" strokeWidth={0.5} strokeOpacity={0.16} fill="none" />

      {nodes.map((n, i) => (
        <line
          key={`l-${i}`}
          x1={n.x}
          y1={n.y}
          x2={center.x}
          y2={center.y}
          stroke="#e0e0e8"
          strokeWidth={0.6}
          strokeOpacity={0.18}
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={`c-${i}`} cx={n.x} cy={n.y} r={n.r} fill="#e0e0e8" fillOpacity={0.5} />
      ))}

      {/* convergence point: the brand mark itself, not a plain node */}
      <circle cx={center.x} cy={center.y} r={24} fill="#e0e0e8" fillOpacity={0.05} />
      <g transform={`translate(${center.x - 17}, ${center.y - 17}) scale(0.34)`}>
        <circle cx="50" cy="30" r="7" fill="#e0e0e8" />
        <circle cx="66" cy="66" r="7" fill="#e0e0e8" />
        <line x1="28" y1="53" x2="28" y2="79" stroke="#e0e0e8" strokeWidth="6" strokeLinecap="round" />
        <line x1="28" y1="66" x2="45" y2="66" stroke="#e0e0e8" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * HeroTypeToStart — a type-to-start affordance in the hero itself, rather
 * than a purely passive CTA button. Typing and hitting Enter (or tapping the
 * arrow) begins the flow, same as the primary CTA. Placeholder rotates
 * through example claims to invite input.
 */
function HeroTypeToStart({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [value, setValue] = useState("");
  const examples = [
    "a hospital ship is protected from attack…",
    "photosynthesis converts light into chemical energy…",
    "a contract needs consideration to be enforceable…",
  ];
  const [exampleIdx, setExampleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setExampleIdx((i) => (i + 1) % examples.length), 3400);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-[560px]">
      <div className="flex items-center gap-3 bg-[#13131c] border border-[#2a2a3a] focus-within:border-[#3a3a4a] rounded-full pl-5 pr-2 py-2 transition-colors">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit(value);
            }
          }}
          placeholder={`“${examples[exampleIdx]}”`}
          className="flex-1 min-w-0 overflow-hidden bg-transparent border-none outline-none text-[13.5px] text-[#e0e0e8] placeholder:text-[#555] placeholder:truncate"
        />
        <button
          onClick={() => onSubmit(value)}
          aria-label="Start contributing"
          className="flex-shrink-0 size-9 rounded-full bg-[#e0e0e8] hover:bg-white text-[#0a0a14] flex items-center justify-center transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <p className="text-[11px] text-[#717182] mt-2 pl-1">
        Start typing, or press the arrow. You'll shape it together, step by step.
      </p>
    </div>
  );
}

/**
 * Splash Screen - Hi-fi dark mode (v12 style)
 */
export function SplashScreen({
  onStart,
}: {
  onStart: (initialDescription?: string) => void;
}) {
  const handleCTAClick = (initialDescription?: string) => {
    onStart(initialDescription);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a14] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-[#1a1a26]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(224,224,232,0.08),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(224,224,232,0.05)_1px,transparent_1px)] bg-[length:26px_26px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
          <HeroNodesGraphic />
          <div className="relative max-w-[1100px] mx-auto px-10 pt-20 pb-16">
            <Mark className="size-9 text-[#e0e0e8] mb-6" />

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a3a] bg-[#13131c]/70 text-[11px] uppercase tracking-[0.14em] text-[#a0a0b0] mb-6">
              <span className="size-1.5 rounded-full bg-[#e0e0e8]" />
              Representative of reality, not a black box
            </div>

            <h1 className="text-[46px] md:text-[52px] leading-[1.06] tracking-tight max-w-[760px] mb-5">
              Everyone sees the world through their own lens.
              <span className="text-[#717182]"> This is the one model built from all of them.</span>
            </h1>

            <p className="text-[19px] text-[#c0c0c8] max-w-[620px] leading-snug mb-3">
              It's like contributing to Wikipedia,
              <span className="text-[#e0e0e8]"> except this one can prove others wrong.</span>
            </p>
            <p className="text-[16px] text-[#a0a0b0] max-w-[600px] leading-snug mb-9">
              Not a chatbot's guess. <span className="text-[#e0e0e8]">A machine-checked proof.</span>
            </p>

            <div className="mb-7">
              <HeroTypeToStart onSubmit={handleCTAClick} />
            </div>

            <div className="mt-2 flex items-center gap-8 text-[11px] text-[#717182]">
              <div className="flex items-center gap-2"><Globe2 className="size-3.5 text-[#a0a0b0]" /> Public & open-licensed</div>
              <div className="flex items-center gap-2"><Eye className="size-3.5 text-[#a0a0b0]" /> Every claim traceable to a source</div>
              <div className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-[#a0a0b0]" /> Mechanically provable consistency</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-[1100px] mx-auto px-10 py-12">
          <div className="mb-12">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#717182] mb-4">What you're contributing to</div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { n: "25,000+", l: "Concepts already defined", s: "spanning every domain you can think of" },
                { n: "180,000+", l: "Logical statements", s: "every one machine-checkable" },
                { n: "Open", l: "License: forever", s: "GNU General Public, no gatekeepers" },
              ].map(s => (
                <div key={s.l} className="bg-[#13131c] border border-[#1f1f2c] rounded-xl p-5">
                  <div className="text-[24px] tracking-tight mb-1 text-[#e0e0e8]">{s.n}</div>
                  <div className="text-[12px] text-[#e0e0e8] mb-1">{s.l}</div>
                  <div className="text-[11px] text-[#717182] leading-relaxed">{s.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full flex items-center justify-center gap-1.5 text-center pt-4 pb-4">
          <Mark className="size-3 text-neutral-500" />
          <p className="text-xs text-neutral-500">
            Powered by{" "}
            <a
              href="https://ontologyportal.github.io/sigma-rs/browse/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-400 underline underline-offset-2 italic"
            >
              SUMO
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}