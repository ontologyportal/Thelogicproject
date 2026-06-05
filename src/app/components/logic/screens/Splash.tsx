import { useState } from "react";
import { Github, UserCircle2, Globe2, Eye, ShieldCheck, ChevronRight } from "lucide-react";

/**
 * Splash Screen - Hi-fi dark mode (v12 style)
 */
export function SplashScreen({
  onStart,
  onAuthChange,
  preAuth = false,
}: {
  onStart: () => void;
  onAuthChange: (status: "authenticated" | "guest") => void;
  preAuth?: boolean;
}) {
  const [authStatus, setAuthStatus] = useState<"authenticated" | "guest" | "none">(
    preAuth ? "guest" : "none"
  );
  const [showGithubModal, setShowGithubModal] = useState(false);

  const handleGithubSignIn = () => {
    setShowGithubModal(true);
    setTimeout(() => {
      setShowGithubModal(false);
      setAuthStatus("authenticated");
      onAuthChange("authenticated");
    }, 1000);
  };

  const handleGuestContinue = () => {
    setAuthStatus("guest");
    onAuthChange("guest");
  };

  const handleCTAClick = () => {
    // If user hasn't made an explicit auth choice, default to guest mode
    if (authStatus === "none") {
      setAuthStatus("guest");
      onAuthChange("guest");
    }
    onStart();
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a14] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-[#1a1a26]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.08),_transparent_50%)]" />
          <div className="relative max-w-[1100px] mx-auto px-10 pt-20 pb-16">
            <h1 className="text-[44px] leading-[1.05] tracking-tight max-w-[820px] mb-5">
              The Logic Project. Contribute to truly open AI,
              <span className="text-[#717182]"> defined by you.</span>
            </h1>
            <p className="text-[15px] text-[#c0c0c8] max-w-[640px] leading-relaxed mb-9">
              You're adding to a public, traceable map of how the world is described. Anyone can use it. No login walls, no proprietary formats, just shared knowledge with your name on the contribution.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={handleCTAClick}
                className="px-5 py-3 rounded-lg text-[13px] text-white flex items-center gap-2 shadow-lg bg-blue-500 hover:bg-blue-600 shadow-blue-500/20"
              >
                Start contributing <ChevronRight className="size-4" />
              </button>
            </div>
            {/* Auth row */}
            <div className="flex items-center gap-2 text-[11.5px]">
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
            </div>
            <div className="mt-12 flex items-center gap-8 text-[11px] text-[#717182]">
              <div className="flex items-center gap-2"><Globe2 className="size-3.5 text-blue-400" /> Public & open-licensed</div>
              <div className="flex items-center gap-2"><Eye className="size-3.5 text-emerald-400" /> Every claim traceable to a source</div>
              <div className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-purple-400" /> Mechanically provable consistency</div>
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
        <div className="w-full text-center pt-4 pb-4">
          <p className="text-xs text-neutral-500">
            Powered by the{" "}
            <a
              href="https://github.com/ontologyportal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-400 underline underline-offset-2 italic"
            >
              Open Knowledge Initiative
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
              <p className="text-lg text-[#e0e0e8] mb-2">Authenticating with GitHub…</p>
              <p className="text-xs italic text-neutral-500 text-center">
                If you type something specific we haven't pre-loaded, we're working on providing tailored feedback for it. This demo uses canned responses.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}