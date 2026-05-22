import Image from "next/image";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="w-full flex flex-col-reverse md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white/70 dark:bg-zinc-950/60 backdrop-blur-2xl ring-1 ring-white/20 dark:ring-white/10 max-w-5xl mx-auto min-h-[600px]">
      
      {/* Left Panel - Sign-Up Form */}
      <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white dark:bg-zinc-950">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8">Sign-Up</h2>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Enter Username</label>
              <input 
                type="text" 
                placeholder="johndoe"
                className="w-full rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-blue-500/20 px-4 py-3.5 text-zinc-900 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Enter DES PU Mail ID</label>
              <input 
                type="text" 
                placeholder="you@despuniversity.edu.in"
                className="w-full rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-blue-500/20 px-4 py-3.5 text-zinc-900 dark:text-white outline-none transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Create a new password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-blue-500/20 px-4 py-3.5 text-zinc-900 dark:text-white outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Re-Enter password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-blue-500/20 px-4 py-3.5 text-zinc-900 dark:text-white outline-none transition-all"
              />
            </div>

            <button className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all duration-200 mt-4 flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Sign-Up
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <button type="button" className="w-full rounded-xl bg-white dark:bg-zinc-900 px-6 py-3 font-semibold text-zinc-900 dark:text-white shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 flex justify-center items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel - Branding & Welcome */}
      <div className="w-full md:w-1/2 p-10 flex flex-col items-center justify-between bg-gradient-to-br from-white/60 to-white/30 dark:from-zinc-900/60 dark:to-zinc-900/30">
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="p-4 bg-white dark:bg-white rounded-2xl shadow-xl shadow-black/5 ring-1 ring-black/5">
            <Image src="/logo.png" alt="DES PU Logo" width={80} height={80} className="object-contain" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-4">Hello, Student!</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-xs leading-relaxed">
            Please create your account with the given details to continue
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 mt-12 mb-8">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Already have an account?</p>
          <Link href="/login" className="w-full sm:w-64">
            <button className="w-full rounded-xl bg-white dark:bg-zinc-800 px-6 py-3 font-semibold text-zinc-900 dark:text-white shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-200">
              Sign-In
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
