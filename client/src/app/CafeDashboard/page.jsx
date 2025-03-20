"use client";
import { useRef, useState } from "react";
import QRScanner from "../scanner/page"; // Adjust path as needed

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
      book_id: "ABCD_1",
      user_id: "user_001",
      cafe_id: "cafe_001",
      status: "pickup_pending",
      created_at: "2024-01-20T10:30:00Z",
    },
    {
      transaction_id: 1004,
      book_id: "XYZ_4",
      user_id: "user_004",
      cafe_id: "cafe_001",
      status: "dropoff_pending",
      created_at: "2024-01-23T12:30:00Z",
    },
  ];

  const [cafeDetails, setCafeDetails] = useState(initialCafe);
  const [transactions, setTransactions] = useState(initialTransactions);

  // For editing cafe details (only name and discount)
  const [editForm, setEditForm] = useState({
    name: cafeDetails.name,
    discount: cafeDetails.discount,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Show only pending transactions for this cafe
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

  // ---------------------------------------------------------------------------
  // Scanner Modal Handling
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannerMessage, setScannerMessage] = useState(null);
  // We'll also display the raw scanned codes for debugging:
  const [scannedCodes, setScannedCodes] = useState({ first: "", second: "" });

  // Helper: extract alphabetic portion of book id, e.g. "ABCD_1" -> "ABCD"
  const extractAlpha = (str) => {
    if (!str) return "";
    const parts = str.split("_");
    return parts[0] || "";
  };

  // Handle scanned codes from the QRScanner component.
  // Expected:
  //   First QR code: "transactionId.user_id" (e.g., "1001.user_001")
  //   Second QR code: Book_id (e.g., "ABCD_3")
  const handleScanned = ({ firstCode, secondCode }) => {
    // Save scanned codes for display
    setScannedCodes({ first: firstCode, second: secondCode });

    // 1) Parse the first code
    const parts = firstCode.split(".");
    if (parts.length !== 2) {
      setScannerMessage("Invalid format for first QR code.");
      return;
    }
    const scannedTransactionId = Number(parts[0]);
    const scannedUserId = parts[1];

    // 2) Find the pending transaction with that ID
    const pendingTxIndex = transactions.findIndex(
      (tx) =>
        tx.transaction_id === scannedTransactionId &&
        pendingStatuses.includes(tx.status)
    );
    if (pendingTxIndex === -1) {
      setScannerMessage("Transaction not found or not pending.");
      return;
    }

    const pendingTx = transactions[pendingTxIndex];

    // 3) For pickup_pending: allow if the alphabetic portion matches.
    if (pendingTx.status === "pickup_pending") {
      const storedAlpha = extractAlpha(pendingTx.book_id);
      const scannedAlpha = extractAlpha(secondCode);

      if (storedAlpha !== scannedAlpha) {
        setScannerMessage("Scanned book code does not match expected value.");
        return;
      }

      // Approve pickup:
      const updatedTx = {
        ...pendingTx,
        book_id: secondCode, // update with the scanned Book_id
        status: "picked_up",
      };

      const newTransactions = [...transactions];
      newTransactions[pendingTxIndex] = updatedTx;
      setTransactions(newTransactions);

      // Here, you would also update the Book record: update keeper_id = scannedUserId and available = false.

      setScannerMessage("Pickup transaction approved!");
    }
    // 4) For dropoff_pending: exact match required.
    else if (pendingTx.status === "dropoff_pending") {
      if (
        firstCode !== `${pendingTx.transaction_id}.${pendingTx.user_id}` ||
        secondCode !== pendingTx.book_id
      ) {
        setScannerMessage("Scanned codes do not match for dropoff.");
        return;
      }

      const updatedTx = {
        ...pendingTx,
        status: "dropped_off",
      };

      const newTransactions = [...transactions];
      newTransactions[pendingTxIndex] = updatedTx;
      setTransactions(newTransactions);

      // Also update Book record accordingly in a real app.
      setScannerMessage("Dropoff transaction approved!");
    } else {
      setScannerMessage("Transaction is not pending approval.");
    }

    // 5) Close the modal after a short delay
    setTimeout(() => {
      setShowScannerModal(false);
      setScannerMessage(null);
      setScannedCodes({ first: "", second: "" });
    }, 1500);
  };

  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Cafe Dashboard</h1>

        {/* Cafe Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Cafe Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Cafe ID:</span> {cafeDetails.cafe_id}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {cafeDetails.location}
            </p>
            <p>
              <span className="font-semibold">Average Bill:</span> ₹{cafeDetails.average_bill}
            </p>
            <p>
              <span className="font-semibold">Ratings:</span> {cafeDetails.ratings}
            </p>
            <p>
              <span className="font-semibold">Specials:</span> {cafeDetails.specials}
            </p>
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

        {/* Pending Transactions Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Pending Transactions</h2>
            <button
              onClick={() => setShowScannerModal(true)}
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Approve Transaction
            </button>
          </div>
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

      {/* QR Scanner Modal */}
      {showScannerModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowScannerModal(false);
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Scan Transaction QR Codes
            </h2>
            <div className="overflow-auto" style={{ maxHeight: "60vh" }}>
              <QRScanner onScanned={handleScanned} />
            </div>
            {/* Display scanned codes for debugging */}
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                <strong>First QR Code:</strong> {scannedCodes.first}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Second QR Code:</strong> {scannedCodes.second}
              </p>
            </div>
            {scannerMessage && (
              <div className="mt-4 bg-green-50 text-green-700 p-2 rounded-lg text-center">
                {scannerMessage}
              </div>
            )}
            <button
              onClick={() => setShowScannerModal(false)}
              className="mt-4 px-4 py-2 block mx-auto rounded-full border text-gray-600 hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .dragging {
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export default CafeDashboard;
