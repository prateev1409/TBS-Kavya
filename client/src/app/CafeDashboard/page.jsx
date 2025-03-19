"use client";
import { useRef, useState } from "react";

function CafeDashboard() {
  // Dummy cafe details
  const initialCafe = {
    cafe_id: "cafe_001",
    name: "Reading Room Café",
    location: "New Town, Kolkata",
    average_bill: 250,
    discount: 10,
    ratings: 4.2,
    specials: "Weekend discounts",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Dummy transactions data
  const initialTransactions = [
    {
      transaction_id: 1001,
      book_id: "book_001",
      user_id: "user_001",
      cafe_id: "cafe_001",
      status: "pickup_pending",
      created_at: "2024-01-20T10:30:00Z",
    },
    {
      transaction_id: 1004,
      book_id: "book_004",
      user_id: "user_004",
      cafe_id: "cafe_001",
      status: "dropoff_pending",
      created_at: "2024-01-23T12:30:00Z",
    },
  ];

  const [cafeDetails, setCafeDetails] = useState(initialCafe);
  const [transactions] = useState(initialTransactions);

  // State for editing cafe details (only name and discount)
  const [editForm, setEditForm] = useState({
    name: cafeDetails.name,
    discount: cafeDetails.discount,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Filter transactions: only those for this cafe and with a pending status.
  const pendingStatuses = ["pickup_pending", "dropoff_pending"];
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.cafe_id === cafeDetails.cafe_id &&
      pendingStatuses.includes(tx.status)
  );

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSave = () => {
    setCafeDetails({
      ...cafeDetails,
      name: editForm.name,
      discount: Number(editForm.discount),
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  // Drag-to-scroll for the transactions table
  const tableRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    tableRef.current.classList.add("dragging");
    startX.current = e.pageX - tableRef.current.offsetLeft;
    scrollLeft.current = tableRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    tableRef.current.classList.remove("dragging");
  };

  const handleMouseUp = () => {
    isDown.current = false;
    tableRef.current.classList.remove("dragging");
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    tableRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Cafe Dashboard</h1>
        
        {/* Cafe Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Cafe Details</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Cafe ID:</span> {cafeDetails.cafe_id}</p>
            <p><span className="font-semibold">Location:</span> {cafeDetails.location}</p>
            <p>
              <span className="font-semibold">Average Bill:</span>{" "}
              <span>₹{cafeDetails.average_bill}</span>
            </p>
            <p><span className="font-semibold">Ratings:</span> {cafeDetails.ratings}</p>
            <p><span className="font-semibold">Specials:</span> {cafeDetails.specials}</p>
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 font-medium">
                Cafe Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={editForm.name}
                onChange={handleEditChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="discount" className="block mb-1 font-medium">
                Discount
              </label>
              <input
                id="discount"
                name="discount"
                type="number"
                value={editForm.discount}
                onChange={handleEditChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
              >
                Edit Details
              </button>
            )}
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Pending Transactions</h2>
          <div
            className="overflow-x-auto cursor-grab"
            ref={tableRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 whitespace-nowrap">
                  <th className="px-4 py-3 text-left">Transaction ID</th>
                  <th className="px-4 py-3 text-left">Book ID</th>
                  <th className="px-4 py-3 text-left">User ID</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-t whitespace-nowrap">
                    <td className="px-4 py-3">{tx.transaction_id}</td>
                    <td className="px-4 py-3">{tx.book_id}</td>
                    <td className="px-4 py-3">{tx.user_id}</td>
                    <td className="px-4 py-3">{tx.status.replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-center" colSpan="5">
                      No pending transactions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dragging {
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export default CafeDashboard;
