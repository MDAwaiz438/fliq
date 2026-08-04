import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: 'Login | Fliq',
  description: 'Log in to your Fliq account to view orders and manage your details.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-(--bg) flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-(--accent) text-(--bg) border-2 border-(--bg) p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">Welcome Back</h1>
        <p className="text-xs font-bold uppercase tracking-widest text-(--bg) mb-8">Enter your details to log in.</p>

        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest">Email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full border-2 border-(--bg) p-3 text-sm font-medium focus:outline-none focus:ring-0 focus:border-(--bg) bg-transparent" 
              placeholder="name@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest">Password</label>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-(--bg) hover:text-(--bg) hover:underline underline-offset-2">Forgot?</a>
            </div>
            <input 
              type="password" 
              id="password" 
              className="w-full border-2 border-(--bg) p-3 text-sm font-medium focus:outline-none focus:ring-0 focus:border-(--bg) bg-transparent" 
              placeholder="••••••••"
            />
          </div>

          <Button type="button" size="lg" className="w-full">Sign In</Button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-(--bg) text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-(--bg)">
            Don't have an account?{' '}
            <Link href="/register" className="text-(--bg) hover:underline underline-offset-4">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
