import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import acircleLogo from "@/assets/acircle-logo.png";

const skillSuggestions = [
  "I want to improve my interviewing skills",
  "I want to learn Scratch to design game characters",
  "I want to improve my public speaking skills",
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState("");

  const handleSubmit = () => {
    if (skillInput.trim()) {
      navigate("/onboarding", { state: { skill: skillInput } });
    }
  };

  const handleSuggestionClick = (skill: string) => {
    navigate("/onboarding", { state: { skill } });
  };

  return (
    <main className="w-screen min-h-screen bg-background flex flex-col font-literata">
      {/* Login button */}
      <div className="flex justify-end p-6 relative z-10">
        <Button
          asChild
          className="rounded-lg px-6 bg-xolv-magenta-300 text-black hover:bg-xolv-magenta-300/90 border-none"
        >
          <Link to="/onboarding">Login</Link>
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        {/* Logo */}
        <div className="w-[140px] h-[140px] mb-10">
          <img
            src={acircleLogo}
            alt="Acircle learning companion logo"
            className="w-full h-full rounded-full"
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl text-primary text-center leading-relaxed mb-1">
          Hi, I'm A, your new learning companion!
        </h1>
        <h2 className="text-2xl md:text-3xl text-foreground text-center leading-relaxed mb-12">
          What skill would you like to learn today?
        </h2>

        {/* Input area */}
        <div className="w-full max-w-2xl mb-8">
          <div className="relative border border-border rounded-xl bg-card p-4 min-h-[110px]">
            <textarea
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Enter a skill you would like to learn..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none outline-none text-base pr-12 min-h-[60px]"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!skillInput.trim()}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-lg bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors disabled:opacity-40"
              aria-label="Submit skill"
            >
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Suggestion cards */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {skillSuggestions.map((skill, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(skill)}
              className="text-left p-5 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm text-foreground leading-relaxed"
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-3 pb-8 text-sm text-muted-foreground">
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Use</a>
        </div>
        <span className="text-xs tracking-widest font-semibold text-muted-foreground/60 uppercase">
          XOLV
        </span>
      </footer>
    </main>
  );
};

export default LandingPage;
