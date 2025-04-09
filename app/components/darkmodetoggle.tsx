"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

interface DarkModeToggleProps {
  setDarkMode: (value: boolean) => void;
}

const DarkModeToggle = ({ setDarkMode }: DarkModeToggleProps) => {
  const [darkMode, setDarkModeLocal] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkModeLocal(true);
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkModeLocal(newMode);
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-2 right-2 circlebutton"
    >
      {darkMode ? (
        <SunIcon className="w-6 h-6 text-white" />
      ) : (
        <MoonIcon className="w-6 h-6 text-gray-900 dark:text-white" />
      )}
    </button>
  );
};

export default DarkModeToggle;
