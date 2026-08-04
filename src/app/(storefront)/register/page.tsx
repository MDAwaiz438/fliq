import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: 'Register | Fliq',
  description: 'Create a Fliq account for faster checkout and exclusive access.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-(--bg) flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-md bg-(--accent) text-(--bg) border-2 border-(--bg) p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">Create Account</h1>
        <p className="text-xs font-bold uppercase tracking-widest text-(--bg) mb-8">Join Fliq for exclusive drops.</p>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-xs font-black uppercase tracking-widest">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                className="w-full border-2 border-(--bg) p-3 text-sm font-medium focus:outline-none focus:ring-0 focus:border-(--bg) bg-transparent" 
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-xs font-black uppercase tracking-widest">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                className="w-full border-2 border-(--bg) p-3 text-sm font-medium focus:outline-none focus:ring-0 focus:border-(--bg) bg-transparent" 
                placeholder="Doe"
              />
            </div>
          </div>

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
            <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              id="password" 
              className="w-full border-2 border-(--bg) p-3 text-sm font-medium focus:outline-none focus:ring-0 focus:border-(--bg) bg-transparent" 
              placeholder="••••••••"
            />
          </div>

          <Button type="button" size="lg" className="w-full">Create Account</Button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-(--bg) text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-(--bg)">
            Already have an account?{' '}
            <Link href="/login" className="text-(--bg) hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
