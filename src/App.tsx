import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar, { SidebarItem } from "./components/Static/Sidebar";
import { RiTimeZoneLine } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { BsTools } from "react-icons/bs";
import { RiNodeTree } from "react-icons/ri";
import { FilterIcon, LogsIcon } from "lucide-react";
import { MdPolicy } from "react-icons/md";
import GetLogs from "./components/Logs/GetLogs";
import FilterLogs from "./components/Logs/FilterLogs";
import Policy from "./components/Policy/Policy";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar>
          <SidebarItem icon={<LogsIcon />} text="Get Logs" to="/get-logs" />
          <hr className="my-3" />
          <SidebarItem icon={<FilterIcon />} text="Filter Logs" to="/filter-logs" />
          <hr className="my-3" />
          <SidebarItem icon={<MdPolicy />} text="Policy" to="/policy" />
          <hr className="my-3" />
          <SidebarItem icon={<RiTimeZoneLine />} text="ZONE" to="/zone" />
          <hr className="my-3" />
          <SidebarItem icon={<IoSettings />} text="OS" to="/os" />
          <hr className="my-3" />
          <SidebarItem icon={<BsTools />} text="ARCH" to="/arch" />
          <hr className="my-3" />
          <SidebarItem icon={<RiNodeTree />} text="NODE" to="/node" />
          <hr className="my-3" />
        </Sidebar>
        <div className="p-2 w-full">
          <Routes>
            <Route path="/get-logs" element={<GetLogs />} />
            <Route path="/filter-logs" element={<FilterLogs />} />
            <Route path="/policy" element={<Policy />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
