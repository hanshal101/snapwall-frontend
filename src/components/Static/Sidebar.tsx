// function Sidebar() {
//   return (
//     <div className="bg-slate-500 text-yellow-300 w-full p-2 min-h-screen h-full">
//         <header className="flex pb-3">
//             <img className="h-16 w-16 object-cover bg-white rounded-full" src="https://1000logos.net/wp-content/uploads/2021/10/Meta-Symbol.png" alt="Logo" />
//         </header>
//         <div>
//             <h3 className="font-mono">Navigate</h3>
//             <ul className="list-none">
//                 <h4 className="w-full border-l pl-1 border-t border-white text-white">Logs</h4>
//                 <li className="pl-2">Get Logs</li>
//                 <li className="pl-2">Filter Logs</li>
//                 <h4 className="w-full border-l pl-1 border-t border-white text-white">Policy</h4>
//                 <li className="pl-2">Track Policy</li>
//             </ul>
//         </div>
//     </div>
//   )
// }

// export default Sidebar

import { ChevronFirst, ChevronLast } from "lucide-react";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context value
interface SidebarContextType {
  expanded: boolean;
}

// Create the context with a default value
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <div>
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>
        </nav>
      </aside>
    </div>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
}

export function SidebarItem({ icon, text, active = false, alert = false }: SidebarItemProps) {
  const context = useContext(SidebarContext);

  // Ensure context is defined
  if (!context) {
    throw new Error("SidebarItem must be used within a Sidebar");
  }

  const { expanded } = context;

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}></div>
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}