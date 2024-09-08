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

function Intruder() {
  const [logs, setLogs] = useState<ILog[]>([]);
    const [error, setError] = useState<string | null>(null);
    const logContainerRef = useRef<HTMLDivElement>(null); 
    const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true); 
    const [fetchLogsEnabled, setFetchLogsEnabled] = useState<boolean>(true);
    const apikey = import.meta.env.VITE_API_URL;

    const fetchLogs = async () => {
      if (!fetchLogsEnabled) return;

      try {
        const response = await axios.get(`${apikey}/logs/intruder`);
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

    useEffect(() => {
      fetchLogs();
      const intervalId = setInterval(() => {
        if (fetchLogsEnabled) {
          fetchLogs();
        }
      }, 500);

      return () => clearInterval(intervalId);
    }, [fetchLogsEnabled]);

    useEffect(() => {
      if (autoScrollEnabled && logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, [logs, autoScrollEnabled]);

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

    const toggleAutoScroll = () => {
      setAutoScrollEnabled(!autoScrollEnabled);
      setFetchLogsEnabled(!autoScrollEnabled); 
    };

    return (
      <section className="mx-auto w-full px-4 py-4">
        <div className="flex flex-col w-full space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-lg font-semibold">Get Logs</h2>
            <p className="mt-1 text-sm text-gray-700">
              Real-time updating of logs with upward flow.
            </p>
          </div>
          <button
            onClick={toggleAutoScroll}
            className={`mt-4 px-4 py-2 rounded-md focus:outline-none ${
              autoScrollEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {autoScrollEnabled ? 'Pause Auto-Scroll' : 'Resume Auto-Scroll'}
          </button>
        </div>

        <div className="mt-6 flex flex-col w-full ">
          <div className="w-full">
            <div className="w-full py-2">
              <div className="overflow-y-auto overflow-x-hidden w-full  border border-gray-200 md:rounded-lg">
                <div className="min-w-full divide-y divide-gray-200 ">
                  <div className="bg-gray-50 w-full sticky top-0 ">
                    <div className="grid grid-cols-7 font-mono w-full">
                      <div className="px-4 border flex w-full py-3.5 text-left  font-normal text-gray-700">
                        <span>Timestamp</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left  font-normal text-gray-700">
                        <span>Severity</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left  font-normal text-gray-700">
                        <span>Type</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left  font-normal text-gray-700">
                        <span>Source</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left  font-normal text-gray-700">
                        <span>Destination</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left  font-normal text-gray-700">
                        <span>Protocol</span>
                      </div>
                      <div className="px-4 flex border w-full py-3.5 text-left  font-normal text-gray-700">
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

export default Intruder;
