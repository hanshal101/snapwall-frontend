import React, { useState } from "react";

// Define the type for an employee
interface ILogs {
  time: string;
  type: string;
  source: string;
  destination: string;
  port: string;
  protocol: string;
}

const allLogs: ILogs[] = [
  
];

// Define the CustomDropdown component
interface CustomDropdownProps {
  options: string[];
  placeholder: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  placeholder,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    onSelect(value);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || placeholder}
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function FilterLogs() {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<string>("");

  return (
    <>
      <section className="mx-auto w-full px-4 py-4">
        <div className="flex flex-col w-full space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-lg font-semibold">Get Logs</h2>
            <p className="mt-1 text-sm text-gray-700">
              Real time Updating of all Logs
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 flex-col w-full space-y-4 md:items-center md:justify-between md:space-y-0">
          <div className="w-full">
            <p className="mt-1 font-mono w-full text-sm text-gray-700">
              Filter Logs here
            </p>
          </div>
          <div className="flex w-full   p-2 border border-gray-200 rounded-lg justify-center gap-5">
            <div className="w-1/2 gap-3 flex">
              <div className="w-full">
                <CustomDropdown
                  options={["Edge", "Firefox", "Chrome", "Opera", "Safari"]}
                  placeholder="ID"
                  onSelect={(value) => setSelectedId(value)}
                />
              </div>
              <div className="w-full">
                <CustomDropdown
                  options={["Edge", "Firefox", "Chrome", "Opera", "Safari"]}
                  placeholder="Time"
                  onSelect={(value) => setSelectedTime(value)}
                />
              </div>
              <div className="w-full">
                <CustomDropdown
                  options={["Edge", "Firefox", "Chrome", "Opera", "Safari"]}
                  placeholder="Messages"
                  onSelect={(value) => setSelectedMessage(value)}
                />
              </div>
            </div>
            <button className="p-2 bg-gray-50 border border-gray-200 rounded-lg">
              Submit
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col w-full">
          <div className="w-full">
            <div className=" w-full py-2 ">
              <div className="overflow-x-scroll w-full border border-gray-200 md:rounded-lg">
                <table className="w-full divide-y divide-gray-200">
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
                    {allLogs.map((indLog) => (
                      <tr key={indLog.time}>
                        <td className="whitespace-nowrap px-4 py-1 text-sm text-gray-700">
                          {indLog.time}
                        </td>
                        <td className="whitespace-nowrap px-4 py-1 text-sm text-gray-700 flex items-center gap-2">
                          <img
                            className="h-2 w-2 object-cover rounded-full"
                            src={indLog.port}
                            alt="status ok"
                          />
                          {indLog.port}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FilterLogs;
