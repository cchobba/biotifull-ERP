import { auth, signOut } from "@/auth";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  LogOut, 
  LayoutDashboard,
  CreditCard,
  Leaf,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import "./globals.css";
import { MobileNav } from "@/components/mobile-nav";
import { Manrope, Inter } from 'next/font/google';

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-display',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-functional',
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const navItems = [
    { href: "/", icon: <LayoutDashboard size={18} />, label: "Intelligence" },
    { href: "/customers", icon: <Users size={18} />, label: "Community" },
    { href: "/products", icon: <Package size={18} />, label: "Collection" },
    { href: "/orders", icon: <ShoppingCart size={18} />, label: "Journal" },
    { href: "/payments", icon: <CreditCard size={18} />, label: "Ledger" },
  ];

  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="antialiased font-functional bg-surface">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar Navigation Rail - Atmospheric Layering */}
          <aside className="hidden lg:flex w-72 bg-surface-container-highest flex-col shrink-0 z-20">
            <div className="p-10">
              <div className="flex items-center gap-4">
                <div className="bg-primary p-3 rounded-2xl text-on-primary rotate-3 shadow-lg shadow-primary/20">
                  <Leaf size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-display font-extrabold tracking-tighter text-on-surface leading-none">Biotiful</h1>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-black opacity-80">The Ledger</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-8 py-4 space-y-2 overflow-y-auto">
              <div className="label-sm-editorial mb-6 px-4 opacity-40">System Core</div>
              {navItems.map((item) => (
                <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
              ))}
            </nav>

            <div className="p-8">
              <div className="bg-surface-container-low p-6 rounded-[2rem] mb-8 border border-white/20">
                <p className="label-sm-editorial mb-2 opacity-50">Active Auditor</p>
                <p className="text-sm font-bold text-on-surface truncate">{session?.user?.email?.split('@')[0]}</p>
              </div>

              <form action={async () => { "use server"; await signOut(); }}>
                <button className="flex items-center w-full px-6 py-4 text-sm font-bold text-on-surface-variant hover:text-tertiary hover:bg-tertiary-container/30 rounded-2xl transition-all group">
                  <LogOut size={18} className="mr-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  Close Session
                </button>
              </form>
            </div>
          </aside>

          {/* Main Content Area - Light Refraction Principles */}
          <main className="flex-1 relative overflow-hidden flex flex-col w-full bg-surface">
            {/* Ambient gradients instead of shadows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[150px] pointer-events-none"></div>
            
            {/* Mobile Header - Glassmorphism */}
            <header className="lg:hidden h-20 px-8 flex items-center justify-between border-b border-surface-container-high bg-surface/80 backdrop-blur-xl z-30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-xl text-on-primary">
                  <Leaf size={18} strokeWidth={2.5} />
                </div>
                <span className="font-display font-black text-on-surface tracking-tighter">Biotiful</span>
              </div>
              <MobileNav navItems={navItems} userEmail={session?.user?.email} />
            </header>

            {/* Desktop Top Bar - Minimalist Editorial */}
            <header className="hidden lg:flex h-24 px-12 items-center justify-between z-10 shrink-0">
              <div className="label-sm-editorial opacity-40">
                System / {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-white/50 flex items-center justify-center text-xs font-black text-primary">
                  {session?.user?.email?.[0].toUpperCase()}
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 md:px-12 pb-12 relative z-0">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-6 py-4 text-sm font-bold text-on-surface-variant rounded-[1.25rem] hover:bg-surface-container-low hover:text-primary transition-all group"
    >
      <div className="flex items-center">
        <span className="mr-4 opacity-30 group-hover:opacity-100 transition-opacity group-hover:scale-110 transition-transform">{icon}</span>
        {label}
      </div>
      <ChevronRight size={14} className="opacity-0 group-hover:opacity-30 transition-all -translate-x-2 group-hover:translate-x-0" />
    </Link>
  );
}
