import acircleLogo from "@/assets/acircle-logo.png";

export function LandingBackground() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-none select-none">
      {/* Logo */}
      <div className="w-[140px] h-[140px] mb-10 opacity-60">
        <img
          src={acircleLogo}
          alt=""
          className="w-full h-full rounded-full"
        />
      </div>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl text-primary text-center leading-relaxed mb-1 opacity-40">
        Hi, I'm A, your new learning companion!
      </h2>
      <h3 className="text-2xl md:text-3xl text-foreground text-center leading-relaxed opacity-30">
        What skill would you like to learn today?
      </h3>
    </div>
  );
}
