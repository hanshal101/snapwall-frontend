import { useEffect, useState } from 'react';
import axios from 'axios';

interface ILog {
  time: string;
  type: string;
  source: string;
  destination: string;
  port: string;
  protocol: string;
}

function GetLogs() {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const apikey = import.meta.env.VITE_API_URL;
  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${apikey}/logs`);
      setLogs(response.data);
      console.log(response.data)
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch logs');
    }
  };

  useEffect(() => {
    // Fetch logs immediately on mount
    fetchLogs();

    // Set interval to fetch logs every 0.5 seconds for real-time updates
    const intervalId = setInterval(fetchLogs, 500);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="mx-auto w-full px-4 py-4">
      <div className="flex flex-col w-full space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-lg font-semibold">Get Logs</h2>
          <p className="mt-1 text-sm text-gray-700">
            Real-time updating of all logs.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col w-full">
        <div className="w-full">
          <div className="w-full py-2">
            <div className="overflow-x-scroll w-full border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 w-full">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                    >
                      <span>Timestamp</span>
                    </th>
                    <th
                      scope="col"
                      className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                    >
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white w-full">
                  {logs.map((log) => (
                    <tr key={log.time}>
                      <td className="whitespace-nowrap px-4 py-1 text-sm text-gray-700">
                        {log.time}
                      </td>
                      <td className="whitespace-nowrap px-4 py-1 text-sm text-gray-700">
                        {log.destination} | {log.port} | {log.protocol}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Display error if fetching logs fails */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </section>
  );
}

export default GetLogs;
