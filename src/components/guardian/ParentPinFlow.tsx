import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { getGuardianSetup, saveGuardianSetup } from "@/lib/store";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ParentPinFlowProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learnerName: string;
  mode: 'setup-before-switch' | 'verify-to-parent';
  onSuccess?: () => void;
};

export function ParentPinFlow({ open, onOpenChange, learnerName, mode, onSuccess }: ParentPinFlowProps) {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<'setup' | 'confirm' | 'verify' | 'forgot'>('setup');
  const [error, setError] = useState("");

  // Get fresh data from store when dialog opens
  useEffect(() => {
    if (open) {
      const currentSetup = getGuardianSetup();
      const pinExists = !!currentSetup?.parentPin;
      
      // Set the correct initial step based on whether PIN exists
      if (pinExists) {
        setStep('verify');
      } else {
        setStep('setup');
      }
      
      setPin("");
      setConfirmPin("");
      setError("");
    }
  }, [open]);

  // Get fresh setup data for each render when open
  const setup = getGuardianSetup();
  const parentName = setup?.guardianName || "Parent";

  const handleSetPin = () => {
    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN.");
      return;
    }
    setConfirmPin(pin);
    setPin("");
    setStep('confirm');
    setError("");
  };

  const handleConfirmPin = () => {
    if (pin !== confirmPin) {
      setError("PINs don't match. Please try again.");
      setPin("");
      setConfirmPin("");
      setStep('setup');
      return;
    }
    
    // Save PIN - get fresh setup data
    const currentSetup = getGuardianSetup();
    if (currentSetup) {
      saveGuardianSetup({ ...currentSetup, parentPin: pin });
    }
    
    toast({
      title: "PIN created!",
      description: "You can now easily switch back to the Family Dashboard.",
    });
    
    // If setting up before switch, proceed to switch
    if (mode === 'setup-before-switch') {
      onOpenChange(false);
      navigate('/learner', { state: { firstName: learnerName } });
    } else if (onSuccess) {
      onOpenChange(false);
      onSuccess();
    }
    
    setPin("");
    setConfirmPin("");
  };

  const handleVerifyPin = () => {
    const currentSetup = getGuardianSetup();
    console.log("Verifying PIN...", { enteredPin: pin, storedPin: currentSetup?.parentPin, mode });
    
    if (pin === currentSetup?.parentPin) {
      console.log("PIN verified! Navigating...");
      onOpenChange(false);
      setPin("");
      setError("");
      
      if (mode === 'setup-before-switch') {
        console.log("Navigating to /learner for:", learnerName);
        navigate('/learner', { state: { firstName: learnerName } });
      } else if (mode === 'verify-to-parent') {
        console.log("Navigating to /guardian/manage");
        navigate('/guardian/manage');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } else {
      console.log("PIN mismatch!");
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  const handleForgotPin = () => {
    // For now, just show a message about using Google auth
    toast({
      title: "PIN Recovery",
      description: "Please use Google Sign-In to verify your identity and reset your PIN.",
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setPin("");
    setConfirmPin("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* SETUP STEP */}
        {step === 'setup' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Create Your Parent PIN
              </DialogTitle>
              <DialogDescription>
                {mode === 'setup-before-switch' 
                  ? `Before switching to ${learnerName}'s account, create a 4-digit PIN so you can easily switch back.`
                  : "Create a 4-digit PIN to protect your Family Dashboard."
                }
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center py-6 space-y-4">
              <InputOTP
                maxLength={4}
                value={pin}
                onChange={(value) => {
                  setPin(value);
                  setError("");
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
              
              {error && <p className="text-sm text-destructive">{error}</p>}
              
              <p className="text-xs text-muted-foreground text-center">
                This PIN will be required to access the Family Dashboard.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSetPin}
                className="flex-1"
                disabled={pin.length !== 4}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {/* CONFIRM STEP */}
        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Confirm Your PIN
              </DialogTitle>
              <DialogDescription>
                Enter your 4-digit PIN again to confirm.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center py-6 space-y-4">
              <InputOTP
                maxLength={4}
                value={pin}
                onChange={(value) => {
                  setPin(value);
                  setError("");
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
              
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setStep('setup'); setPin(''); }} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleConfirmPin}
                className="flex-1"
                disabled={pin.length !== 4}
              >
                Set PIN & Continue
              </Button>
            </div>
          </>
        )}

        {/* VERIFY STEP */}
        {step === 'verify' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Enter Parent PIN
              </DialogTitle>
              <DialogDescription>
                Enter your 4-digit PIN to access the Family Dashboard.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center py-6 space-y-4">
              <InputOTP
                maxLength={4}
                value={pin}
                onChange={(value) => {
                  setPin(value);
                  setError("");
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
              
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleVerifyPin}
                  className="flex-1"
                  disabled={pin.length !== 4}
                >
                  Unlock
                </Button>
              </div>
              
              <Button
                variant="link"
                onClick={handleForgotPin}
                className="w-full text-muted-foreground"
              >
                Forgot your PIN? Use Google Sign-In
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
