import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the type for log data based on the API response
interface ILog {
  id: number;
  CreatedAt: string;
  name: string;
  message: string;
}

function GetLogs() {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch logs from the server
  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:6000/logs');
      setLogs(response.data);
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch logs');
    }
  };

  // Function to create a new log entry (POST request)
  const createLog = async (log: Omit<ILog, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:6000/logs', log);
      console.log('Log created:', response.data);
      fetchLogs(); // Refresh logs after creating a new one
    } catch (error) {
      console.error('Error creating log:', error);
    }
  };

  // Function to update an existing log entry (PUT request)
  const updateLog = async (id: number, updatedLog: Partial<ILog>) => {
    try {
      const response = await axios.put(`http://localhost:6000/logs/${id}`, updatedLog);
      console.log('Log updated:', response.data);
      fetchLogs(); // Refresh logs after updating one
    } catch (error) {
      console.error('Error updating log:', error);
    }
  };

  // Function to delete a log entry (DELETE request)
  const deleteLog = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:6000/logs/${id}`);
      console.log('Log deleted:', response.data);
      fetchLogs(); // Refresh logs after deleting one
    } catch (error) {
      console.error('Error deleting log:', error);
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
                    <tr key={log.id}>
                      <td className="whitespace-nowrap px-4 py-1 text-sm text-gray-700">
                        {log.CreatedAt}
                      </td>
                      <td className="whitespace-nowrap px-4 py-1 text-sm text-gray-700">
                        {log.message}
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
