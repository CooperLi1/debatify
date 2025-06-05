'use client';
import { Bars3Icon, XMarkIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { FaBrain } from 'react-icons/fa';
import { usePathname, useRouter } from "next/navigation";
import {logout} from '@/app/account/logout/actions'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState, useRef } from 'react'
import useMousePosition from './mousepos'
import Link from 'next/link';

interface SideNavProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}
interface ChildComponentProps {
  sendDataToParent: (data: boolean) => void;
}

function LogoutButton({ expanded }: { expanded: boolean }) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await getUser();
      setUserData(data);
    }

    fetchUser();
  }, []);

  return (
    <>
      {userData ? (
        <li>
          <button
            className="w-full flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
            onClick={logout}
          >
            <svg
              className="shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17 2h5v20h-5v-2h3V4h-3V2ZM15 12v-2H5V7l-5 5 5 5v-3h10Z" />
            </svg>
            {expanded && <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white ms-3 whitespace-nowrap">Log&nbsp;out</span>}
          </button>
        </li>
      ) : (
        <li>
          <Link
            href="/account/login"
            className="w-full flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
          >
            <svg
              className="shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M10 2H3c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h7v-2H4V4h6V2zm4 5v3H8v4h6v3l5-5-5-5z" />
            </svg>
            {expanded && <span className="ms-3 whitespace-nowrap">Log&nbsp;in</span>}
          </Link>
        </li>
      )}
    </>
  );
}


function User({ expanded }: { expanded: boolean }) {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/main/account";

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await getUser();
      setUserData(data);
    }

    fetchUser();
  }, []);

  const getEmailPrefix = (email: string) => email.split('@')[0];
  const truncateEmail = (email: string, maxLength: number) => {
    // Check if the email length exceeds maxLength minus the length of ellipses
    if (email.length > maxLength - 3) {
      return email.substring(0, maxLength - 3) + '...'; // Truncate and add ellipses
    }
    return email; // If email is short enough, return it as is
  };
  
  const prefix = userData
    ? truncateEmail(getEmailPrefix(userData.user.email), 18) // Set max length to 20 characters
    : 'Guest';
  
  return (
    <li className="w-full group">
      <button
        onClick={() => router.push("/main/account")}
        className={`w-full flex items-center p-2 rounded-lg transition duration-200 cursor-pointer
          ${isActive
            ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"}`}
      >
        <svg
          className={`shrink-0 w-6 h-6 transition-colors
            ${isActive ? "text-blue-600 dark:text-blue-400" : "group-hover:text-gray-900 dark:group-hover:text-white"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c-4.97 0-9 2.014-9 4.5V20h18v-1.5c0-2.486-4.03-4.5-9-4.5z" />
        </svg>
        {expanded && (
          <span
            className={`ms-3 transition-colors
              ${isActive ? "text-blue-600 dark:text-blue-400" : "group-hover:text-gray-900 dark:group-hover:text-white"}`}
          >
            {prefix}
          </span>
        )}
      </button>
    </li>
  );
};

function Search({ expanded }: { expanded: boolean }) {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/main";

  return (
    <li className="w-full group">
      <button
        onClick={() => router.push("/main")}
        className={`w-full flex items-center p-2 rounded-lg transition duration-200 cursor-pointer 
          ${isActive
            ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"}`}
      >
        <svg
          className={`shrink-0 w-6 h-6 transition duration-75 
            ${isActive 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6 6a7.5 7.5 0 0 0 10.65 10.65z"
          />
        </svg>
        {expanded && (
          <span
            className={`ms-3 transition-colors 
              ${isActive 
                ? "text-blue-600 dark:text-blue-400" 
                : "group-hover:text-gray-900 dark:group-hover:text-white"}`}
          >
            Search
          </span>
        )}
      </button>
    </li>
  );
};

function AI({ expanded }: { expanded: boolean }) {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/main/ai";

  return (
    <li className="w-full group">
      <button
        onClick={() => router.push("/main/ai")}
        className={`w-full flex items-center p-2 rounded-lg transition duration-200 cursor-pointer 
          ${isActive
            ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"}`}
      >
        <FaBrain
          className={`shrink-0 w-6 h-6 transition duration-75 ${
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          }`}
        />

        {expanded && (
          <div className="ms-3 inline-flex whitespace-nowrap items-center transition-colors">
            <span
              className={`transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "group-hover:text-gray-900 dark:group-hover:text-white"
              }`}
            >
              DebatifyAI
            </span>
            <span className="inline-flex items-center justify-center px-2 ms-4 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
              Pro
            </span>
          </div>
        )}
      </button>
    </li>
  );
};


function Subscriptions({ expanded }: { expanded: boolean }) {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/main/pricing";

  return (
<li className="w-full group">
  <button
    onClick={() => router.push("/main/pricing")}
    className={`w-full flex items-center p-2 rounded-lg transition duration-200 cursor-pointer 
      ${isActive
        ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
        : "text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"}`}
  >
    <svg
      className={`shrink-0 w-6 h-6 transition-colors 
        ${isActive 
          ? "text-blue-600 dark:text-blue-400" 
          : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
      viewBox="0 0 17 20"
      fill="currentColor"
    >
      <path d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z" />
    </svg>

    {expanded && (
      <span
        className={`ms-3 transition-colors
          ${isActive 
            ? "text-blue-600 dark:text-blue-400"
            : "group-hover:text-gray-900 dark:group-hover:text-white"}`}
      >
        Paid&nbsp;Plans
      </span>
    )}
  </button>
</li>
  );
};

function Bookmarks({ expanded }: { expanded: boolean }) {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/main/bookmarks";

  return (
    <li className="group w-full">
      <a
        onClick={() => router.push("/main/bookmarks")}
        className={`flex items-center p-2 rounded-lg transition duration-200 cursor-pointer 
          ${isActive
            ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"}`}
      >
        <BookmarkIcon
          className={`shrink-0 w-6 h-6 transition-colors 
            ${isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
          aria-hidden="true"
        />
        {expanded && (
          <span
            className={`flex-1 ms-3 whitespace-nowrap transition-colors 
              ${isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
          >
            Bookmarks
          </span>
        )}
      </a>
    </li>
  );
};

async function getUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    // Handle error if necessary
    console.error(error);
    return null;
  }

  return data;
}

const SideNav: React.FC<ChildComponentProps> = ({ sendDataToParent }) => {
  const [isHovered, setIsHovered] = useState(false); // Tracks both initial hover and expanded state

  const mousePosition = useMousePosition();

  // useEffect(() => {
  //   if (mousePosition.x > 250) {
  //     setIsHovered(false);
  //   }
  // }, [mousePosition.x]);
  
  useEffect(() => {
    sendDataToParent(isHovered);
  }, [mousePosition.x]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-white
        transition-all duration-300 ease-in-out relative
        ${isHovered ? 'w-64' : 'w-10'}
      `}
    >
    <ul className="space-y-2 font-medium pt-8 w-full">
        <User expanded={isHovered}/>
        <Search expanded={isHovered} />
        <Bookmarks expanded={isHovered} />
        <AI expanded={isHovered} />
        <LogoutButton expanded={isHovered} />
      </ul>

      <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
      <Subscriptions expanded={isHovered} />
      </ul>
    </div>
    
  );
}

export default SideNav;

function SidebarItem({
  icon,
  label,
  expanded,
}: {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
}) {
  return (
    <li>
      <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all gap-x-3">
        {icon}
        <span
          className={`transition-opacity duration-200 ${
            expanded ? 'block opacity-100' : 'hidden opacity-0'
          }`}
        >
          {label}
        </span>
      </a>
    </li>
  );
}
