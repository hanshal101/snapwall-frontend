import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Checkoutports from './CheckoutIPs';

const Checkout = () => {
    const [ips, setIps] = useState<string[]>([]);
    const [filteredIps, setFilteredIps] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [selectedIp, setSelectedIp] = useState<string | null>(null);
    const apikey = import.meta.env.VITE_API_URL;

    const fetchIps = async () => {
        try {
            const response = await axios.get(`${apikey}/checkout/ips`);
            const IPData = response.data;
            if (Array.isArray(IPData)) {
                setIps(IPData);
                setFilteredIps(IPData);
            } else {
                console.error("Log data is not an array:", IPData);
                setIps([]);
                setFilteredIps([]);
            }
            setError(null);
        } catch (error) {
            console.error("Error fetching logs:", error);
            setError("Failed to fetch logs");
        }
    };

    useEffect(() => {
        fetchIps();
        const intervalId = setInterval(() => {
            fetchIps();
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredIps(ips);
        } else {
            setFilteredIps(ips.filter(ip => ip.includes(searchTerm)));
        }
    }, [searchTerm, ips]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCheckoutClick = (ip: string) => {
        setSelectedIp(ip);
    };

    const handleBackClick = () => {
        setSelectedIp(null);
    };

    return (
        <section>
            {!selectedIp ? (
                <>
                    <h1 className="text-xl font-medium text-center">Checkout IPs through Dashboards</h1>
                    <div className="mt-2 p-5 border-grey border-2 h-screen rounded-xl flex flex-col">
                        <input
                            type="text"
                            placeholder="Search IPs"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="mb-4 p-2 border rounded-md"
                        />
                        <div className="flex-wrap grid grid-cols-5 gap-4">
                            {filteredIps.map(ip => (
                                <div 
                                    key={ip}
                                    onClick={() => handleCheckoutClick(ip)} 
                                    className="border-2 h-20 flex items-center justify-center hover:border-indigo-800 rounded-md hover:bg-indigo-100 duration-300 cursor-pointer"
                                >
                                    {ip}
                                </div>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </>
            ) : (
                <>
                    <button 
                        onClick={handleBackClick} 
                        className="mb-4 p-2 bg-blue-500 text-white rounded-md"
                    >
                        Back to IP List
                    </button>
                    <Checkoutports IPS={selectedIp} />
                </>
            )}
        </section>
    );
};

export default Checkout;
