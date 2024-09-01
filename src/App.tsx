// import Sidebar from "./components/Static/Sidebar"

// function App() {
//   return (
//     <div className="grid grid-cols-[18%,82%]">
//       <Sidebar/>
//       <div>ok</div>
//     </div>
//   )
// }

// export default App

import Sidebar, { SidebarItem } from "./components/Static/Sidebar";
import { RiTimeZoneLine } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { BsTools } from "react-icons/bs";
import { RiNodeTree } from "react-icons/ri";
import { FilterIcon, LogsIcon } from "lucide-react";
import { MdPolicy } from "react-icons/md";
import GetLogs from "./components/Logs/GetLogs";

function App() {
  return (
    <>
      <div className="flex">
        <Sidebar>
          <SidebarItem icon={<LogsIcon />} text="Get Logs" alert />
          <hr className="my-3" />
          <SidebarItem icon={<FilterIcon />} text="Filter Logs" active />
          <hr className="my-3" />
          <SidebarItem icon={<MdPolicy />} text="Policy" />
          <hr className="my-3" />
          <SidebarItem icon={<RiTimeZoneLine />} text="ZONE" />
          <hr className="my-3" />
          <SidebarItem icon={<IoSettings />} text="OS" />
          <hr className="my-3" />
          <SidebarItem icon={<BsTools />} text="ARCH" />
          <hr className="my-3" />
          <SidebarItem icon={<RiNodeTree />} text="NODE" />
          <hr className="my-3" />
        </Sidebar>
        <div className="p-2">
          <GetLogs/>
        </div>
      </div>
    </>
  );
}

export default App; 
