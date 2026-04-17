import { auth, signOut } from "@/auth";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  LogOut, 
  LayoutDashboard,
  CreditCard,
  Flower2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import "./globals.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-72 bg-white border-r border-brand-sage/10 flex flex-col shadow-[2px_0_10px_rgba(141,163,153,0.05)]">
            <div className="p-8 pb-10">
              <div className="flex items-center gap-3">
                <div className="bg-brand-sage/10 p-2.5 rounded-xl text-brand-sage">
                  <Flower2 size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-none">Bio-tiful</h1>
                  <span className="text-[10px] uppercase tracking-widest text-brand-sage font-bold">Natural Core ERP</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">General</div>
              <NavItem href="/" icon={<LayoutDashboard size={18} />} label="Overview" />
              
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-8 mb-4 px-2">Business</div>
              <NavItem href="/customers" icon={<Users size={18} />} label="CRM (Customers)" />
              <NavItem href="/products" icon={<Package size={18} />} label="Inventory" />
              <NavItem href="/orders" icon={<ShoppingCart size={18} />} label="Order Management" />
              <NavItem href="/payments" icon={<CreditCard size={18} />} label="Payments Ledger" />
            </nav>

            <div className="p-6 mt-auto">
              <div className="bg-brand-sage-light/50 p-4 rounded-2xl mb-6 border border-brand-sage/5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">User Active</p>
                </div>
                <p className="text-xs font-semibold text-gray-700 truncate">{session?.user?.email}</p>
              </div>

              <form action={async () => { "use server"; await signOut(); }}>
                <button className="flex items-center w-full px-4 py-3 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all font-medium group">
                  <LogOut size={18} className="mr-3 text-gray-400 group-hover:text-red-500 transition-colors" />
                  Sign Out
                </button>
              </form>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-[#fdfcfb] relative overflow-hidden flex flex-col">
            {/* Soft decorative gradients */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-sage/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-rose/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <header className="h-16 px-10 flex items-center justify-between border-b border-gray-100 bg-white/30 backdrop-blur-sm z-10 shrink-0">
              <div className="text-xs text-gray-400 font-medium">Dashboard / {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            </header>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-10 relative z-0">
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
      className="flex items-center justify-between px-4 py-3 text-[13px] font-semibold text-gray-500 rounded-xl hover:bg-brand-sage/5 hover:text-brand-sage-dark transition-all group"
    >
      <div className="flex items-center">
        <span className="mr-3.5 text-gray-400 group-hover:text-brand-sage transition-colors">{icon}</span>
        {label}
      </div>
      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-sage/40" />
    </Link>
  );
}
