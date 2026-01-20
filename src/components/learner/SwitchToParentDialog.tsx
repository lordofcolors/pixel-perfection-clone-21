import { ParentPinFlow } from "@/components/guardian/ParentPinFlow";

type SwitchToParentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SwitchToParentDialog({ open, onOpenChange }: SwitchToParentDialogProps) {
  return (
    <ParentPinFlow
      open={open}
      onOpenChange={onOpenChange}
      learnerName=""
      mode="verify-to-parent"
    />
  );
}