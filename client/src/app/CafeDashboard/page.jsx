"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import QRScanner from "../scanner/page";

function CafeDashboard() {
    const { user, setUser, refreshToken } = useAuth();
    const [cafeDetails, setCafeDetails] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(false); // Separate loading state for transactions
    const [error, setError] = useState(null);

    const [editForm, setEditForm] = useState({ name: '', discount: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Use a ref to prevent re-fetching on every render
    const hasFetchedUserAndCafe = useRef(false);

    // Fetch user profile and cafe details
    const fetchUserAndCafeData = useCallback(async () => {
        let token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            window.location.href = '/auth/signin';
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Fetch user profile only if not already set
            let userData = user;
            if (!userData) {
                console.log('Fetching user profile...');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.status === 401) {
                    console.log('Token expired, refreshing token...');
                    token = await refreshToken();
                    if (!token) {
                        setError('Failed to refresh token. Please log in again.');
                        window.location.href = '/auth/signin';
                        setLoading(false);
                        return;
                    }
                    localStorage.setItem('token', token);
                    console.log('Retrying user profile fetch with new token...');
                    const retryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!retryRes.ok) throw new Error('Failed to fetch user profile after token refresh');
                    userData = await retryRes.json();
                } else {
                    if (!res.ok) throw new Error('Failed to fetch user profile');
                    userData = await res.json();
                }
                console.log('User profile fetched:', userData);
                setUser(userData);
            }

            if (userData.role !== 'cafe') {
                setError('Access denied. Cafe owner role required.');
                setLoading(false);
                return;
            }

            // Fetch cafe details using cafe_owner_id
            console.log('Fetching cafe details for cafe_owner_id:', userData.user_id);
            const cafeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes?cafe_owner_id=${userData.user_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (cafeRes.status === 401) {
                console.log('Token expired, refreshing token for cafe fetch...');
                token = await refreshToken();
                if (!token) {
                    setError('Failed to refresh token. Please log in again.');
                    window.location.href = '/auth/signin';
                    setLoading(false);
                    return;
                }
                localStorage.setItem('token', token);
                console.log('Retrying cafe fetch with new token...');
                const retryCafeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes?cafe_owner_id=${userData.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!retryCafeRes.ok) {
                    const errorData = await retryCafeRes.json();
                    throw new Error(`Failed to fetch cafe details after token refresh: ${errorData.error || retryCafeRes.statusText}`);
                }
                const cafes = await retryCafeRes.json();
                console.log('Cafes fetched after retry:', cafes);
                if (cafes.length === 0) {
                    setError('No cafe assigned to this owner.');
                    setLoading(false);
                    return;
                }
                const cafe = cafes[0];
                setCafeDetails(cafe);
                setEditForm({ name: cafe.name, discount: cafe.discount });
            } else {
                if (!cafeRes.ok) {
                    const errorData = await cafeRes.json();
                    throw new Error(`Failed to fetch cafe details: ${errorData.error || cafeRes.statusText}`);
                }
                const cafes = await cafeRes.json();
                console.log('Cafes fetched:', cafes);
                if (cafes.length === 0) {
                    setError('No cafe assigned to this owner.');
                    setLoading(false);
                    return;
                }
                const cafe = cafes[0];
                setCafeDetails(cafe);
                setEditForm({ name: cafe.name, discount: cafe.discount });
            }
        } catch (err) {
            console.error('Error in fetchUserAndCafeData:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user, setUser, refreshToken]);

    // Fetch user and cafe data only once on mount
    useEffect(() => {
        if (hasFetchedUserAndCafe.current) return;
        hasFetchedUserAndCafe.current = true;
        fetchUserAndCafeData();
    }, [fetchUserAndCafeData]); // Depend on the function, not user or refreshToken

    // Fetch transactions only after cafeDetails is set
    const fetchTransactions = useCallback(async () => {
        if (!cafeDetails || error || loadingTransactions) return; // Prevent fetching if already in progress
        let token = localStorage.getItem('token');
        try {
            setLoadingTransactions(true);
            console.log('Fetching transactions for cafe_id:', cafeDetails.cafe_id);
            const txRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafe/${cafeDetails.cafe_id}/requests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (txRes.status === 401) {
                console.log('Token expired, refreshing token for transaction fetch...');
                token = await refreshToken();
                if (!token) {
                    setError('Failed to refresh token. Please log in again.');
                    window.location.href = '/auth/signin';
                    setLoadingTransactions(false);
                    return;
                }
                localStorage.setItem('token', token);
                console.log('Retrying transaction fetch with new token...');
                const retryTxRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafe/${cafeDetails.cafe_id}/requests`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!retryTxRes.ok) {
                    const errorData = await retryTxRes.json();
                    throw new Error(`Failed to fetch transactions after token refresh: ${errorData.error || retryTxRes.statusText}`);
                }
                const txData = await retryTxRes.json();
                setTransactions(txData);
            } else {
                if (!txRes.ok) {
                    const errorData = await txRes.json();
                    throw new Error(`Failed to fetch transactions: ${errorData.error || txRes.statusText}`);
                }
                const txData = await txRes.json();
                setTransactions(txData);
            }
        } catch (err) {
            console.error('Error in fetchTransactions:', err.message);
            setError(err.message);
        } finally {
            setLoadingTransactions(false);
        }
    }, [cafeDetails, error, refreshToken]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]); // Depend on the function, not cafeDetails or error

    // Add controlled polling for transactions (every 30 seconds)
    useEffect(() => {
        if (!cafeDetails || error) return;

        const interval = setInterval(() => {
            fetchTransactions();
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval); // Clear interval on unmount
    }, [fetchTransactions, cafeDetails, error]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const handleSave = async () => {
        let token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes/${cafeDetails.cafe_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: editForm.name, discount: Number(editForm.discount) }),
            });
            if (res.status === 401) {
                token = await refreshToken();
                if (!token) {
                    setError('Failed to refresh token. Please log in again.');
                    window.location.href = '/auth/signin';
                    setLoading(false);
                    return;
                }
                localStorage.setItem('token', token);
                const retryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes/${cafeDetails.cafe_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: editForm.name, discount: Number(editForm.discount) }),
                });
                if (!retryRes.ok) throw new Error('Failed to update cafe after token refresh');
                const updatedCafe = await retryRes.json();
                setCafeDetails(updatedCafe.cafe);
                setIsEditing(false);
            } else {
                if (!res.ok) throw new Error('Failed to update cafe');
                const updatedCafe = await res.json();
                setCafeDetails(updatedCafe.cafe);
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Error in handleSave:', err.message);
            setError(err.message);
        }
    };

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

    const [showScannerModal, setShowScannerModal] = useState(false);
    const [scannerMessage, setScannerMessage] = useState(null);
    const [scannedCodes, setScannedCodes] = useState({ first: "", second: "" });

    const extractAlpha = (str) => {
        if (!str) return "";
        const parts = str.split("_");
        return parts[0] || "";
    };

    const handleScanned = async ({ firstCode, secondCode }) => {
        setScannedCodes({ first: firstCode, second: secondCode });
        let token = localStorage.getItem('token');
    
        // Parse first QR code: "transactionId.user_id"
        const parts = firstCode.split(".");
        if (parts.length !== 2) {
            setScannerMessage("Invalid format for first QR code.");
            return;
        }
        const scannedTransactionId = parts[0]; // Keep as string: "TXN_1742751402350_bk5arw"
        const scannedUserId = parts[1]; // "User_001"
    
        // Find the pending transaction locally
        const pendingTx = transactions.find(
            (tx) => tx.transaction_id === scannedTransactionId && ['pickup_pending', 'dropoff_pending'].includes(tx.status)
        );
        if (!pendingTx) {
            setScannerMessage("Transaction not found or not pending.");
            return;
        }
    
        // Helper to extract alphabetic prefix from book_id
        const extractAlpha = (str) => {
            if (!str) return "";
            const parts = str.split("_");
            return parts[0] || "";
        };
    
        try {
            if (pendingTx.status === "pickup_pending") {
                // Step 1: Verify the book QR code (secondCode) by prefix
                const bookIdToVerify = pendingTx.book_id.book_id || pendingTx.book_id; // Handle nested or flat book_id
                const scannedBookPrefix = extractAlpha(secondCode); // e.g., "HOTD" from "HOTD_3"
                const expectedBookPrefix = extractAlpha(bookIdToVerify); // e.g., "HOTD" from "HOTD_1"
                if (scannedBookPrefix !== expectedBookPrefix) {
                    setScannerMessage("Scanned book QR code prefix does not match transaction.");
                    return;
                }
    
                // Use the scanned book_id (secondCode) for the API call if it's different
                const bookRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/scan/book/${secondCode}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (bookRes.status === 401) {
                    token = await refreshToken();
                    if (!token) {
                        setError('Failed to refresh token. Please log in again.');
                        window.location.href = '/auth/signin';
                        return;
                    }
                    localStorage.setItem('token', token);
                    const retryBookRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/scan/book/${secondCode}`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!retryBookRes.ok) throw new Error('Failed to verify book QR after token refresh');
                    await retryBookRes.json();
                } else if (!bookRes.ok) {
                    const errorData = await bookRes.json();
                    throw new Error(`Failed to verify book QR: ${errorData.error || bookRes.statusText}`);
                }
    
                // Step 2: Approve pickup with user QR code
                const approveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/scan/user/${scannedUserId}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (approveRes.status === 401) {
                    token = await refreshToken();
                    if (!token) {
                        setError('Failed to refresh token. Please log in again.');
                        window.location.href = '/auth/signin';
                        return;
                    }
                    localStorage.setItem('token', token);
                    const retryApproveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/scan/user/${scannedUserId}`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!retryApproveRes.ok) throw new Error('Failed to approve pickup after token refresh');
                    const approveData = await retryApproveRes.json();
                    setTransactions((prev) =>
                        prev.map((tx) =>
                            tx.transaction_id === scannedTransactionId
                                ? { ...tx, status: 'picked_up', book_id: secondCode, processed_at: new Date() }
                                : tx
                        )
                    );
                    setScannerMessage("Pickup transaction approved!");
                } else if (!approveRes.ok) {
                    const errorData = await approveRes.json();
                    throw new Error(`Failed to approve pickup: ${errorData.error || approveRes.statusText}`);
                } else {
                    const approveData = await approveRes.json();
                    setTransactions((prev) =>
                        prev.map((tx) =>
                            tx.transaction_id === scannedTransactionId
                                ? { ...tx, status: 'picked_up', book_id: secondCode, processed_at: new Date() }
                                : tx
                        )
                    );
                    setScannerMessage("Pickup transaction approved!");
                }
            } else if (pendingTx.status === "dropoff_pending") {
                // Validate both QR codes match the transaction
                const expectedFirstCode = `${pendingTx.transaction_id}.${pendingTx.user_id.user_id || pendingTx.user_id}`;
                const expectedSecondCode = pendingTx.book_id.book_id || pendingTx.book_id;
                if (firstCode !== expectedFirstCode || secondCode !== expectedSecondCode) {
                    setScannerMessage("Scanned QR codes do not match transaction.");
                    return;
                }
    
                const completeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/complete/${scannedTransactionId}`, {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (completeRes.status === 401) {
                    token = await refreshToken();
                    if (!token) {
                        setError('Failed to refresh token. Please log in again.');
                        window.location.href = '/auth/signin';
                        return;
                    }
                    localStorage.setItem('token', token);
                    const retryCompleteRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/complete/${scannedTransactionId}`, {
                        method: 'PUT',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!retryCompleteRes.ok) throw new Error('Failed to complete drop-off after token refresh');
                    const completeData = await retryCompleteRes.json();
                    setTransactions((prev) =>
                        prev.map((tx) =>
                            tx.transaction_id === scannedTransactionId ? { ...tx, status: 'dropped_off', processed_at: new Date() } : tx
                        )
                    );
                    setScannerMessage("Dropoff transaction approved!");
                } else if (!completeRes.ok) {
                    const errorData = await completeRes.json();
                    throw new Error(`Failed to complete drop-off: ${errorData.error || completeRes.statusText}`);
                } else {
                    const completeData = await completeRes.json();
                    setTransactions((prev) =>
                        prev.map((tx) =>
                            tx.transaction_id === scannedTransactionId ? { ...tx, status: 'dropped_off', processed_at: new Date() } : tx
                        )
                    );
                    setScannerMessage("Dropoff transaction approved!");
                }
            }
    
            // Refresh transactions to ensure consistency
            await fetchTransactions();
        } catch (err) {
            console.error('Error in handleScanned:', err.message);
            setScannerMessage(`Error: ${err.message}`);
        }
    
        setTimeout(() => {
            setShowScannerModal(false);
            setScannerMessage(null);
            setScannedCodes({ first: "", second: "" });
        }, 1500);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
    if (!cafeDetails) return <div className="min-h-screen flex items-center justify-center">No cafe data available.</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Cafe Dashboard</h1>
                    <button
                        
                        className="px-4 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700"
                        >
                            <a
                            href="/auth/logout"
                            >   
                                Log Out
                            </a>
                        </button>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Cafe Details</h2>
                    <div className="space-y-2">
                        <p><span className="font-semibold">Cafe ID:</span> {cafeDetails.cafe_id}</p>
                        <p><span className="font-semibold">Location:</span> {cafeDetails.location}</p>
                        <p><span className="font-semibold">Average Bill:</span> ₹{cafeDetails.average_bill}</p>
                        <p><span className="font-semibold">Ratings:</span> {cafeDetails.ratings}</p>
                        <p><span className="font-semibold">Specials:</span> {cafeDetails.specials || 'N/A'}</p>
                    </div>
                    <div className="mt-6 border-t pt-4">
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-1 font-medium">Cafe Name</label>
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
                            <label htmlFor="discount" className="block mb-1 font-medium">Discount</label>
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
                                {loadingTransactions ? (
                                    <tr>
                                        <td className="px-4 py-3 text-center" colSpan="5">Loading transactions...</td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-3 text-center" colSpan="5">No pending transactions.</td>
                                    </tr>
                                ) : (
                                    transactions.map((tx, idx) => (
                                        <tr key={idx} className="border-t whitespace-nowrap">
                                            <td className="px-4 py-3">{tx.transaction_id}</td>
                                            <td className="px-4 py-3">{tx.book_id?.book_id || tx.book_id || 'N/A'}</td>
                                            <td className="px-4 py-3">{tx.user_id?.user_id || tx.user_id || 'N/A'}</td>
                                            <td className="px-4 py-3">{tx.status.replace("_", " ")}</td>
                                            <td className="px-4 py-3">{new Date(tx.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showScannerModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setShowScannerModal(false);
                        }}
                    >
                        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
                            <h2 className="text-2xl font-bold mb-4 text-center">Scan Transaction QR Codes</h2>
                            <div className="overflow-auto" style={{ maxHeight: "60vh" }}>
                                <QRScanner onScanned={handleScanned} />
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-700"><strong>First QR Code:</strong> {scannedCodes.first}</p>
                                <p className="text-sm text-gray-700"><strong>Second QR Code:</strong> {scannedCodes.second}</p>
                            </div>
                            {scannerMessage && (
                                <div className="mt-4 bg-green-50 text-green-700 p-2 rounded-lg text-center">{scannerMessage}</div>
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
        </div>
    );
}

export default CafeDashboard;