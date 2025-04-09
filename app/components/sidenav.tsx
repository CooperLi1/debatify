'use client';
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";


interface SideNavProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function LogoutButton() {
  return (
    <li>
      <SignOutButton>
        <a
          href="#"
          className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <svg
            className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17 2h5v20h-5v-2h3V4h-3V2ZM15 12v-2H5V7l-5 5 5 5v-3h10Z" />
          </svg>
          <span className="ms-3">Log Out</span>
        </a>
      </SignOutButton>
    </li>
  );
}
export function SideNav({ isOpen, toggleSidebar }: SideNavProps) {
  return (
    <div>
      {/* Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-2 left-2 z-50 circlebutton"
      >
        {!isOpen ? (
          <Bars3Icon className="w-6 h-6 text-gray-900 dark:text-white" />
        ) : (
          <XMarkIcon className="w-6 h-6 text-gray-900 dark:text-white" />
        )}
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg">
          <Bar />
        </div>
      )}
    </div>
  );
}

const Summary = () => {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/dashboard";

  return (
    <li>
      <a
        onClick={() => router.push("/dashboard")} // Redirect on click
        className={`flex items-center p-2 rounded-lg transition duration-200 cursor-pointer 
          ${isActive ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400" 
                     : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`}
      >
        <svg
          className={`w-5 h-5 transition duration-75 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
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
        <span className="ms-3">Summary</span>
      </a>
    </li>
  );
};

const Visualize = () => {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/dashboard/visualize";

  return (
    <li>
      <a
        onClick={() => router.push("/dashboard/visualize")} // Redirect on click
        className={`flex items-center p-2 rounded-lg transition duration-200 cursor-pointer 
          ${isActive ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400" 
                     : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`}
      >
        <svg
          className={`shrink-0 w-5 h-5 transition duration-75 
            ${isActive ? "text-blue-600 dark:text-blue-400" 
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
            d="M12 4.5c-5.31 0-9.69 3.43-11 8a11.12 11.12 0 0022 0c-1.31-4.57-5.69-8-11-8z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="flex-1 ms-3 whitespace-nowrap">Visualize</span>
      </a>
    </li>
  );
};

const Compare = () => {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/dashboard/compare";

  return (
    <li>
      <a
        onClick={() => router.push("/dashboard/compare")} // Redirect on click
        className={`flex items-center p-2 rounded-lg transition duration-200 cursor-pointer 
          ${isActive ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400" 
                     : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`}
      >
        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Compare</span>
              {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
              </a>
    </li>
  );
};

const Chat = () => {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // Handle navigation

  const isActive = pathname === "/dashboard/chat";

  return (
    <li>
      <a
        onClick={() => router.push("/dashboard/chat")} // Redirect on click
        className={`flex items-center p-2 rounded-lg transition duration-200 cursor-pointer 
          ${isActive ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400" 
                     : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`}
      >              <svg
                className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
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
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.99 9.99 0 0 1-4-0.8l-4.8 2 .8-4.8a9.99 9.99 0 0 1-1.2-4c0-4.97 4.03-9 9-9s9 4.03 9 9z"
                />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Chat</span>
              <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Beta</span>
            </a>
          </li>
  );
};

export function Bar() {
  const { user } = useUser();

  return (
      <aside
        id="separator-sidebar"
        className="h-full px-3 py-6 overflow-y-auto bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        aria-label="Sidebar">
        <ul className="space-y-2 font-medium pt-8">
          <li>
              <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group">
                  <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400" 
                      aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c-4.97 0-9 2.014-9 4.5V20h18v-1.5c0-2.486-4.03-4.5-9-4.5z"/>
                  </svg>
                  <span className="ms-3">{user?.firstName || "Guest"}</span>
              </a>
          </li>
          <Summary/>
          <Visualize/>
          <Compare/>
          <Chat/>
          <LogoutButton/>
      </ul>
      <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
          {/* <li>
              <a href="#" className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
              <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 17 20">
                  <path d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z"/>
              </svg>
              <span className="ms-3">Upgrade to Pro</span>
              </a>
          </li>
          <li>
              <a href="#" className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
              <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                  <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z"/>
              </svg>
              <span className="ms-3">Documentation</span>
              </a>
          </li>
          <li>
              <a href="#" className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
              <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                  <path d="m5.4 2.736 3.429 3.429A5.046 5.046 0 0 1 10.134 6c.356.01.71.06 1.056.147l3.41-3.412c.136-.133.287-.248.45-.344A9.889 9.889 0 0 0 10.269 1c-1.87-.041-3.713.44-5.322 1.392a2.3 2.3 0 0 1 .454.344Zm11.45 1.54-.126-.127a.5.5 0 0 0-.706 0l-2.932 2.932c.029.023.049.054.078.077.236.194.454.41.65.645.034.038.078.067.11.107l2.927-2.927a.5.5 0 0 0 0-.707Zm-2.931 9.81c-.024.03-.057.052-.081.082a4.963 4.963 0 0 1-.633.639c-.041.036-.072.083-.115.117l2.927 2.927a.5.5 0 0 0 .707 0l.127-.127a.5.5 0 0 0 0-.707l-2.932-2.931Zm-1.442-4.763a3.036 3.036 0 0 0-1.383-1.1l-.012-.007a2.955 2.955 0 0 0-1-.213H10a2.964 2.964 0 0 0-2.122.893c-.285.29-.509.634-.657 1.013l-.01.016a2.96 2.96 0 0 0-.21 1 2.99 2.99 0 0 0 .489 1.716c.009.014.022.026.032.04a3.04 3.04 0 0 0 1.384 1.1l.012.007c.318.129.657.2 1 .213.392.015.784-.05 1.15-.192.012-.005.02-.013.033-.018a3.011 3.011 0 0 0 1.676-1.7v-.007a2.89 2.89 0 0 0 0-2.207 2.868 2.868 0 0 0-.27-.515c-.007-.012-.02-.025-.03-.039Zm6.137-3.373a2.53 2.53 0 0 1-.35.447L14.84 9.823c.112.428.166.869.16 1.311-.01.356-.06.709-.147 1.054l3.413 3.412c.132.134.249.283.347.444A9.88 9.88 0 0 0 20 11.269a9.912 9.912 0 0 0-1.386-5.319ZM14.6 19.264l-3.421-3.421c-.385.1-.781.152-1.18.157h-.134c-.356-.01-.71-.06-1.056-.147l-3.41 3.412a2.503 2.503 0 0 1-.443.347A9.884 9.884 0 0 0 9.732 21H10a9.9 9.9 0 0 0 5.044-1.388 2.519 2.519 0 0 1-.444-.348ZM1.735 15.6l3.426-3.426a4.608 4.608 0 0 1-.013-2.367L1.735 6.4a2.507 2.507 0 0 1-.35-.447 9.889 9.889 0 0 0 0 10.1c.1-.164.217-.316.35-.453Zm5.101-.758a4.957 4.957 0 0 1-.651-.645c-.033-.038-.077-.067-.11-.107L3.15 17.017a.5.5 0 0 0 0 .707l.127.127a.5.5 0 0 0 .706 0l2.932-2.933c-.03-.018-.05-.053-.078-.076ZM6.08 7.914c.03-.037.07-.063.1-.1.183-.22.384-.423.6-.609.047-.04.082-.092.129-.13L3.983 4.149a.5.5 0 0 0-.707 0l-.127.127a.5.5 0 0 0 0 .707L6.08 7.914Z"/>
              </svg>
              <span className="ms-3">Contact Us</span>
              </a>
          </li> */}
      </ul>
    </aside>
  );
}
