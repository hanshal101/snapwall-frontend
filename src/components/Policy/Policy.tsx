import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the TypeScript type for an existing Policy
interface PolicyModel {
  id: number;
  CreatedAt: string;
  name: string;
  type: string;
  ips: { policy_id: number; address: string }[];
  ports: { policy_id: number; number: string }[];
}

// Define the TypeScript type for creating a new Policy
interface NewPolicyModel {
  name: string;
  type: string;
  ips: { address: string }[];
  ports: { number: string }[];
}

function Policy() {
  const [policies, setPolicies] = useState<PolicyModel[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState<NewPolicyModel>({
    name: "",
    type: "",
    ips: [{ address: "" }],
    ports: [{ number: "" }],
  });
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyModel | null>(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Fetch policies from the API
  const fetchPolicies = async () => {
    try {
      const response = await axios.get<PolicyModel[]>("http://localhost:6000/policies");
      setPolicies(response.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  // Create a new policy
  const createPolicy = async () => {
    try {
      await axios.post("http://localhost:6000/policies", newPolicy);
      fetchPolicies(); // Refresh the list after adding
      closeCreateModal();
    } catch (error) {
      console.error("Error creating policy:", error);
    }
  };

  // Update an existing policy
  const updatePolicy = async (policyID: number) => {
    if (selectedPolicy) {
      try {
        await axios.put(`http://localhost:6000/policies/${policyID}`, selectedPolicy);
        fetchPolicies(); // Refresh the list after updating
        closeDetailModal();
      } catch (error) {
        console.error("Error updating policy:", error);
      }
    }
  };

  // Delete a policy
  const deletePolicy = async (policyID: number) => {
    try {
      await axios.delete(`http://localhost:6000/policies/${policyID}`);
      fetchPolicies(); // Refresh the list after deletion
      closeDetailModal();
    } catch (error) {
      console.error("Error deleting policy:", error);
    }
  };

  // Open modals
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openDetailModal = (policy: PolicyModel) => {
    setSelectedPolicy(policy);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => setIsDetailModalOpen(false);

  // Handle form submission for creating a new policy
  const handleCreateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createPolicy();
  };

  // Handle form submission for updating an existing policy
  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedPolicy) {
      updatePolicy(selectedPolicy.id);
    }
  };

  return (
    <div className="p-2 w-full flex flex-col gap-3">
      <div className="w-full flex justify-between bg-white border border-gray-200 p-3 text-lg font-mono rounded-lg">
        <p>real thing</p>
        <p>the three dots</p>
      </div>
      <div className="w-full bg-white border border-gray-200 flex items-center gap-3 justify-center p-3 font-mono rounded-lg">
        <input
          type="text"
          placeholder="search your policy id Ex:PCY1000@Dumb"
          className="w-full focus:outline-none border border-gray-200 p-2 rounded-lg"
        />
        <button className="p-2 border border-gray-200 bg-gray-50 rounded-lg">
          Search
        </button>
      </div>
      <div className="w-full grid-cols-3 grid place-items-center gap-2 bg-white border border-gray-200 p-3 text-lg font-mono rounded-lg">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="bg-white rounded-lg p-3 border-2 border-gray-200 w-full h-48 cursor-pointer"
            onClick={() => openDetailModal(policy)}
          >
            <span>Date: {policy.CreatedAt}</span>
            <span>Name: {policy.name}</span>
            <span>Type: {policy.type}</span>
            <span>IPs: {policy.ips.map(ip => ip.address).join(", ")}</span>
            <span>Ports: {policy.ports.map(port => port.number).join(", ")}</span>
          </div>
        ))}
        <div
          className="bg-white rounded-lg p-3 border-2 border-gray-200 w-full h-48 cursor-pointer"
          onClick={openCreateModal}
        >
          Create Policy
        </div>
      </div>

      {/* Create Policy Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Create New Policy</h2>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 p-2 rounded-lg"
                value={newPolicy.name}
                onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Type"
                className="border border-gray-300 p-2 rounded-lg"
                value={newPolicy.type}
                onChange={(e) => setNewPolicy({ ...newPolicy, type: e.target.value })}
              />
              {/* Add more input fields for IPs and Ports as needed */}
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

      {/* Detail Policy Modal */}
      {isDetailModalOpen && selectedPolicy && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Policy Details</h2>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 p-2 rounded-lg"
                value={selectedPolicy.name}
                onChange={(e) => setSelectedPolicy({ ...selectedPolicy, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Type"
                className="border border-gray-300 p-2 rounded-lg"
                value={selectedPolicy.type}
                onChange={(e) => setSelectedPolicy({ ...selectedPolicy, type: e.target.value })}
              />
              {/* Add more input fields for IPs and Ports as needed */}
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
                  onClick={() => deletePolicy(selectedPolicy.id)}
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

export default Policy;
