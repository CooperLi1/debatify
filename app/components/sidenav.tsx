'use client';
import { Bars3Icon, XMarkIcon, BookmarkIcon } from "@heroicons/react/24/outline";
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
            className="w-full flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
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
            {expanded && <span className="ms-3 whitespace-nowrap">Log&nbsp;out</span>}
          </button>
        </li>
      ) : (
        <li>
          <Link
            href="/account/login"
            className="w-full flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
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

function Search({ expanded }: { expanded: boolean }) {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/main";

  return (
    <li className="w-full">
      <button
        onClick={() => router.push("/main")} // Redirect on click
        className={`group w-full flex items-center p-2 rounded-lg transition duration-200 cursor-pointer 
          ${isActive ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400" 
                     : "text-gray-900 dark:text-white grouphover:bg-gray-100 dark:grouphover:bg-gray-700"}`}
      >
        <svg
          className={`shrink-0 w-6 h-6 transition duration-75 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
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
        {expanded && <span className="ms-3">Search</span>}
      </button>
    </li>
  );
};

function Bookmarks({ expanded }: { expanded: boolean }) {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/main/bookmarks";

  return (
    <li>
      <a
        onClick={() => router.push("/main/bookmarks")} // Redirect on click
        className={`flex items-center p-2 rounded-lg transition duration-200 cursor-pointer 
          ${isActive ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400" 
                     : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`}
      >
        <BookmarkIcon
          className={`shrink-0 w-6 h-6 transition duration-75 
            ${isActive ? "text-blue-600 dark:text-blue-400" 
                       : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
          aria-hidden="true"
        />
        {expanded &&  <span className="flex-1 ms-3 whitespace-nowrap">Bookmarks</span>}
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
  const [userData, setUserData] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false); // Tracks both initial hover and expanded state

  useEffect(() => {
    async function fetchUser() {
      const data = await getUser();
      setUserData(data);
    }

    fetchUser();
  }, []);

  const getEmailPrefix = (email: string) => email.split('@')[0];
  const prefix = userData ? getEmailPrefix(userData.user.email) : 'Guest';

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
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white border-r border-gray-700
        transition-all duration-300 ease-in-out relative
        ${isHovered ? 'w-64' : 'w-10'}
      `}
    >
    <ul className="space-y-2 font-medium pt-8 w-full">
        <SidebarItem
          icon={
            <svg
              className="shrink-0 w-6 h-6 text-gray-500 dark:text-gray-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c-4.97 0-9 2.014-9 4.5V20h18v-1.5c0-2.486-4.03-4.5-9-4.5z" />
            </svg>
          }
          label={prefix}
          expanded={isHovered}
        />

        <Search expanded={isHovered} />
        <Bookmarks expanded={isHovered} />
        <LogoutButton expanded={isHovered} />

      </ul>

      <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
        <SidebarItem
          icon={
            <svg
              className="shrink-0 w-6 h-6 text-gray-500 dark:text-gray-400"
              viewBox="0 0 17 20"
              fill="currentColor"
            >
                  <path d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z"/>
                  </svg>
          }
          label="Subscriptions"
          expanded={isHovered}
        />
        <SidebarItem
          icon={
            <svg
              className="shrink-0 w-6 h-6 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
                  <path d="m5.4 2.736 3.429 3.429A5.046 5.046 0 0 1 10.134 6c.356.01.71.06 1.056.147l3.41-3.412c.136-.133.287-.248.45-.344A9.889 9.889 0 0 0 10.269 1c-1.87-.041-3.713.44-5.322 1.392a2.3 2.3 0 0 1 .454.344Zm11.45 1.54-.126-.127a.5.5 0 0 0-.706 0l-2.932 2.932c.029.023.049.054.078.077.236.194.454.41.65.645.034.038.078.067.11.107l2.927-2.927a.5.5 0 0 0 0-.707Zm-2.931 9.81c-.024.03-.057.052-.081.082a4.963 4.963 0 0 1-.633.639c-.041.036-.072.083-.115.117l2.927 2.927a.5.5 0 0 0 .707 0l.127-.127a.5.5 0 0 0 0-.707l-2.932-2.931Zm-1.442-4.763a3.036 3.036 0 0 0-1.383-1.1l-.012-.007a2.955 2.955 0 0 0-1-.213H10a2.964 2.964 0 0 0-2.122.893c-.285.29-.509.634-.657 1.013l-.01.016a2.96 2.96 0 0 0-.21 1 2.99 2.99 0 0 0 .489 1.716c.009.014.022.026.032.04a3.04 3.04 0 0 0 1.384 1.1l.012.007c.318.129.657.2 1 .213.392.015.784-.05 1.15-.192.012-.005.02-.013.033-.018a3.011 3.011 0 0 0 1.676-1.7v-.007a2.89 2.89 0 0 0 0-2.207 2.868 2.868 0 0 0-.27-.515c-.007-.012-.02-.025-.03-.039Zm6.137-3.373a2.53 2.53 0 0 1-.35.447L14.84 9.823c.112.428.166.869.16 1.311-.01.356-.06.709-.147 1.054l3.413 3.412c.132.134.249.283.347.444A9.88 9.88 0 0 0 20 11.269a9.912 9.912 0 0 0-1.386-5.319ZM14.6 19.264l-3.421-3.421c-.385.1-.781.152-1.18.157h-.134c-.356-.01-.71-.06-1.056-.147l-3.41 3.412a2.503 2.503 0 0 1-.443.347A9.884 9.884 0 0 0 9.732 21H10a9.9 9.9 0 0 0 5.044-1.388 2.519 2.519 0 0 1-.444-.348ZM1.735 15.6l3.426-3.426a4.608 4.608 0 0 1-.013-2.367L1.735 6.4a2.507 2.507 0 0 1-.35-.447 9.889 9.889 0 0 0 0 10.1c.1-.164.217-.316.35-.453Zm5.101-.758a4.957 4.957 0 0 1-.651-.645c-.033-.038-.077-.067-.11-.107L3.15 17.017a.5.5 0 0 0 0 .707l.127.127a.5.5 0 0 0 .706 0l2.932-2.933c-.03-.018-.05-.053-.078-.076ZM6.08 7.914c.03-.037.07-.063.1-.1.183-.22.384-.423.6-.609.047-.04.082-.092.129-.13L3.983 4.149a.5.5 0 0 0-.707 0l-.127.127a.5.5 0 0 0 0 .707L6.08 7.914Z"/>
            </svg>
          }
          label="About&nbsp;Us"
          expanded={isHovered}
        />
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
      <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all gap-x-3">
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
