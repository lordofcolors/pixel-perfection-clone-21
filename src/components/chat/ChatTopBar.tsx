/**
 * =============================================================================
 * ChatTopBar
 * =============================================================================
 *
 * The header bar at the top of the /chat page. Contains:
 *   - A back button that returns to the home page
 *   - "Quick Start" label
 *   - Toggle switches for Image Search and Skill Map panels
 *
 * The bar fades in over 2 seconds once the main content is ready.
 */

import { ArrowLeft, Image, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ChatTopBarProps {
  /** Whether the main content has loaded (controls fade-in). */
  showContent: boolean;
  /** Navigate back to home. */
  onBack: () => void;
  /** Current state of the Image Search toggle. */
  imageSearchOn: boolean;
  /** Callback when Image Search is toggled. */
  onImageSearchChange: (value: boolean) => void;
  /** Current state of the Skill Map toggle. */
  skillMapOn: boolean;
  /** Callback when Skill Map is toggled. */
  onSkillMapChange: (value: boolean) => void;
}

export function ChatTopBar({
  showContent,
  onBack,
  imageSearchOn,
  onImageSearchChange,
  skillMapOn,
  onSkillMapChange,
}: ChatTopBarProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-border/50 bg-card/30 px-4 py-2 transition-opacity duration-[2000ms] ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Left: back button + page title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Quick Start</span>
      </div>

      {/* Right: panel toggle switches */}
      <div className="flex items-center gap-6">
        {/* Image Search toggle */}
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Image Search</span>
          <Switch checked={imageSearchOn} onCheckedChange={onImageSearchChange} />
        </div>

        {/* Skill Map toggle */}
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Skill Map</span>
          <Switch checked={skillMapOn} onCheckedChange={onSkillMapChange} />
        </div>
      </div>
    </div>
  );
}
