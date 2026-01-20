import { useState } from "react";
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
import { Lock, ArrowRight, Mail, ArrowLeft } from "lucide-react";
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
  
  const setup = getGuardianSetup();
  const hasPin = !!setup?.parentPin;
  const parentEmail = setup?.guardianEmail || "";

  // Determine initial step based on mode and whether PIN exists
  const getInitialStep = () => {
    if (mode === 'setup-before-switch') {
      return hasPin ? 'verify' : 'setup';
    }
    return hasPin ? 'verify' : 'setup';
  };

  // Reset state when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setStep(getInitialStep());
      setPin("");
      setConfirmPin("");
      setError("");
    }
    onOpenChange(isOpen);
  };

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
    
    // Save PIN
    if (setup) {
      saveGuardianSetup({ ...setup, parentPin: pin });
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
    if (pin === setup?.parentPin) {
      onOpenChange(false);
      setPin("");
      setError("");
      
      if (mode === 'setup-before-switch') {
        navigate('/learner', { state: { firstName: learnerName } });
      } else if (mode === 'verify-to-parent') {
        navigate('/guardian/manage');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  const handleForgotPin = async () => {
    if (!parentEmail) {
      toast({
        title: "No email on file",
        description: "Please contact support to reset your PIN.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an edge function to send email
    // For now, we'll show the PIN in a toast (for demo purposes)
    toast({
      title: "PIN Recovery",
      description: `A PIN reminder has been sent to ${parentEmail}. Check your email.`,
    });
    
    // For demo: show the actual PIN
    console.log("Demo: Parent PIN is:", setup?.parentPin);
    
    setStep('verify');
  };

  const handleClose = () => {
    onOpenChange(false);
    setPin("");
    setConfirmPin("");
    setStep(getInitialStep());
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                Before switching to {learnerName}'s account, create a 4-digit PIN so you can easily switch back to the Family Dashboard.
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
                This PIN will be required to access the Family Dashboard from {learnerName}'s account.
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
                {mode === 'setup-before-switch' 
                  ? `Enter your PIN to switch to ${learnerName}'s account.`
                  : "Enter your 4-digit PIN to access the Family Dashboard."
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
                onClick={() => setStep('forgot')}
                className="w-full text-muted-foreground"
              >
                Forgot your PIN?
              </Button>
            </div>
          </>
        )}

        {/* FORGOT STEP */}
        {step === 'forgot' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Reset Your PIN
              </DialogTitle>
              <DialogDescription>
                We'll send a PIN reminder to your email address on file.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                {parentEmail ? (
                  <p className="text-sm">
                    A PIN reminder will be sent to:<br />
                    <span className="font-medium">{parentEmail}</span>
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No email address on file. Please contact support.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('verify')} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleForgotPin}
                className="flex-1"
                disabled={!parentEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
