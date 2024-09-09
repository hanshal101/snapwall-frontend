import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

interface ApplicationStatusModel {
  ID: number;
  CreatedAt: string;
  name: string;
  port: string;
  description: string;
  tags: { application_id: number; tag: string }[];
}

interface NewApplicationStatusModel {
  name: string;
  port: string;
  description: string;
  tag: string[];
}

function ApplicationStatus() {
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatusModel[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newApplicationStatus, setNewApplicationStatus] = useState<NewApplicationStatusModel>({
    name: "",
    port: "",
    description: "",
    tag: [],
  });
  const [selectedApplicationStatus, setSelectedApplicationStatus] = useState<ApplicationStatusModel | null>(null);
  const [filteredApplicationStatus, setFilteredApplicationStatus] = useState<ApplicationStatusModel[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const apikey = import.meta.env.VITE_API_URL;

  const fetchApplicationStatus = async () => {
    try {
      const response = await axios.get<ApplicationStatusModel[]>(`${apikey}/application`);
      setApplicationStatus(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching application statuses:", error);
    }
  };

  const createApplicationStatus = async () => {
    try {
      await axios.post(`${apikey}/application`, newApplicationStatus);
      fetchApplicationStatus();
      closeCreateModal();
    } catch (error) {
      console.error("Error creating application status:", error);
    }
  };

  const updateApplicationStatus = async (applicationStatusID: number) => {
    if (selectedApplicationStatus) {
      try {
        await axios.put(`${apikey}/application/${applicationStatusID}`, selectedApplicationStatus);
        fetchApplicationStatus();
        closeDetailModal();
      } catch (error) {
        console.error("Error updating application status:", error);
      }
    }
  };

  const deleteApplicationStatus = async (applicationStatusID: number) => {
    try {
      await axios.delete(`${apikey}/application/${applicationStatusID}`);
      fetchApplicationStatus();
      closeDetailModal();
    } catch (error) {
      console.error("Error deleting application status:", error);
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openDetailModal = (applicationStatus: ApplicationStatusModel) => {
    setSelectedApplicationStatus(applicationStatus);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const handleCreateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createApplicationStatus();
  };

  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedApplicationStatus) {
      updateApplicationStatus(selectedApplicationStatus.ID);
    }
  };



  useEffect(() => {
    if (searchTerm === "") {
      setFilteredApplicationStatus(applicationStatus);
    } else {
      setFilteredApplicationStatus(applicationStatus.filter((status) => status.name.includes(searchTerm)));
    }
  }, [searchTerm, applicationStatus]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-2 w-full flex flex-col gap-3">
      <div className="w-full flex justify-between bg-white border border-gray-200 p-3 text-lg font-mono rounded-lg">
        <p className="cursor-pointer border-2 border-indigo-800 p-2 rounded-lg bg-indigo-200 w-full text-center" onClick={openCreateModal}>Create Application Status</p>
      </div>
      <input
        type="text"
        placeholder="Search Application Status by name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border rounded-md"
      />
      <div className="w-full grid-cols-3 grid place-items-center gap-2 bg-white border border-gray-200 p-3 text-lg font-mono rounded-lg">
        {filteredApplicationStatus.map((status) => (
          <div
            key={status.ID}
            className="bg-white shadow-lg rounded-lg p-3 border-2 border-indigo-200 w-full h-48 cursor-pointer flex flex-col"
            onClick={() => openDetailModal(status)}
          >
            <span className="underline font-bold">Name: {status.name}</span>
            <span className="font-sans text-gray-400 text-base">
              Date: {status.CreatedAt}
            </span>
            <span className="text-base">Ports: {status.port}</span>
            <span className="text-base">Description: {status.description}</span>
          </div>
        ))}
      </div>
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Create New Application Status</h2>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 p-2 rounded-lg"
                value={newApplicationStatus.name}
                onChange={(e) =>
                  setNewApplicationStatus({ ...newApplicationStatus, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Port"
                className="border border-gray-300 p-2 rounded-lg"
                value={newApplicationStatus.port}
                onChange={(e) =>
                  setNewApplicationStatus({ ...newApplicationStatus, port: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Description"
                className="border border-gray-300 p-2 rounded-lg"
                value={newApplicationStatus.description}
                onChange={(e) =>
                  setNewApplicationStatus({ ...newApplicationStatus, description: e.target.value })
                }
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDetailModalOpen && selectedApplicationStatus && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Application Status Details</h2>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg"
                value={selectedApplicationStatus.name}
                onChange={(e) =>
                  setSelectedApplicationStatus({ ...selectedApplicationStatus, name: e.target.value })
                }
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg"
                value={selectedApplicationStatus.port}
                onChange={(e) =>
                  setSelectedApplicationStatus({ ...selectedApplicationStatus, port: e.target.value })
                }
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg"
                value={selectedApplicationStatus.description}
                onChange={(e) =>
                  setSelectedApplicationStatus({ ...selectedApplicationStatus, description: e.target.value })
                }
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={closeDetailModal}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => deleteApplicationStatus(selectedApplicationStatus.ID)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationStatus;
