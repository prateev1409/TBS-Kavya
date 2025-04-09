import { useEffect, useState } from "react";

function TransactionsSection({ data, setData }) { // Add setData as a prop
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState({
        status: "",
    });
    const [filterOptions, setFilterOptions] = useState({
        statuses: [],
    });
    const [approvingTxId, setApprovingTxId] = useState(null); // Track which transaction is being approved
    const [bookIdInput, setBookIdInput] = useState(""); // Store book_id input

    // Fetch filter values dynamically on component mount
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/filters`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch transaction filters');
                const data = await res.json();
                setFilterOptions(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFilters();
    }, []);

    // Handle transaction approval
    const handleApproveTransaction = async (transaction_id) => {
        if (!bookIdInput) {
            alert("Please enter a Book ID to approve the transaction.");
            return;
        }

        setApprovingTxId(transaction_id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/transactions/approve/${transaction_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ book_id: bookIdInput }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Failed to approve transaction: ${errorData.error || res.statusText}`);
            }

            const updatedTransaction = await res.json();
            // Update the transactions state with the approved transaction
            setData((prevData) =>
                prevData.map((tx) =>
                    tx.transaction_id === transaction_id ? { ...tx, status: 'picked_up', processed_at: new Date() } : tx
                )
            );
            setBookIdInput(""); // Clear input after success
            alert("Transaction approved successfully!");
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setApprovingTxId(null);
        }
    };

    // Filter transactions based on search query and status filter (case-insensitive)
    const filteredData = data.filter((tx) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (tx.transaction_id.toString().includes(searchLower) ||
                (typeof tx.book_id === 'string' ? tx.book_id.toLowerCase().includes(searchLower) : false) ||
                (typeof tx.user_id === 'string' ? tx.user_id.toLowerCase().includes(searchLower) : false) ||
                (typeof tx.cafe_id === 'string' ? tx.cafe_id.toLowerCase().includes(searchLower) : false)) &&
            (filter.status === "" || tx.status.toLowerCase() === filter.status.toLowerCase())
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
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                >
                    <option value="">Filter by Status</option>
                    {filterOptions.statuses.map((status, idx) => (
                        <option key={idx} value={status}>
                            {status.replace("_", " ")}
                        </option>
                    ))}
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
                                <td className="px-4 py-3">{typeof tx.book_id === 'string' ? tx.book_id : tx.book_id?.book_id || 'N/A'}</td>
                                <td className="px-4 py-3">{typeof tx.user_id === 'string' ? tx.user_id : tx.user_id?.user_id || 'N/A'}</td>
                                <td className="px-4 py-3">{typeof tx.cafe_id === 'string' ? tx.cafe_id : tx.cafe_id?.cafe_id || 'N/A'}</td>
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
                                <td className="px-4 py-3 flex space-x-2">
                                    <button className="text-blue-600 hover:text-blue-800">
                                        View
                                    </button>
                                    {tx.status === "pickup_pending" && (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                placeholder="Enter Book ID"
                                                value={bookIdInput}
                                                onChange={(e) => setBookIdInput(e.target.value)}
                                                className="border px-2 py-1 rounded-lg text-sm"
                                            />
                                            <button
                                                onClick={() => handleApproveTransaction(tx.transaction_id)}
                                                disabled={approvingTxId === tx.transaction_id}
                                                className={`text-white px-2 py-1 rounded-lg ${
                                                    approvingTxId === tx.transaction_id
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-green-600 hover:bg-green-700"
                                                }`}
                                            >
                                                {approvingTxId === tx.transaction_id ? "Approving..." : "Approve"}
                                            </button>
                                        </div>
                                    )}
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