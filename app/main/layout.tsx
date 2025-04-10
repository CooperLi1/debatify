"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { SideNav } from "../components/sidenav";
import { useState, useEffect } from "react";
import {motion, AnimatePresence} from 'framer-motion';
import { usePathname } from 'next/navigation'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const pathname = usePathname(); 

  return (
    <ClerkProvider>
      <div className="min-h-screen transition-all text-gray-900 dark:text-white">
        <main className="flex min-h-screen">
          {/* Sidebar */}
          <div
            className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0"} dark:bg-gray-800 dark:text-white`}
          >
            <SideNav
              isOpen={isSidebarOpen}
              toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
            />
          </div>

          {/* Main Content */}
          <div
            className={`flex-1 flex flex-col p-9 transition-all duration-300 ${
              isSidebarOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname} // Triggers re-render when route changes
                initial={{ opacity: 0, x: -20 }} // Start offscreen left
                animate={{ opacity: 1, x: 0 }} // Animate into position
                exit={{ opacity: 0, x: 20 }} // Exit smoothly
                transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition
                className="absolute inset-0"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
          </div>
        </main>

      </div>
    </ClerkProvider>
  );
}
