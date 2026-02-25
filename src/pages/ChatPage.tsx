import { useRive } from "@rive-app/react-canvas";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName, role } = (location.state as { firstName?: string; role?: string }) || {};

  const { RiveComponent } = useRive({
    src: "/animations/robocat.riv",
    autoplay: true,
  });

  return (
    <main className="w-screen h-screen bg-background flex flex-col items-center justify-center relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      {firstName && (
        <p className="absolute top-6 text-sm text-muted-foreground">
          Hi, <span className="text-foreground font-medium">{firstName}</span>
        </p>
      )}

      <div className="w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
        <RiveComponent />
      </div>
    </main>
  );
};

export default ChatPage;
