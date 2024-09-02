import React, { useState } from 'react';

function Policy() {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  // Function to handle form submission (can be modified as needed)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
    closeModal();
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
        <div
          className="bg-white rounded-lg p-3 border-2 border-gray-200 w-full h-48 cursor-pointer"
          onClick={openModal}
        >
          this is the policy box
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Policy Details</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="Input 1" className="border border-gray-300 p-2 rounded-lg"/>
              <input type="text" placeholder="Input 2" className="border border-gray-300 p-2 rounded-lg" />
              <input type="text" placeholder="Input 3" className="border border-gray-300 p-2 rounded-lg" />
              <div className="flex justify-between mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-red-500 text-white rounded-lg">Close</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Policy;
