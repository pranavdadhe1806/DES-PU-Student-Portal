import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/campus_bg.png"
          alt="Campus Background"
          fill
          className="object-cover object-center opacity-40 dark:opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black/80 backdrop-blur-sm" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
