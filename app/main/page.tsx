'use client';
import { useState, useEffect, FormEvent } from "react";
import { createClient } from '@/utils/supabase/client'
import { FiCopy, FiBookmark } from "react-icons/fi"; // Add this at the top
const supabase = createClient()


//bookmarks
async function saveBookmark(content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('bookmarks').insert([
    {
      user_id: user.id,
      content: content
    }
  ]);
}

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState<string | null>(null);

  //Search Bar
  const [input, setInput] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    searchData(input)
  }

  //Display data titles
  const [results, setResults] = useState<{ tag: string; markdown: string; citation: string }[]>([]);

    //Dropdown

      //Fonts
      const fonts = [
        { name: "Calibri", className: "calibri" },
        { name: "Arial", className: "arial" },
        { name: "Times New Roman", className: "times" },
        { name: "Comic Sans", className: "comic" }
      ];
    const [font, setFont] = useState("calibri");
    const [highlightColor, setHighlightColor] = useState("#fdff00");
    const [modifiedHTML, setModifiedHTML] = useState("");
      
      //Highlight Color
    const updateHighlightedHTML = () => {
      if (!show) return "";
      const updatedHTML = show.replace(
        /<mark>(.*?)<\/mark>/g,
        `<span style="background-color: ${highlightColor}; padding: 2px;">$1</span>`
      );
      setModifiedHTML(updatedHTML);
    };
      useEffect(() => {
        updateHighlightedHTML();
      }, [highlightColor, show]);
    
    //Search Function
    async function searchData(str: string){
      setLoading(true);
      const response = await fetch("https://54.152.114.111/search?q=" + str, {
        method: "GET",
      });
      const data = await response.json();
      setResults(data);
      setLoading(false);
    }

    //UI
    return(
        <div>
        <div className="relative flex flex-col mt-5 ml-5 mr-5 defaulttext">
        <div className="flex justify-between items-center">
          <div className = 'flex-col'>
          <h1 className="text-3xl font-semibold mb-3">Find Evidence!</h1>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <select
              className="simpleform"
              onChange={(e) => setHighlightColor(e.target.value)}
            >
              <option value="#fdff00">Yellow</option>
              <option value="#00ffff">Cyan</option>
              <option value="#00ff00">Green</option>
            </select>

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
        </div>

        <form onSubmit={handleSubmit} className="flex-col flex w-3/10 mb-3">
          <div className="mb-5 w-full h-1 bg-gray-800 dark:bg-white rounded-full opacity-80" />
          <div className='flex'>

          <input
            type="text"
            placeholder="Search..."
            value={input}
            className="w-full simpleform hover:scale-102"  
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="ml-2 simpleform">Submit</button>
          </div>
        </form>

      <div className= "w-3/10 mt-2 overflow-y-auto p-2 rounded-md" style={{ height: "calc(100vh - 210px)" }}>
        {loading ? (<p>Loading...</p>):
          <ul>
          {results.map((result: { tag: string; markdown: string; citation: string }, index) => (
            <div key={index} className="flex items-center">
              <button
                key={index}
                className="block w-full mb-2 text-left rounded-sm font-semibold ml-2 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 cursor-pointer"
                onClick={() => setShow(result.tag+"<br />"+result.citation+result.markdown+"<br />")}
            >
            <div dangerouslySetInnerHTML={{ __html: result.tag }} />
            <div dangerouslySetInnerHTML={{ __html: result.citation }} />
            </button>
        </div>
        ))}
        </ul>
        }
      </div>

      <div 
        className={`absolute top-20 right-8 w-62/100 p-4 rounded-md overflow-y-auto ${show != null ? 'dark:bg-gray-100' : 'dark:bg-gray-900'} text-black reset-injected-html ${font}`} 
        style={{ height: "calc(100vh - 150px)" }}      
      >
        {show && (
          <div className="relative flex items-start reset-injected-html">

          {/* Copy Button */}
          <button
            onClick={() => {
              const type = "text/html";
              const blob = new Blob([modifiedHTML], { type });
              const data = [new ClipboardItem({ [type]: blob })];
              navigator.clipboard.write(data);
            }}
            className="absolute top-0 right-0 text-lg text-gray-600 hover:text-gray-300 p-1 cursor-pointer"
            title="Copy to clipboard"
          >
            <FiCopy size={20} />
          </button>

          <button
            onClick={() => {
              saveBookmark(modifiedHTML);
            }}
            className="absolute top-0 right-10 text-lg text-gray-600 hover:text-gray-300 p-1 cursor-pointer"
            title="Bookmark"
          >
            <FiBookmark size={20} />
          </button>

          <div
            className={`bg-${highlightColor} text-[12pt] w-full p-7 `}
            dangerouslySetInnerHTML={{ __html: modifiedHTML }}
          />
        </div>
          )}
      </div>
    </div>
    </div>
    );
};