import { useEffect, useState, useRef } from "react";
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
  const [ip, setIp] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const [logs, setLogs] = useState<ILog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const apikey = import.meta.env.VITE_API_URL;

  const fetchFilteredLogs = async () => {
    try {
      const response = await axios.get(`${apikey}/logs/port/${port}`);
      const logData = response.data;
      if (Array.isArray(logData)) {
        setLogs(logData.slice(-100));
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredLogs();
  };

  const getLogLevelClass = (severity: string) => {
    switch (severity) {
      case 'LOW':
        return 'bg-green-600';
      case 'HIGH':
        return 'bg-red-600';
      case 'MEDIUM':
        return 'bg-yellow-400';
      default:
        return 'bg-black';
    }
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className="mt-0 w-full px-4 py-4">
      <div className="flex flex-col w-full space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex">
          <h2 className="text-lg font-semibold">Search Logs:</h2>
          <span className="ml-4 mt-1 text-sm text-gray-700">
            Filter logs by IP and port
          </span>
        </div>
      </div>
      <div className="flex gap-3 mt-6 flex-col w-full space-y-4 md:items-center md:justify-between md:space-y-0">
        <form onSubmit={handleSearch} className="flex w-full p-2 border border-gray-200 rounded-lg justify-center gap-5">
          <div className="gap-3 flex">
            <input
              placeholder="Search IP"
              className="border px-2 border-gray-300"
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              name="ip_number"
              id="ip_number"
            />
            <input
              placeholder="Search Port"
              className="border px-2 border-gray-300"
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              name="port_number"
              id="port_number"
            />
          </div>
          <button type="submit" className="p-2 bg-gray-50 border border-gray-200 rounded-lg">
            Submit
          </button>
        </form>
      </div>

      <div className="mt-1 flex flex-col w-full ">
        <div className="w-full">
          <div className="w-full py-2">
            <div className="overflow-y-auto overflow-x-hidden w-full border border-gray-200 md:rounded-lg">
              <div className="min-w-full divide-y divide-gray-200 ">
                <div className="bg-gray-50 w-full sticky top-0 ">
                  <div className="flex w-full">
                    <div className="px-4 justify-center border flex w-full py-3.5 text-left text-sm font-normal text-gray-700">
                      <span>Timestamp</span>
                    </div>
                    <div className="px-4 justify-center flex border w-full py-3.5 text-left text-sm font-normal text-gray-700">
                      <span>Severity</span>
                    </div>
                    <div className="px-4 justify-center flex border w-full py-3.5 text-left text-sm font-normal text-gray-700">
                      <span>Type</span>
                    </div>
                    <div className="px-4 justify-center flex border w-full py-3.5 text-left text-sm font-normal text-gray-700">
                      <span>Source</span>
                    </div>
                    <div className="px-4 justify-center flex border w-full py-3.5 text-left text-sm font-normal text-gray-700">
                      <span>Destination</span>
                    </div>
                    <div className="px-4 justify-center flex border w-full py-3.5 text-left text-sm font-normal text-gray-700">
                      <span>Protocol</span>
                    </div>
                    <div className="px-4 justify-center flex border w-full py-3.5 text-left text-sm font-normal text-gray-700">
                      <span>Port</span>
                    </div>
                  </div>
                </div>
                <div
                  ref={logContainerRef}
                  className="divide-y divide-gray-200 bg-white w-full h-[75vh] overflow-y-auto"
                >
                  {logs.map((log, index) => (
                    <div key={index} className={`flex justify-around w-full`}>
                      <div className="whitespace-nowrap px-4 py-1 text-sm">
                        {log.time}
                      </div>
                      <div className={`whitespace-nowrap px-4 py-1 text-sm flex items-center`}>
                        <div className={`h-3 w-3 rounded-full ${getLogLevelClass(log.severity)} mr-2`}></div>
                        <span className={``}>{log.severity}</span>
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
    </section>
  );
}

export default FilterLogs;
