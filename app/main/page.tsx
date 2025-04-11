
'use client';
import { useState, useEffect, useRef, FormEvent } from "react";


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
  function extractTitle(str: string){
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = str;
    const h4Element = tempDiv.querySelector("h4") as HTMLElement;
    return h4Element?.innerText  || null;
  }

  function extractAuthor(str: string){
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = str;
    const strongElement = tempDiv.querySelector("strong") as HTMLElement;
    return strongElement?.innerText  || null;
  }

  const [results, setResults] = useState<string[]>([]);

    //Dropdown

      //Fonts
    const fonts = [
      { name: "Calibri", className: "calibri" },
      { name: "Arial", className: "arial" },
      { name: "Times New Roman", className: "times" },
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
      setLazyLoading(false)
      setLoading(true);
      setPage(1);
      const response = await fetch("http://127.0.0.1:5001/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ str }),
      });
      const data = await response.json();
      setResults(data.results);
      setLoading(false);
      checkScrollHeight();
    }

    //Lazy Loading
    const [lazyLoading, setLazyLoading] = useState(false);

      //Load more entries
     const [page, setPage] = useState<number>(1)

    async function fetchData(currentPage: number): Promise<void>{
      setLazyLoading(true);
      const response = await fetch("http://127.0.0.1:5001/load", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ currentPage, input }),
      });
      const data = await response.json();
      setResults(data.results);
      setLazyLoading(false);
      checkScrollHeight();
    }

    async function load(): Promise<void>{
      setPage((prevPage: number) => prevPage + 1);
    }
    
    useEffect(() => {
      if (page !== 1) {
        fetchData(page);
      }
    }, [page])


      //Track Scroll
    const [bottom, setBottom] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const checkScrollHeight = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        if (scrollHeight <= clientHeight) {
          load();
        }
      }
    };
  
    useEffect(() => {
       const handleScroll = () => {
        if (containerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
          const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
          if (atBottom && !bottom) {
            load();
          }
          setBottom(atBottom);
        }
      };
    
      const container = containerRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (container) {
          container.removeEventListener("scroll", handleScroll);
        }
      };
    }, []);
    
    //Save
    const [saved, setSaved] = useState<string[]>(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('saved');
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    });
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('saved', JSON.stringify(saved));
      }
    }, [saved]);

    function saver(result: string){
      if(saved.includes(result)){
        setSaved((prevSaved) => prevSaved.filter((item) => item !== result));
      }
      else{
        setSaved((prevSaved) => [...prevSaved, result]);
      }
    }

    //Copy to clipboard
    async function copy(str: string){
      await navigator.clipboard.writeText(str);
      alert("Copied!");
    }

    //UI
    return(
      //header
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
        

        {/* search */}
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


        <div
          ref={containerRef}
          className="relative w-3/10 mt-2 overflow-y-auto p-2 rounded-md"
          style={{ height: "calc(100vh - 210px)" }}
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {results.map((result, index) => (
                <div key={index} className="flex items-center">
                  <button
                    className="block w-full mb-2 text-left rounded-sm font-semibold ml-2 hover:bg-gray-200 p-2"
                    onClick={() => setShow(result)}
                  >
                    {extractTitle(result)}
                    <br />
                    {extractAuthor(result)}
                  </button>

                  <button
                    className="hover:cursor-pointer"
                    onClick={() => saver(result)}
                  >
                    <img
                      src={saved.includes(result) ? "bookmark_fill.svg" : "bookmark.svg"}
                    />
                  </button>
                </div>
              ))}
            </ul>
          )}
          {lazyLoading && <p className="text-center text-gray-600">Loading more results...</p>}
        </div>

        <div
          className={`relative mt-4 w-full max-w-[60%] p-4 rounded-md overflow-y-auto ${font}`}
          style={{ height: "calc(100vh - 210px)" }}
        >
          {show && (
            <div className="flex items-start">
              <div
                className={`bg-[${highlightColor}] text-[12pt]`}
                dangerouslySetInnerHTML={{ __html: modifiedHTML }}
              />
              <button
                className="flex-shrink-0 ml-4 hover:cursor-pointer"
                onClick={() => copy(show)}
              >
                <img src="copy.svg" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
};
