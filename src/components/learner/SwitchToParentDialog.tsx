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
import { Lock, ArrowLeft } from "lucide-react";

type SwitchToParentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SwitchToParentDialog({ open, onOpenChange }: SwitchToParentDialogProps) {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState("");
  
  const setup = getGuardianSetup();
  const hasPin = !!setup?.parentPin;

  const handleVerifyPin = () => {
    if (pin === setup?.parentPin) {
      onOpenChange(false);
      setPin("");
      setError("");
      navigate('/guardian/manage');
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  const handleSetPin = () => {
    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN.");
      return;
    }
    
    if (!isSettingPin) {
      setIsSettingPin(true);
      setConfirmPin(pin);
      setPin("");
      setError("");
      return;
    }
    
    if (pin !== confirmPin) {
      setError("PINs don't match. Please try again.");
      setPin("");
      setConfirmPin("");
      setIsSettingPin(false);
      return;
    }
    
    // Save PIN
    if (setup) {
      saveGuardianSetup({ ...setup, parentPin: pin });
    }
    
    onOpenChange(false);
    setPin("");
    setConfirmPin("");
    setIsSettingPin(false);
    setError("");
    navigate('/guardian/manage');
  };

  const handleClose = () => {
    onOpenChange(false);
    setPin("");
    setConfirmPin("");
    setIsSettingPin(false);
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {hasPin ? "Enter Parent PIN" : "Set Parent PIN"}
          </DialogTitle>
          <DialogDescription>
            {hasPin 
              ? "Enter your 4-digit PIN to access the Family Dashboard."
              : isSettingPin
                ? "Confirm your 4-digit PIN."
                : "Create a 4-digit PIN to protect the Family Dashboard."
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
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={hasPin ? handleVerifyPin : handleSetPin}
            className="flex-1"
            disabled={pin.length !== 4}
          >
            {hasPin ? "Unlock" : isSettingPin ? "Confirm PIN" : "Set PIN"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
