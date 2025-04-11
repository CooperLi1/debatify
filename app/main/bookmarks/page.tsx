'use client'
import { useState, useEffect, useRef } from 'react';

export default function Saved(){
    //Dropdown

      //Fonts
      const fonts = [
        { name: "Calibri", className: "calibri" },
        { name: "Arial", className: "arial" },
        { name: "Times New Roman", className: "times" },
      ];
      const [font, setFont] = useState("calibri");
        
        //Highlight Color

  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('saved');
      if(stored){
        console.log(JSON.parse(stored))
        setSaved(JSON.parse(stored));
      }
      else{
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

  //Copy to clipboard
  async function copy(str: string){
    await navigator.clipboard.writeText(str);
    alert("Copied!");
  }
  return ( 
    <div className="flex flex-col h-screen defaulttext relative px-5">
      <h1 className="text-center mt-8 text-3xl font-bold">Saved Evidence</h1>

      {/* Centered and relatively-sized divider */}
      <div className="self-center mt-3 w-1/5 h-1 bg-gray-800 dark:bg-white rounded-full opacity-80" />

      <div className="flex justify-end items-center gap-4">
        <select
          className="simpleform"
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
          <ul className="w-full max-w-screen-md">
            {saved.map((htmlString, index) => (
              <li key={index} className="relative bg-white dark:bg-gray-900 shadow-md rounded-md mb-4 px-5 py-4">
                <div
                  className="text-[12pt] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm"
                  dangerouslySetInnerHTML={{ __html: htmlString }}
                />
                <button
                  onClick={() =>
                    setSaved((prevSaved) =>
                      prevSaved.filter((item) => item !== htmlString)
                    )
                  }
                  className="absolute top-2 right-2 p-2 hover:cursor-pointer"
                >
                  <img src={"bookmark_fill.svg"} />
                </button>
                <button
                  className="absolute top-2 right-10 p-2 hover:cursor-pointer"
                  onClick={() => copy(htmlString)}
                >
                  <img src="copy.svg" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-semibold text-xl text-center">Nothing saved</p>
        )}
      </div>
    </div>
  );
}