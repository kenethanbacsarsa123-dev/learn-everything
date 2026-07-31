export default function StarfieldBackground() {
  return (
    <div className="starfield" aria-hidden="true">
      <div className="absolute left-[12%] top-[18%] h-1 w-1 rounded-full bg-amber animate-twinkle" />
      <div className="absolute left-[68%] top-[12%] h-1 w-1 rounded-full bg-teal animate-twinkle twinkle-delay-1" />
      <div className="absolute left-[82%] top-[62%] h-1.5 w-1.5 rounded-full bg-ink animate-twinkle twinkle-delay-2" />
      <div className="absolute left-[25%] top-[75%] h-1 w-1 rounded-full bg-teal animate-twinkle twinkle-delay-3" />
      <div className="absolute left-[45%] top-[40%] h-1 w-1 rounded-full bg-amber animate-twinkle twinkle-delay-2" />
    </div>
  );
}
