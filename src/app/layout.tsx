import { auth, signOut } from "@/auth";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  LogOut, 
  LayoutDashboard,
  Settings,
  CreditCard
} from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-600">Bio-tiful ERP</h1>
          <p className="text-xs text-gray-500 mt-1">Logged in as: {session?.user?.email}</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem href="/customers" icon={<Users size={20} />} label="CRM (Customers)" />
          <NavItem href="/products" icon={<Package size={20} />} label="Inventory" />
          <NavItem href="/orders" icon={<ShoppingCart size={20} />} label="Orders" />
          <NavItem href="/payments" icon={<CreditCard size={20} />} label="Payments Ledger" />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">
              <LogOut size={20} className="mr-3" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
}
