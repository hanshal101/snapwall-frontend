import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface ILog {
  time: string;
  severity: string;
  type: string;
  source: string;
  destination: string;
  port: string;
  protocol: string;
}

function FilterLogs() {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [filterType, setFilterType] = useState<"IP" | "Port" | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const apikey = import.meta.env.VITE_API_URL;

  const fetchFilteredLogs = async (filter: "IP" | "Port") => {
    try {
      let url = "";
      if (filter === "IP") {
        url = `${apikey}/logs/source/ip/${filterValue}`;
      } else if (filter === "Port") {
        url = `${apikey}/logs/port/${filterValue}`;
      }

      const response = await axios.get(url);
      const logData = response.data;

      if (Array.isArray(logData)) {
        setLogs(logData.slice(-100)); // Display last 100 logs
      } else {
        console.error("Log data is not an array:", logData);
        setLogs([]);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setError("Failed to fetch logs");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filterType) {
      fetchFilteredLogs(filterType);
    }
  };

  const getLogLevelClass = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "bg-green-600";
      case "HIGH":
        return "bg-red-600";
      case "MEDIUM":
        return "bg-yellow-400";
      default:
        return "bg-black";
    }
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className="mt-0 w-full px-4 py-4">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => setFilterType("IP")}
            className="p-2 bg-indigo-200 text-indigo-800 font-bold hover:scale-110 transition-all active:scale-100 rounded-lg"
          >
            Filter by IP
          </button>
          <button
            onClick={() => setFilterType("Port")}
            className="p-2 bg-indigo-200 text-indigo-800 font-bold hover:scale-110 transition-all active:scale-100 rounded-lg"
          >
            Filter by Port
          </button>
        </div>

        {/* Render input field based on selected filter type */}
        {filterType && (
          <form onSubmit={handleSubmit} className="flex mt-4 transition-all active:translate-y-1 gap-4">
            <input
              placeholder={`Enter ${filterType}`}
              className="border px-2 border-gray-300"
              type={filterType === "Port" ? "number" : "text"}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-indigo-500  text-white rounded-lg"
            >
              Submit
            </button>
          </form>
        )}

        {/* Log Table */}
        <div className="mt-4 flex flex-col w-full">
          <div className="w-full">
            <div className="w-full py-2">
              <div className="overflow-y-auto overflow-x-hidden w-full border border-gray-200 md:rounded-lg">
                <div className="min-w-full divide-y divide-gray-200">
                  <div className="bg-gray-50 w-full sticky top-0">
                    <div className="grid grid-cols-7 font-mono w-full">
                      <div className="px-4 border flex w-full py-3.5 text-left font-normal text-gray-700">
                        <span>Timestamp</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left font-normal text-gray-700">
                        <span>Severity</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left font-normal text-gray-700">
                        <span>Type</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left font-normal text-gray-700">
                        <span>Source</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left font-normal text-gray-700">
                        <span>Destination</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left font-normal text-gray-700">
                        <span>Protocol</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left font-normal text-gray-700">
                        <span>Port</span>
                      </div>
                    </div>
                  </div>
                  <div
                    ref={logContainerRef}
                    className="divide-y divide-gray-200 bg-white w-full h-[75vh] overflow-y-auto"
                  >
                    {logs.map((log, index) => (
                      <div key={index} className={`grid grid-cols-7 w-full`}>
                        <div className="whitespace-nowrap px-4 py-1 text-sm">
                          {log.time}
                        </div>
                        <div
                          className={`whitespace-nowrap px-4 py-1 text-sm flex items-center`}
                        >
                          <div
                            className={`h-3 w-3 rounded-full ${getLogLevelClass(
                              log.severity
                            )} mr-2`}
                          ></div>
                          <span className="">{log.severity}</span>
                        </div>
                        <div className="whitespace-nowrap px-4 py-1 text-sm">
                          {log.type}
                        </div>
                        <div className="whitespace-nowrap px-4 py-1 text-sm">
                          {log.source}
                        </div>
                        <div className="whitespace-nowrap px-4 py-1 text-sm">
                          {log.destination}
                        </div>
                        <div className="whitespace-nowrap px-4 py-1 text-sm">
                          {log.protocol}
                        </div>
                        <div className="whitespace-nowrap px-4 py-1 text-sm">
                          {log.port}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </section>
  );
}

export default FilterLogs;
