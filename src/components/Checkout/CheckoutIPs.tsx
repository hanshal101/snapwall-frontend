import { useState, useEffect } from "react";
import axios from "axios";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ILog {
  time: string;
  severity: string;
  type: "Incoming" | "Outgoing";
  source: string;
  destination: string;
  port: string;
  protocol: string;
}

interface IPolicy {
  ID: number;
  CreatedAt: string;
  name: string;
  type: string;
  ips: { policy_id: number; address: string }[];
  ports: { policy_id: number; number: string }[];
}

function Checkoutports(IPS: any) {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [fetchLogsEnabled] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ports, setPorts] = useState<string[]>([]);
  const [policies, setPolicies] = useState<IPolicy[]>([]);
  const apikey = import.meta.env.VITE_API_URL;
  const ip = IPS;

  const fetchLogs = async () => {
    if (!fetchLogsEnabled) return;

    try {
      const response = await axios.get(`${apikey}/checkout/ips/${ip}`);
      const logData = response.data;

      if (Array.isArray(logData)) {
        setLogs(logData);
      } else {
        console.error("Log data is not an array:", logData);
        setError("Unexpected log data format");
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

  const groupDataByTypeAndHour = (logs: ILog[]) => {
    const groupedData: { Incoming: Record<number, number>; Outgoing: Record<number, number> } = {
      Incoming: {},
      Outgoing: {},
    };

    logs.forEach((log) => {
      const date = new Date(log.time);
      const hour = date.getUTCHours();

      if (!groupedData[log.type][hour]) {
        groupedData[log.type][hour] = 0;
      }

      groupedData[log.type][hour] += 1;
    });

    const formatData = (data: Record<number, number>) => {
      const formattedData = [];
      for (let hour = 0; hour < 24; hour++) {
        formattedData.push({
          hour: `${hour}:00`,
          requests: data[hour] ?? 0,
        });
      }
      return formattedData;
    };

    return {
      incomingData: formatData(groupedData.Incoming),
      outgoingData: formatData(groupedData.Outgoing),
    };
  };

  const { incomingData, outgoingData } = groupDataByTypeAndHour(logs);

  const fetchPorts = async () => {
    try {
      const response = await axios.get<string[]>(`${apikey}/checkout/ips/${ip}/ports`);
      const portData = response.data;

      if (Array.isArray(portData)) {
        setPorts(portData);
      } else {
        console.error("Port data is not an array:", portData);
        setPorts([]);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching ports:", error);
      setError("Failed to fetch ports");
    }
  };

  useEffect(() => {
    fetchPorts();
    const intervalId = setInterval(() => {
      if (fetchLogsEnabled) {
        fetchPorts();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchLogsEnabled]);

  const fetchPolicies = async () => {
    setError(null);
    try {
      const response = await axios.get<IPolicy[]>(`${apikey}/policies/${ip}`);
      if (Array.isArray(response.data)) {
        console.log(response.data)
        setPolicies(response.data);
      } else {
        console.error("Policies data is not an array:", response.data);
        setPolicies([]);
      }
    } catch (error) {
      setError(`Failed to fetch policies ${error}`);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [ip]);

  return (
    <section className="m-auto font-medium m-2">
      <h1>Checkout ports through Dashboards</h1>
      <div className="mt-5 text-xl">
        <h1>IP: {ip}</h1>
      </div>
      <div className="flex mt-5 gap-4">
        <div className="w-1/2 h-96 border-2 p-2 rounded-xl">
          <ResponsiveContainer>
            <AreaChart
              data={incomingData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(tick) => tick ?? ""} />
              <YAxis tickFormatter={(tick) => tick ?? ""} />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="#ff1100" fill="#ffa39c" />
            </AreaChart>
          </ResponsiveContainer>
          <h2 className="text-center mt-4">Incoming Requests</h2>
        </div>

        <div className="w-1/2 h-96 border-2 p-2 rounded-xl">
          <ResponsiveContainer>
            <AreaChart
              data={outgoingData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(tick) => tick ?? ""} />
              <YAxis tickFormatter={(tick) => tick ?? ""} />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="#226600" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
          <h2 className="text-center mt-4">Outgoing Requests</h2>
        </div>
      </div>
      <br />
      <h2 className="mt-4 text-xl">Number of ports accessed</h2>
      <div className="mt-4 gap-4 grid grid-flow-col">
        {ports.map((port, index) => (
          <div
            key={index}
            className="p-4 border-2 hover:border-indigo-800 text-center hover:bg-indigo-100 duration-300 text-xl"
          >
            {port}
          </div>
        ))}
      </div>
      <h2 className="mt-4 text-xl">Number of Policies followed</h2>
      {policies.length === 0 ? (
        <p> - No policies found</p>
      ) : (
        <div className="grid grid-flow-col mt-4 text-lg">
          {policies.map((policy) => (
            <div key={policy.ID} className="p-5 border-2 w-1/3 hover:border-indigo-800 hover:bg-indigo-100 duration-300">
                <h2 key={policy.ID} >Name: {policy.name }</h2>
                <h2 key={policy.ID} >Type: {policy.type}</h2>
                {/* {policy.ports.map((port) => (
                    <h3 key={port.number}>{port.number}</h3>
                ))} */}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </section>
  );
}

export default Checkoutports;
