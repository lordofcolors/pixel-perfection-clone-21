import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import acircleLogo from "@/assets/acircle-logo.png";
import googleLogo from "@/assets/google-g-logo.png";
import { LandingBackground } from "@/components/landing/LandingBackground";

const AuthPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  return (
    <main className="w-screen min-h-screen bg-background flex items-center justify-center font-literata relative">
      {/* Background — same as /try landing page */}
      <LandingBackground />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl border border-border bg-card p-8 shadow-xl flex flex-col items-center">
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

        {/* Try as Guest */}
        <Button
          variant="ghost"
          className="w-full h-12 text-sm font-medium text-primary hover:text-primary/80"
          onClick={() => navigate("/try")}
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
    </main>
  );
};

export default AuthPage;
