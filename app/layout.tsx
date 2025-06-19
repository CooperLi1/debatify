'use client'
import { manrope } from '@/app/ui/fonts'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import DarkModeToggle from "@/app/components/darkmodetoggle";
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/'

  // Define dynamic titles based on the current route
  const getPageTitle = (path: string) => {
    const titles: { [key: string]: string } = {
      '/main': 'Search | Debatify',
      '/main/account': 'Account | Debatify',
      '/main/bookmarks': 'Bookmarks | Debatify',
      '/main/block': 'No Access | Debatify',
      '/main/contact-us': 'Contact Us | Debatify',
      '/main/pricing': 'Paid Plans | Debatify',
      '/main/ai': 'AI Search | Debatify',
      '/account/error': 'Error | Debatify',
      '/account/login': 'Login | Debatify',
      '/account/reset': 'Password | Debatify'
    }
    return titles[path] || 'Debatify'
  }

  const [title, setTitle] = useState(getPageTitle(pathname))

  useEffect(() => {
    setTitle(getPageTitle(pathname))
    document.title = getPageTitle(pathname)
  }, [pathname])

  const [darkMode, setDarkMode] = useState<boolean>(false); // Dark mode state

  useEffect(() => {
    // Check the saved theme in localStorage and set darkMode state
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      // Default to light mode if no theme is saved
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    // Update the class on document element when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save the theme preference to localStorage
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    // Log to see if dark mode changes
    console.log("Dark Mode:", darkMode ? "Enabled" : "Disabled");
  }, [darkMode]); // Run when darkMode changes

  return (
    <html lang="en">
          <Head>
            {/* Dynamic Title */}
            <title>{title}</title>
            <meta name="description" content="Search for debate cut cards!" />\

            <link rel="icon" href="/debatifyfavi.ico" />
            <link rel="shortcut icon" href="/debatifyfavi16.png" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          </Head>
      <body className={`${manrope.className } antialiased bg-gray-50 dark:bg-gray-900`}>
          {children}
          <DarkModeToggle setDarkMode={setDarkMode} />
      </body>
    </html>
  )
}