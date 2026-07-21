import { useState, useEffect } from "react";
import { Github, UserCircle2, Globe2, Eye, ShieldCheck, ChevronRight } from "lucide-react";
import { getMe } from "../../../services/api";
import { Mark } from "../shared";

/**
 * HeroNodesGraphic — decorative monochrome network: scattered contributor
 * "nodes" with lines converging on a single central node. A cheap SVG
 * abstraction of many independent observers feeding one shared, provable
 * model of reality (in place of a full illustrated earth/beams scene).
 */
function HeroNodesGraphic() {
  const nodes = [
    { x: 55, y: 35, r: 3 },
    { x: 150, y: 12, r: 4 },
    { x: 235, y: 50, r: 3 },
    { x: 65, y: 128, r: 5 },
    { x: 335, y: 65, r: 3 },
    { x: 368, y: 165, r: 4 },
    { x: 28, y: 205, r: 3 },
    { x: 160, y: 235, r: 5 },
    { x: 255, y: 185, r: 3 },
    { x: 385, y: 255, r: 3 },
  ];
  const center = { x: 300, y: 328, r: 10 };
  return (
    <svg
      viewBox="0 0 420 380"
      className="absolute right-0 top-0 h-full w-[48%] min-w-[380px] opacity-40 pointer-events-none"
      aria-hidden="true"
    >
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
      <circle cx={center.x} cy={center.y} r={center.r + 7} fill="#e0e0e8" fillOpacity={0.06} />
      <circle cx={center.x} cy={center.y} r={center.r} fill="#e0e0e8" fillOpacity={0.75} />
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
    "a hospital ship is protected from attack under international law…",
    "photosynthesis converts light energy into chemical energy…",
    "a contract requires consideration to be enforceable…",
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
          placeholder={`Describe something the world should know: “${examples[exampleIdx]}”`}
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13.5px] text-[#e0e0e8] placeholder:text-[#555] placeholder:truncate"
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
  onAuthChange,
  preAuth = false,
}: {
  onStart: (initialDescription?: string) => void;
  onAuthChange: (status: "authenticated" | "guest") => void;
  preAuth?: boolean;
}) {
  const [authStatus, setAuthStatus] = useState<"authenticated" | "guest" | "none">(
    preAuth ? "guest" : "none"
  );
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubLogin, setGithubLogin] = useState<string | null>(null);

  // Picks up an existing session, e.g. right after the OAuth redirect back to "/".
  useEffect(() => {
    getMe().then((me) => {
      if (me) {
        setGithubLogin(me.login);
        setAuthStatus("authenticated");
        onAuthChange("authenticated");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGithubSignIn = () => {
    setShowGithubModal(true);
    window.location.href = "/api/auth/login";
  };

  const handleGuestContinue = () => {
    setAuthStatus("guest");
    onAuthChange("guest");
    onStart();
  };

  const handleCTAClick = (initialDescription?: string) => {
    // If user hasn't made an explicit auth choice, default to guest mode
    if (authStatus === "none") {
      setAuthStatus("guest");
      onAuthChange("guest");
    }
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
            <p className="text-[14px] text-[#a0a0b0] max-w-[600px] leading-relaxed mb-9">
              Every claim you add becomes a formal, checkable statement. Phase 7 of this wizard runs Vampire, a real automated theorem prover, live in your browser, against everything the system already knows. Not a canned response: an actual proof, or a real contradiction surfaced.
            </p>

            <div className="mb-7">
              <HeroTypeToStart onSubmit={handleCTAClick} />
            </div>

            {/* Auth row */}
            <div className="flex items-center gap-2 text-[11.5px]">
              {authStatus === "authenticated" && githubLogin ? (
                <span className="px-3 py-2 rounded-md bg-[#13131c] border border-[#2a2a3a] text-[#e0e0e8] flex items-center gap-2">
                  <Github className="size-3.5" /> Signed in as @{githubLogin}
                </span>
              ) : (
                <>
                  <button
                    onClick={handleGithubSignIn}
                    disabled={authStatus !== "none"}
                    className="px-3 py-2 rounded-md bg-[#13131c] border border-[#1f1f2c] hover:border-[#2a2a3a] text-[#c0c0c8] flex items-center gap-2 disabled:opacity-50"
                  >
                    <Github className="size-3.5" /> Sign in with GitHub
                    <span className="text-[10px] text-[#717182]">claim credit</span>
                  </button>
                  <span className="text-[#555]">or</span>
                  <button
                    onClick={handleGuestContinue}
                    disabled={authStatus !== "none"}
                    className="px-3 py-2 rounded-md text-[#a0a0b0] hover:text-white hover:bg-white/5 flex items-center gap-2 disabled:opacity-50"
                  >
                    <UserCircle2 className="size-3.5" /> Continue as guest
                  </button>
                </>
              )}
            </div>
            <div className="mt-12 flex items-center gap-8 text-[11px] text-[#717182]">
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

      {/* GitHub auth modal */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#13131c] border border-[#1f1f2c] rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="animate-spin">
                <Github className="size-12 text-[#a0a0b0]" />
              </div>
              <p className="text-lg text-[#e0e0e8] mb-2">Redirecting to GitHub…</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}