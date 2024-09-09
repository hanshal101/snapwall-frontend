import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar, { SidebarItem } from "./components/Static/Sidebar";
import { RiTimeZoneLine } from "react-icons/ri";
import { IoCodeWorkingOutline, IoSettings } from "react-icons/io5";
import { BsTools } from "react-icons/bs";
import { RiNodeTree } from "react-icons/ri";
import { FilterIcon, LogsIcon } from "lucide-react";
import { MdPolicy, MdSettingsApplications } from "react-icons/md";
import GetLogs from "./components/Logs/GetLogs";
import FilterLogs from "./components/Logs/FilterLogs";
import Policy from "./components/Policy/Policy";
import Intruder from "./components/Intruder";
import SysInfo from "./components/SysInfo";
import Checkout from "./components/Checkout/Checkout";
import ApplicationStatus from "./components/Application/ApplicationStats";
import Node from "./components/Node/Node";

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
          <SidebarItem icon={<RiTimeZoneLine />} text="Intruder" to="/intruder" />
          <hr className="my-3" />
          <SidebarItem icon={<IoSettings />} text="SysInfo" to="/sysinfo" />
          <hr className="my-3" />
          <SidebarItem icon={<BsTools />} text="Checkout" to="/checkout" />
          <hr className="my-3" />
          <SidebarItem icon={<IoCodeWorkingOutline />} text="Applications" to="/applications" />
          <hr className="my-3" />
          <SidebarItem icon={<RiNodeTree />} text="Node" to="/node" />
          <hr className="my-3" />
        </Sidebar>
        <div className="p-2 w-full">
          <Routes>
            <Route path="/get-logs" element={<GetLogs />} />
            <Route path="/filter-logs" element={<FilterLogs />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/intruder" element={<Intruder />} />
            <Route path="/sysinfo" element={<SysInfo />} />
            <Route path="/checkout" element={<Checkout />}></Route>
            <Route path="/applications" element={<ApplicationStatus />} />
            <Route path="/node" element={<Node />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
