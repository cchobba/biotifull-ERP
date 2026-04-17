"use client";

import { useState } from "react";
import { Menu, X, LogOut, Flower2 } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function MobileNav({ 
  navItems, 
  userEmail 
}: { 
  navItems: { href: string; icon: React.ReactNode; label: string }[];
  userEmail?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Flower2 size={24} className="text-brand-sage" />
              <span className="font-bold text-gray-800 tracking-tight">Bio-tiful</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-semibold text-gray-600 rounded-xl hover:bg-brand-sage/5 hover:text-brand-sage transition-all"
              >
                <span className="mr-3.5 text-gray-400">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-50">
            <div className="bg-brand-sage-light/50 p-4 rounded-2xl mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Active User</p>
              <p className="text-xs font-semibold text-gray-700 truncate">{userEmail}</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all group"
            >
              <LogOut size={18} className="mr-3 text-gray-400 group-hover:text-red-500 transition-colors" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
