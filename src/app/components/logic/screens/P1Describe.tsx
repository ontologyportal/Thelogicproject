import { useState } from "react";
import { RefreshCw, Mic, ImageIcon, Upload, MessagesSquare, HelpCircle } from "lucide-react";
import { Frame, AppFooter } from "../shared";
import { FooterNavigation } from "../Navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";

/**
 * Phase 1: Describe Your Concept - Hi-fi dark mode
 */
export function P1DescribeScreen({
  onNext,
  onBack,
}: {
  onNext: (data: { description: string; scenario: string }) => void;
  onBack?: () => void;
}) {
  const [description, setDescription] = useState("");
  const [scenario, setScenario] = useState("");
  const [demoModal, setDemoModal] = useState<string | null>(null);
  const [showTitleHelp, setShowTitleHelp] = useState(false);

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const showCallout = description.length > 0 && wordCount < 20;

  const demoContent = {
    mic: "Voice recording demo: [Demo audio captured: 23 seconds. Transcription: 'Small coastal bird, found in dune grass…']",
    image: "Image demo: [Demo image uploaded: monterey-dune-warbler.jpg. The system has identified visual features: small songbird, brown plumage, teal eye stripe.]",
    upload: "File demo: [Demo file uploaded: field-notes.pdf, 2 pages. The system has extracted key terms: coastal, dune, warbler, sandy substrate.]",
    link: "Link demo: [Demo URL: ebird.org/species/monterey-dune-warbler. The system has parsed the page summary.]",
  };

  // Extract meaningful noun phrases for CamelCase canonical name
  const autoTitle = (() => {
    if (wordCount < 10) return "UnnamedConcept";

    const text = description.trim().toLowerCase();

    // Common stop words to filter out
    const stopWords = new Set([
      "a", "an", "the", "this", "that", "these", "those", "is", "are", "was", "were",
      "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would",
      "could", "should", "may", "might", "must", "can", "of", "to", "for", "with", "on",
      "at", "from", "by", "about", "as", "into", "through", "during", "before", "after",
      "above", "below", "between", "under", "over", "it", "its", "in", "and", "or", "but",
      "not", "so", "than", "too", "very", "just", "well", "kind", "thing", "i", "saw",
      "found", "has", "have"
    ]);

    // Extract important words (nouns, adjectives)
    const words = text
      .split(/\s+/)
      .map(w => w.replace(/[^a-z]/g, ""))
      .filter(w => w.length > 2 && !stopWords.has(w));

    if (words.length === 0) return "UnnamedConcept";

    // Take up to 3 most important words and convert to CamelCase
    const titleWords = words.slice(0, 3);
    return titleWords
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
  })();

  const canAdvance = description.trim().length > 0 && scenario.trim().length > 0;

  return (
    <div className="h-full flex flex-col bg-[#13131c] text-[#e0e0e8]">
      <div className="flex-1 overflow-auto">
        <Frame
          title="Phase 1. Describe your concept"
          subtitle="tell us what you're thinking about"
        >
          {/* Main multimodal input */}
          <div className="mb-4">
            <label className="text-[11px] uppercase tracking-wider text-[#717182] mb-2 block">
              Describe the concept in your own words
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the concept in your own words. You can upload an image, drop a link, or just type a stream of consciousness."
              rows={7}
              className="w-full bg-[#1a1a26] border border-[#2a2a3a] rounded-lg px-4 py-3 text-[13px] leading-relaxed outline-none resize-none focus:border-blue-500/40 placeholder:text-[#555]"
            />
            <div className="flex items-center gap-1 mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setDemoModal("mic")}
                      className="size-8 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"
                    >
                      <Mic className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Record a voice note describing your concept.</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setDemoModal("image")}
                      className="size-8 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"
                    >
                      <ImageIcon className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Upload a reference image of your concept.</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setDemoModal("upload")}
                      className="size-8 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"
                    >
                      <Upload className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Attach a file (PDF, text, document) for the system to read.</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setDemoModal("link")}
                      className="size-8 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"
                    >
                      <MessagesSquare className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Paste a link to a webpage or article.</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="size-8 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a0a0b0] ml-auto">
                      <HelpCircle className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-[200px]">
                      These buttons let you describe your concept in different ways: voice, image, file, or a web link.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Word-count callout */}
          {showCallout && (
            <div className="mb-4 p-4 rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
              <p className="text-[12px] font-medium mb-2 text-amber-400">Adding more detail helps:</p>
              <ul className="text-[11px] space-y-1 text-[#c0c0c8]">
                <li>• How is this different from similar things?</li>
                <li>• What is essential about it. What never changes?</li>
                <li>• Can you give an example of one?</li>
              </ul>
            </div>
          )}

          {/* Secondary input */}
          <div className="mb-4">
            <label className="text-[11px] uppercase tracking-wider text-[#717182] mb-2 block">
              What should the system be able to verify about this concept?
            </label>
            <textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="If something is a [your concept], then [what should be true]."
              rows={3}
              className="w-full bg-[#1a1a26] border border-[#2a2a3a] rounded-lg px-4 py-3 text-[13px] leading-relaxed outline-none resize-none focus:border-blue-500/40 placeholder:text-[#555]"
            />
          </div>

          {/* Auto-title */}
          <div className="p-3 rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-blue-400">✨ auto-generated title: </span>
              <span className="font-mono font-medium text-[#e0e0e8]">{autoTitle}</span>
            </div>
            <button
              onClick={() => setShowTitleHelp(true)}
              className="size-6 rounded hover:bg-white/5 flex items-center justify-center text-[#a0a0b0]"
              title="Learn about SUMO term names"
            >
              <HelpCircle className="size-3.5" />
            </button>
          </div>
        </Frame>

        <AppFooter />
      </div>

      <FooterNavigation onBack={onBack} onNext={() => onNext({ description, scenario })} nextDisabled={!canAdvance} />

      {/* Demo Modal */}
      {demoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#13131c] border border-[#1f1f2c] rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <p className="text-[13px] text-[#c0c0c8] mb-4 leading-relaxed">
              {demoContent[demoModal as keyof typeof demoContent]}
            </p>
            <button
              onClick={() => setDemoModal(null)}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-[13px] text-white mb-3"
            >
              Got it
            </button>
            <p className="text-xs italic text-neutral-500 text-center">
              If you type something specific we haven't pre-loaded, we're working on providing tailored feedback for it. This demo uses canned responses.
            </p>
          </div>
        </div>
      )}

      {/* Title Help Modal */}
      {showTitleHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#13131c] border border-[#1f1f2c] rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <h3 className="text-[15px] font-medium text-[#e0e0e8] mb-3">About SUMO Term Names</h3>
            <p className="text-[13px] text-[#c0c0c8] mb-4 leading-relaxed">
              This is your concept's SUMO term name. A good SUMO term must be unique within the knowledge base and should accurately describe the concept you are formalizing. The system generates a CamelCase candidate from your description, but you can refine it as you continue.
            </p>
            <button
              onClick={() => setShowTitleHelp(false)}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-[13px] text-white mb-3"
            >
              Got it
            </button>
            <p className="text-xs italic text-neutral-500 text-center">
              If you type something specific we haven't pre-loaded, we're working on providing tailored feedback for it. This demo uses canned responses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
