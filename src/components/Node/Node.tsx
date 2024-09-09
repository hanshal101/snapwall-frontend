import React, { PureComponent } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

// Define the shape of the data
interface DataPoint {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
}

// Define the component state
interface NodeState {
  data: DataPoint[];
}

export default class Node extends PureComponent<{}, NodeState> {
  state: NodeState = {
    data: [],
  };

  interval: NodeJS.Timeout | undefined; 

  apikey: string = `${import.meta.env.VITE_API_URL}/node`; 

  componentDidMount() {
    this.fetchData();
    this.interval = setInterval(this.fetchData, 5000); 
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval); // Clear interval when component unmounts
    }
  }

  fetchData = async () => {
    try {
      const response = await axios.get(this.apikey);
      const { cpu_usage, memory_usage, disk_usage, timestamp } = response.data;

      const newData: DataPoint = {
        timestamp: new Date(timestamp * 1000).toLocaleTimeString(), // Convert timestamp to readable time
        cpu_usage,
        memory_usage,
        disk_usage,
      };

      this.setState((prevState) => ({
        data: [...prevState.data, newData].slice(-10), // Keep only the last 10 entries
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  render() {
    return (
      <div>
        <div className='p-2 border border-gray-200 rounded-lg mb-6'>
          <p className='text-indigo-800 font-mono'>Statistics for Your Resource Monitoring</p>
        </div>
        <div className='grid grid-cols-2' style={{ width: '100%' }}>
          <div className='flex flex-col gap-2'>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={this.state.data}
                syncId="anyId"
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cpu_usage" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
            <h2 className='w-full mx-auto text-center border p-1 border-indigo-200'>CPU USAGE</h2>
          </div>

          <div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={this.state.data}
                syncId="anyId"
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="memory_usage" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
            <h2 className='w-full mx-auto text-center border p-1 border-indigo-200'>MEMORY USAGE</h2>
          </div>

          <div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={this.state.data}
                syncId="anyId"
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="disk_usage" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
            <h2 className='w-full mx-auto text-center border p-1 border-indigo-200'>DISK USAGE</h2>
          </div>
        </div>
      </div>
    );
  }
}