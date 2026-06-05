import { ReactNode, useState, useEffect, useRef } from "react";
import { Mic, MessagesSquare, ImageIcon, Upload, Send, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";

/* ─────────────────────────── CORE COMPONENTS ─────────────────────────── */

/**
 * Frame — main content container used across all screens
 * Hi-fi dark mode design from v12
 */
export function Frame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-[820px] mx-auto px-8 py-8">
      <h2 className="text-[22px] tracking-tight mb-2 text-[#e0e0e8]">{title}</h2>
      {subtitle && <p className="text-[13px] text-[#a0a0b0] mb-6 leading-relaxed">{subtitle}</p>}
      {children}
    </div>
  );
}

/**
 * RefineBox — multimodal input component
 * Hi-fi dark mode design
 */
type RefineState = "idle" | "refining" | "success";

export function RefineBox({
  value = "",
  onChange,
  onSend,
  onMicClick,
  onImageClick,
  onUploadClick,
  onLinkClick,
  placeholder = "type to refine, or use a mic / file / image…",
  rows = 1,
}: {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  onMicClick?: () => void;
  onImageClick?: () => void;
  onUploadClick?: () => void;
  onLinkClick?: () => void;
  placeholder?: string;
  rows?: number;
}) {
  const [refineState, setRefineState] = useState<RefineState>("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => { timersRef.current.forEach(clearTimeout); };
  }, []);

  const hasContent = value.trim().length > 0;
  const canRefine = hasContent && refineState === "idle";

  const handleRefine = () => {
    if (!canRefine) return;
    onSend?.();
    setRefineState("refining");
    const t1 = setTimeout(() => {
      setRefineState("success");
      const t2 = setTimeout(() => setRefineState("idle"), 2000);
      timersRef.current.push(t2);
    }, 1200);
    timersRef.current.push(t1);
  };

  const showBanner = refineState !== "idle";

  return (
    <div className="bg-[#1a1a26] border border-[#2a2a3a] rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="flex-1 border-none bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[13px] text-[#e0e0e8] placeholder:text-[#555]"
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-[#a0a0b0] hover:bg-white/5"
            title="Voice input"
            onClick={onMicClick}
          >
            <Mic className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-[#a0a0b0] hover:bg-white/5"
            title="Talk with AI"
            onClick={onLinkClick}
          >
            <MessagesSquare className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-[#a0a0b0] hover:bg-white/5"
            title="Upload file"
            onClick={onUploadClick}
          >
            <Upload className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-[#a0a0b0] hover:bg-white/5"
            title="Upload image"
            onClick={onImageClick}
          >
            <ImageIcon className="size-4" />
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* span wrapper so tooltip fires even when button is disabled */}
                <span>
                  <button
                    onClick={handleRefine}
                    disabled={!canRefine}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                      canRefine
                        ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                        : "bg-blue-500/20 text-blue-400/50 cursor-not-allowed"
                    }`}
                  >
                    <Send className="size-3" />
                    Refine →
                  </button>
                </span>
              </TooltipTrigger>
              {!hasContent && (
                <TooltipContent>
                  <p className="text-xs max-w-[220px]">
                    Type a refinement or add an image, file, or voice note first.
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Status banner */}
      <div
        className={`transition-opacity duration-300 ${showBanner ? "opacity-100 mt-2" : "opacity-0 pointer-events-none h-0 mt-0 overflow-hidden"}`}
      >
        {refineState === "refining" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-500/10 border border-blue-500/20">
            <span className="inline-block animate-spin text-blue-400 text-[13px]">↻</span>
            <span className="text-[11px] text-blue-300">Regenerating based on your refinement…</span>
          </div>
        )}
        {refineState === "success" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-emerald-400 text-[13px]">✓</span>
            <span className="text-[11px] text-emerald-300">Updated. The next phase has been refined based on your input.</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Wrestler — spinning sumo mascot (hi-fi version)
 */
export function Wrestler({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-2xl" role="img" aria-label="sumo wrestler">
        🤼
      </span>
    </div>
  );
}

/**
 * Plain — inline gloss span for jargon softening
 * xs, neutral-500, parenthesized
 */
export function Plain({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs text-neutral-500">
      ({children})
    </span>
  );
}

/**
 * Tooltip wrapper for gate/help explanations
 */
export function HelpTooltip({ content, children }: { content: string; children: ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Phase labels for navigation
 */
export const PHASES = [
  { id: "splash", label: "Splash" },
  { id: "p1-describe", label: "P1 Describe" },
  { id: "p2-search", label: "P2 Search" },
  { id: "p2-sharpen", label: "P2 Sharpen" },
  { id: "p3-classify", label: "P3 Classify" },
  { id: "p4-place", label: "P4 Place" },
  { id: "p5-define", label: "P5 Define" },
  { id: "p6-statements", label: "P6 Statements" },
  { id: "p7-verify", label: "P7 Verify" },
  { id: "submit", label: "Submit" },
] as const;

export type PhaseId = (typeof PHASES)[number]["id"];

/**
 * AppFooter — Global footer for all screens
 */
export function AppFooter({ isSplash = false }: { isSplash?: boolean }) {
  return (
    <div className="w-full text-center pt-4 pb-4">
      <p className="text-xs text-neutral-500">
        Powered by the{" "}
        <a
          href="https://github.com/ontologyportal"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-neutral-500 hover:text-neutral-400 underline underline-offset-2 ${isSplash ? "italic" : ""}`}
        >
          Open Knowledge Initiative
        </a>
      </p>
    </div>
  );
}
