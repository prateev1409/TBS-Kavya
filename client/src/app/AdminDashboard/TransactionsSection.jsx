import { useState } from "react";

function TransactionsSection({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    status: "",
  });

  const filteredData = data.filter((tx) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (tx.transaction_id.toString().includes(searchLower) ||
        tx.book_id.toLowerCase().includes(searchLower) ||
        tx.user_id.toLowerCase().includes(searchLower) ||
        tx.cafe_id.toLowerCase().includes(searchLower)) &&
      (filter.status === "" || tx.status === filter.status)
    );
  });

  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex gap-4 flex-wrap mb-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filter.status}
          onChange={(e) =>
            setFilter({ ...filter, status: e.target.value })
          }
        >
          <option value="">Filter by Status</option>
          <option value="pickup_pending">Pickup Pending</option>
          <option value="picked_up">Picked Up</option>
          <option value="dropoff_pending">Dropoff Pending</option>
          <option value="dropped_off">Dropped Off</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left">Transaction ID</th>
              <th className="px-4 py-3 text-left">Book ID</th>
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Cafe ID</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((tx, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-3">{tx.transaction_id}</td>
                <td className="px-4 py-3">{tx.book_id}</td>
                <td className="px-4 py-3">{tx.user_id}</td>
                <td className="px-4 py-3">{tx.cafe_id}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      tx.status === "picked_up"
                        ? "bg-green-100 text-green-800"
                        : tx.status === "dropped_off"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {tx.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(tx.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsSection;
