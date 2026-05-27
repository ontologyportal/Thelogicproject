import { useEffect } from "react";
import { Wrestler, AppFooter } from "../shared";

/**
 * Phase 2: Searching Existing Terms - Hi-fi dark mode
 */
export function P2SearchScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <div className="w-full max-w-[820px] mx-auto px-8 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-[22px] tracking-tight mb-2">Phase 2. Searching existing terms</h2>
          <p className="text-[13px] text-[#a0a0b0] mb-6 leading-relaxed">we'll route you automatically</p>

          <div className="flex flex-col items-center gap-4 py-12">
            <Wrestler size={48} className="animate-spin" />
            <p className="text-[15px] text-[#c0c0c8]">
              Scanning knowledge base for related concepts…
            </p>
            <p className="text-[12px] text-[#a0a0b0]">
              You don't need to interpret raw matches. We'll take you down the right path.
            </p>
          </div>

          <div className="mt-6 text-[11px] text-[#717182] text-center">
            (Behind the scenes: exact match → reuse · related-but-distinct → connect ·
            specialization → refine · none → create new.)
          </div>
        </div>

        <AppFooter />
      </div>
    </div>
  );
}
