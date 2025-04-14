'use client'
import { useState, useEffect, useRef } from 'react';

export default function Saved() {
  // Fonts
  const fonts = [
    { name: "Calibri", className: "calibri" },
    { name: "Arial", className: "arial" },
    { name: "Times New Roman", className: "times" },
  ];
  const [font, setFont] = useState("calibri");

  // Highlight Color
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('saved');
      if (stored) {
        console.log(JSON.parse(stored));
        setSaved(JSON.parse(stored));
      } else {
        setSaved([]);
      }
    }
  }, []);

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isInitialRender.current) {
        isInitialRender.current = false;
        return;
      }
      localStorage.setItem('saved', JSON.stringify(saved));
    }
  }, [saved]);

  // Copy to clipboard
  async function copy(str: string) {
    await navigator.clipboard.writeText(str);
    alert("Copied!");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 defaulttext relative px-5 py-8">
      <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Saved Evidence
      </h1>

      {/* Divider */}
      <div className="self-center mb-6 w-1/5 h-1 bg-gray-800 dark:bg-white rounded-full opacity-80" />

      {/* Font Dropdown */}
      <div className="flex justify-end items-center gap-4 mb-8">
        <select
          className="simpleform w-36"
          onChange={(e) => setFont(e.target.value)}
          value={font}
        >
          {fonts.map((font) => (
            <option key={font.name} value={font.className}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className={`flex flex-col items-center ${font}`}>
        {saved && saved.length > 0 ? (
          <ul className="w-full max-w-screen-md space-y-4">
            {saved.map((htmlString, index) => (
              <li
                key={index}
                className="relative bg-white dark:bg-gray-800 shadow-md rounded-md p-4 transition-transform transform hover:scale-105"
              >
                <div
                  className="text-[12pt] text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm p-2"
                  dangerouslySetInnerHTML={{ __html: htmlString }}
                />
                <button
                  onClick={() =>
                    setSaved((prevSaved) =>
                      prevSaved.filter((item) => item !== htmlString)
                    )
                  }
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 focus:outline-none"
                >
                  <img src={"bookmark_fill.svg"} alt="Delete" />
                </button>
                <button
                  className="absolute top-2 right-10 p-2 rounded-full bg-green-600 text-white hover:bg-green-700 focus:outline-none"
                  onClick={() => copy(htmlString)}
                >
                  <img src="copy.svg" alt="Copy" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-semibold text-xl text-center text-gray-600 dark:text-gray-300">
            Nothing saved
          </p>
        )}
      </div>
    </div>
  );
}
