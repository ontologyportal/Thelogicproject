import { ReactNode, useState, useEffect, useRef } from "react";
import { Mic, MessagesSquare, ImageIcon, Upload, Send, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";

/* ─────────────────────────── CORE COMPONENTS ─────────────────────────── */

/**
 * Mark — the brand symbol. A "therefore" (∴) mark with the L point drawn as a
 * turnstile (⊢), standing in for T / L / P. Inherits color via currentColor.
 */
export function Mark({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <circle cx="50" cy="30" r="7" fill="currentColor" />
      <circle cx="66" cy="66" r="7" fill="currentColor" />
      <line x1="28" y1="53" x2="28" y2="79" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="28" y1="66" x2="45" y2="66" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

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
    <div className="relative w-full max-w-[820px] mx-auto px-8 pt-10 pb-8">
      <div
        className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle,rgba(224,224,232,0.05)_1px,transparent_1px)] bg-[length:24px_24px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)] pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative">
        <h2 className="text-[26px] leading-[1.15] tracking-tight mb-2.5 text-[#e0e0e8]">{title}</h2>
        {subtitle && (
          <p className="flex items-start gap-2 text-[13px] text-[#a0a0b0] mb-8 leading-relaxed max-w-[560px]">
            <span className="mt-[7px] size-1.5 rounded-full bg-[#3a3a4a] flex-shrink-0" aria-hidden="true" />
            {subtitle}
          </p>
        )}
        {children}
      </div>
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
    <div className="bg-[#1a1a26] border border-[#2a2a3a] focus-within:border-[#3a3a4a] rounded-xl p-3.5 transition-colors">
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
                        ? "bg-[#e0e0e8] hover:bg-white text-[#0a0a14] cursor-pointer"
                        : "bg-[#2a2a3a] text-[#717182] cursor-not-allowed"
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
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#13131c] border border-[#2a2a3a]">
            <span className="inline-block animate-spin text-[#e0e0e8] text-[13px]">↻</span>
            <span className="text-[11px] text-[#a0a0b0]">Regenerating based on your refinement…</span>
          </div>
        )}
        {refineState === "success" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#13131c] border border-[#2a2a3a]">
            <span className="text-[#e0e0e8] text-[13px]">✓</span>
            <span className="text-[11px] text-[#a0a0b0]">Updated. The next phase has been refined based on your input.</span>
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
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-[#2a2a3a] to-[#13131c] border border-[#3a3a4a] ${className}`}
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
 * AISuggestionBadge — small source tag for AI-generated content.
 * "default": generic suggestion label.
 * "inference": used when the value is extrapolated from user input (more aggressive framing).
 */
export function AISuggestionBadge({ variant = "default" }: { variant?: "default" | "inference" }) {
  const label =
    variant === "inference"
      ? "ai inference from your description"
      : "ai suggestion · review required";
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#2a2a3a] bg-[#13131c]/70 text-[10px] uppercase tracking-wider text-[#a0a0b0] cursor-default select-none">
            <span aria-hidden>✨</span> {label}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs leading-relaxed">
            These values were inferred by the AI from your input. Review and edit
            before approving. The system will not commit them without your
            confirmation.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
  { id: "conflict-resolution", label: "Conflict Resolution" },
  { id: "submit", label: "Submit" },
] as const;

export type PhaseId = (typeof PHASES)[number]["id"];

/**
 * AppFooter — Global footer for all screens
 */
export function AppFooter({ isSplash = false }: { isSplash?: boolean }) {
  return (
    <div className="w-full max-w-[820px] mx-auto flex items-center justify-center gap-1.5 text-center border-t border-[#1a1a26] mt-4 pt-5 pb-6">
      <Mark className="size-3 text-neutral-500" />
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
