import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define TypeScript interfaces for the data
interface CpuInfo {
  cpu: number;
  vendorId: string;
  family: string;
  model: string;
  stepping: number;
  physicalId: string;
  coreId: string;
  cores: number;
  modelName: string;
  mhz: number;
  cacheSize: number;
  flags: string[];
  microcode: string;
}

interface MemoryInfo {
  total: number;
  available: number;
  used: number;
  usedPercent: number;
  free: number;
  active: number;
  inactive: number;
  wired: number;
  laundry: number;
  buffers: number;
  cached: number;
  writeback: number;
  dirty: number;
  writebacktmp: number;
  shared: number;
  slab: number;
  sreclaimable: number;
  sunreclaim: number;
  pagetables: number;
  swapcached: number;
  commitlimit: number;
  committedas: number;
  hightotal: number;
  highfree: number;
  lowtotal: number;
  lowfree: number;
  swaptotal: number;
  swapfree: number;
  mapped: number;
  vmalloctotal: number;
  vmallocused: number;
  vmallocchunk: number;
  hugepagestotal: number;
  hugepagesfree: number;
  hugepagesize: number;
}

interface HostInfo {
  hostname: string;
  uptime: number;
  bootTime: number;
  procs: number;
  os: string;
  platform: string;
  platformFamily: string;
  platformVersion: string;
  kernelVersion: string;
  kernelArch: string;
  virtualizationSystem: string;
  virtualizationRole: string;
  hostid: string;
}

interface SysInfoResponse {
  cpu_info: CpuInfo[];
  memory_info: MemoryInfo;
  disk_info: unknown[];
  host_info: HostInfo;
  uptime: number;
}

const SysInfo: React.FC = () => {
  const [data, setData] = useState<SysInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apikey = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get<SysInfoResponse>(`${apikey}/sysinfo`);
          setData(response.data);
        } catch (error) {
          setError((error as Error).message || 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };
      

    fetchData();
  }, [apikey, data]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  if (!data) return <div className="text-center">No Data Available</div>;

  const { cpu_info, memory_info, host_info, uptime } = data;

  return (
    <section className="mx-auto w-full px-4 py-4">
    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">System Information</h1>
    <div className="overflow-hidden overflow-y-auto max-h-screen h-full">
        <div className="p-6 bg-white min-h-screen rounded-lg shadow-md border border-gray-200">

        <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Host Information</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <p className="text-gray-600"><strong>Hostname:</strong> {host_info.hostname}</p>
            <p className="text-gray-600"><strong>Platform:</strong> {host_info.platform} ({host_info.platformFamily} - {host_info.platformVersion})</p>
            <p className="text-gray-600"><strong>OS:</strong> {host_info.os}</p>
            <p className="text-gray-600"><strong>Kernel Version:</strong> {host_info.kernelVersion} ({host_info.kernelArch})</p>
            <p className="text-gray-600"><strong>Uptime:</strong> {uptime} seconds</p>
            </div>
        </div>

        <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">CPU Information</h2>
            <div>
            {cpu_info.map((cpu, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg mb-4 border border-gray-200">
                <p className="text-gray-600"><strong>CPU {index + 1}:</strong> {cpu.modelName}</p>
                <p className="text-gray-600"><strong>Vendor ID:</strong> {cpu.vendorId}</p>
                <p className="text-gray-600"><strong>Speed:</strong> {cpu.mhz} MHz</p>
                <p className="text-gray-600"><strong>Cores:</strong> {cpu.cores}</p>
                </div>
            ))}
            </div>
        </div>

        <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Memory Information</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <p className="text-gray-600"><strong>Total Memory:</strong> {(memory_info.total / (1024 ** 3)).toFixed(2)} GB</p>
            <p className="text-gray-600"><strong>Used Memory:</strong> {(memory_info.used / (1024 ** 3)).toFixed(2)} GB ({memory_info.usedPercent.toFixed(2)}%)</p>
            <p className="text-gray-600"><strong>Available Memory:</strong> {(memory_info.available / (1024 ** 3)).toFixed(2)} GB</p>
            </div>
        </div>
        </div>
    </div>
    </section>
  );
};

export default SysInfo;
