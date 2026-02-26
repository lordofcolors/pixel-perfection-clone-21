import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import acircleLogo from "@/assets/acircle-logo.png";
import googleLogo from "@/assets/google-g-logo.png";
import LandingPage from "./LandingPage";

const AuthPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const [phone, setPhone] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  if (!showModal) {
    return <LandingPage />;
  }

  return (
    <div className="relative font-literata">
      {/* Full landing page behind */}
      <div className="pointer-events-none select-none" aria-hidden>
        <LandingPage hideQuickStart />
      </div>

      {/* Modal overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="relative w-full max-w-sm mx-4 rounded-2xl border border-border bg-card p-8 shadow-xl flex flex-col items-center">
          {/* Close button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity text-muted-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Logo */}
          <div className="w-16 h-16 mb-6">
            <img
              src={acircleLogo}
              alt="Acircle logo"
              className="w-full h-full rounded-full"
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            Welcome to A.
          </h1>
          <p className="text-base text-muted-foreground mb-8">
            Your new learning companion
          </p>

          {/* Google sign-in */}
          <Button
            variant="google"
            className="w-full h-12 gap-3 text-sm font-medium mb-3"
            onClick={() => {
              /* Google auth wired later */
            }}
          >
            <img src={googleLogo} alt="" className="w-5 h-5" />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center w-full my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="px-4 text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Phone sign-in */}
          {showPhoneInput ? (
            <div className="w-full flex gap-2 mb-3">
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 h-12"
              />
              <Button
                disabled={phone.trim().length < 7}
                className="h-12 px-6 bg-primary text-primary-foreground"
                onClick={() => {
                  /* OTP flow wired later */
                }}
              >
                Send code
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full h-12 text-sm font-medium mb-3"
              onClick={() => setShowPhoneInput(true)}
            >
              Continue with Phone
            </Button>
          )}

          {/* Try as Guest — prominent white CTA */}
          <Button
            className="w-full h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
            onClick={() => setShowModal(false)}
          >
            Try as Guest
          </Button>

          {/* Footer */}
          <p className="mt-6 text-[11px] text-muted-foreground text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
