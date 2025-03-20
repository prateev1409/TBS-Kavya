"use client";
import { useEffect, useRef, useState } from "react";
import BooksSection from "./BooksSection";
import CafesSection from "./CafesSection";
import TransactionsSection from "./TransactionsSection";
import UsersSection from "./UsersSection";
import { useAuth } from "../Hooks/useAuth";

function AdminDashboard() {
    const { refreshToken } = useAuth();
    const [books, setBooks] = useState([]);
    const [cafes, setCafes] = useState([]);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState("books");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state

    const modalScrollRef = useRef(null);
    const modalIsDown = useRef(false);
    const modalStartX = useRef(0);
    const modalScrollLeft = useRef(0);

    // Fetch data on mount
    useEffect(() => {
        const abortController = new AbortController(); // Create an AbortController for cleanup
        const fetchData = async () => {
            if (loading) return; // Prevent multiple fetches
            setLoading(true);
            try {
                let token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/auth/signin';
                    return;
                }

                // Check if token is valid, refresh if needed
                const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: abortController.signal, // Add abort signal
                });
                if (!profileRes.ok) {
                    if (profileRes.status === 401) {
                        token = await refreshToken();
                        if (!token) {
                            throw new Error('Failed to refresh token');
                        }
                    } else {
                        const errorData = await profileRes.json();
                        throw new Error(`Invalid token: ${errorData.error || profileRes.statusText}`);
                    }
                }
                const userData = await profileRes.json();
                if (userData.role !== 'admin') {
                    throw new Error('Admin access required');
                }

                const booksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/inventory`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: abortController.signal,
                });
                if (!booksRes.ok) {
                    const errorData = await booksRes.json();
                    throw new Error(`Failed to fetch books: ${errorData.error || booksRes.statusText}`);
                }
                const booksData = await booksRes.json();
                setBooks(booksData);

                const cafesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: abortController.signal,
                });
                if (!cafesRes.ok) {
                    const errorData = await cafesRes.json();
                    throw new Error(`Failed to fetch cafes: ${errorData.error || cafesRes.statusText}`);
                }
                const cafesData = await cafesRes.json();
                setCafes(cafesData);

                const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: abortController.signal,
                });
                if (!usersRes.ok) {
                    const errorData = await usersRes.json();
                    throw new Error(`Failed to fetch users: ${errorData.error || usersRes.statusText}`);
                }
                const usersData = await usersRes.json();
                setUsers(usersData);

                const transactionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: abortController.signal,
                });
                if (!transactionsRes.ok) {
                    const errorData = await transactionsRes.json();
                    throw new Error(`Failed to fetch transactions: ${errorData.error || transactionsRes.statusText}`);
                }
                const transactionsData = await transactionsRes.json();
                setTransactions(transactionsData);
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                    return;
                }
                setError(err.message);
                if (err.message.includes('Invalid token') || err.message.includes('Admin access required')) {
                    localStorage.removeItem('token');
                    window.location.href = '/auth/signin';
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup: Abort fetch requests on unmount
        return () => {
            abortController.abort();
        };
    }, []); // Remove refreshToken from dependency array

    const handleModalMouseDown = (e) => {
        modalIsDown.current = true;
        modalScrollRef.current.classList.add("dragging");
        modalStartX.current = e.pageX - modalScrollRef.current.offsetLeft;
        modalScrollLeft.current = modalScrollRef.current.scrollLeft;
    };

    const handleModalMouseLeave = () => {
        modalIsDown.current = false;
        modalScrollRef.current.classList.remove("dragging");
    };

    const handleModalMouseUp = () => {
        modalIsDown.current = false;
        modalScrollRef.current.classList.remove("dragging");
    };

    const handleModalMouseMove = (e) => {
        if (!modalIsDown.current) return;
        e.preventDefault();
        const x = e.pageX - modalScrollRef.current.offsetLeft;
        const walk = (x - modalStartX.current) * 2;
        modalScrollRef.current.scrollLeft = modalScrollLeft.current - walk;
    };

    const getModalFields = () => {
        if (activeTab === "books") {
            return [
                { name: "name", label: "Book Name *", type: "text" },
                { name: "author", label: "Author *", type: "text" },
                { name: "language", label: "Language *", type: "text" },
                { name: "publisher", label: "Publisher", type: "text" },
                { name: "genre", label: "Genre", type: "text" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "image_url", label: "Image URL", type: "text" },
                { name: "audio_url", label: "Audio URL", type: "text" },
                { name: "ratings", label: "Ratings (0-5)", type: "number", min: 0, max: 5 },
                { name: "available", label: "Available", type: "checkbox" },
                { name: "is_free", label: "Is Free", type: "checkbox" },
                { name: "keeper_id", label: "Keeper ID", type: "text" },
            ];
        } else if (activeTab === "cafes") {
            return [
                { name: "name", label: "Cafe Name", type: "text" },
                { name: "location", label: "Location", type: "text" },
                { name: "average_bill", label: "Average Bill", type: "number" },
                { name: "discount", label: "Discount", type: "number" },
                { name: "ratings", label: "Ratings", type: "number" },
                { name: "specials", label: "Specials", type: "text" },
            ];
        } else if (activeTab === "users") {
            return [
                { name: "name", label: "User Name", type: "text" },
                { name: "email", label: "Email", type: "email" },
                { name: "phone_number", label: "Phone Number", type: "text" },
                { name: "password", label: "Password", type: "password" },
                { name: "subscription_type", label: "Subscription Type", type: "text" },
                { name: "role", label: "Role", type: "text" },
            ];
        }
        return [];
    };

    const getModalTitle = () => {
        if (isEditing) {
            if (activeTab === "books") return "Edit Book";
            if (activeTab === "cafes") return "Edit Cafe";
            if (activeTab === "users") return "Edit User";
        } else {
            if (activeTab === "books") return "Add Book";
            if (activeTab === "cafes") return "Add Cafe";
            if (activeTab === "users") return "Add User";
        }
        return "";
    };

    const openAddModal = () => {
        if (activeTab === "books") {
            setFormValues({
                name: '',
                author: '',
                language: '',
                available: true,
                is_free: false,
                ratings: 0
            });
        } else {
            setFormValues({});
        }
        setIsEditing(false);
        setEditItemId(null);
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setFormValues(item);
        setIsEditing(true);
        setEditItemId(activeTab === "books" ? item.id : activeTab === "cafes" ? item.cafe_id : item.user_id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditItemId(null);
        setFormValues({});
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            window.location.href = '/auth/signin';
            return;
        }

        try {
            let url;
            let method;
            if (activeTab === "books") {
                url = isEditing
                    ? `${process.env.NEXT_PUBLIC_API_URL}/books/${editItemId}`
                    : `${process.env.NEXT_PUBLIC_API_URL}/admin/books`;
                method = isEditing ? 'PUT' : 'POST';
            } else {
                url = isEditing
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${activeTab}/${editItemId}`
                    : `${process.env.NEXT_PUBLIC_API_URL}/${activeTab}`;
                method = isEditing ? 'PUT' : 'POST';
            }

            const bookData = {
                name: formValues.name,
                author: formValues.author,
                language: formValues.language,
                publisher: formValues.publisher || undefined,
                genre: formValues.genre || undefined,
                description: formValues.description || undefined,
                image_url: formValues.image_url || undefined,
                audio_url: formValues.audio_url || undefined,
                ratings: Number(formValues.ratings) || 0,
                is_free: formValues.is_free || false,
                available: formValues.available !== undefined ? formValues.available : true,
                keeper_id: formValues.keeper_id || undefined,
            };

            console.log('Sending request to:', url); // Debug log
            console.log('Request body:', bookData); // Debug log

            let res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookData),
            });

            // If the request fails due to an invalid token, try refreshing the token
            if (res.status === 401) {
                token = await refreshToken();
                if (!token) {
                    throw new Error('Failed to refresh token');
                }
                // Retry the request with the new token
                res = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(bookData),
                });
            }

            console.log('Response status:', res.status); // Debug log
            console.log('Response headers:', res.headers.get('content-type')); // Debug log

            if (!res.ok) {
                const contentType = res.headers.get('content-type');
                let errorMessage = `Failed to ${isEditing ? 'update' : 'add'} ${activeTab.slice(0, -1)}: ${res.statusText} (${res.status})`;
                
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await res.json();
                    errorMessage = `Failed to ${isEditing ? 'update' : 'add'} ${activeTab.slice(0, -1)}: ${errorData.error || res.statusText} (${res.status})`;
                } else {
                    const text = await res.text();
                    console.log('Raw response:', text); // Debug log
                    errorMessage = `Failed to ${isEditing ? 'update' : 'add'} ${activeTab.slice(0, -1)}: Received non-JSON response (${res.status})`;
                }
                throw new Error(errorMessage);
            }

            const responseData = await res.json();
            console.log('Response data:', responseData); // Debug log

            if (isEditing) {
                if (activeTab === "books") {
                    setBooks(books.map(book => 
                        book.id === editItemId ? { ...book, ...responseData.book } : book
                    ));
                } else if (activeTab === "cafes") {
                    setCafes(cafes.map(cafe => 
                        cafe.cafe_id === editItemId ? responseData.cafe : cafe
                    ));
                } else if (activeTab === "users") {
                    setUsers(users.map(user => 
                        user.user_id === editItemId ? responseData.user : user
                    ));
                }
            } else {
                if (activeTab === "books") {
                    setBooks([...books, responseData.book]);
                } else if (activeTab === "cafes") {
                    setCafes([...cafes, responseData.cafe]);
                } else if (activeTab === "users") {
                    setUsers([...users, responseData.user]);
                }
            }
            closeModal();
        } catch (err) {
            console.error('Error in handleFormSubmit:', err); // Debug log
            setError(err.message);
            if (err.message.includes('Invalid token') || err.message.includes('Unauthorized')) {
                localStorage.removeItem('token');
                window.location.href = '/auth/signin';
            }
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Admin Dashboard
                </h1>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-4">
                        {["books", "cafes", "users", "transactions"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                    activeTab === tab
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    {activeTab !== "transactions" && (
                        <button
                            onClick={openAddModal}
                            className="px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700"
                        >
                            {activeTab === "books" ? "Add Book" : activeTab === "cafes" ? "Add Cafe" : "Add User"}
                        </button>
                    )}
                </div>

                {activeTab === "books" && <BooksSection data={books} setData={setBooks} onEdit={openEditModal} />}
                {activeTab === "cafes" && <CafesSection data={cafes} setData={setCafes} onEdit={openEditModal} />}
                {activeTab === "users" && <UsersSection data={users} setData={setUsers} onEdit={openEditModal} />}
                {activeTab === "transactions" && <TransactionsSection data={transactions} />}
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-hidden">
                        <h2 className="text-2xl font-bold mb-4">{getModalTitle()}</h2>
                        <div
                            className="overflow-auto cursor-grab"
                            ref={modalScrollRef}
                            onMouseDown={handleModalMouseDown}
                            onMouseLeave={handleModalMouseLeave}
                            onMouseUp={handleModalMouseUp}
                            onMouseMove={handleModalMouseMove}
                            style={{ maxHeight: "60vh" }}
                        >
                            <form onSubmit={handleFormSubmit}>
                                {getModalFields().map((field) => (
                                    <div className="mb-4" key={field.name}>
                                        {field.type === "checkbox" ? (
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id={field.name}
                                                    name={field.name}
                                                    type={field.type}
                                                    onChange={handleInputChange}
                                                    className="w-6 h-6"
                                                    checked={formValues[field.name] || false}
                                                />
                                                <label className="font-medium" htmlFor={field.name}>
                                                    {field.label}
                                                </label>
                                            </div>
                                        ) : (
                                            <>
                                                <label className="block mb-1 font-medium" htmlFor={field.name}>
                                                    {field.label}
                                                </label>
                                                {field.type === "textarea" ? (
                                                    <textarea
                                                        id={field.name}
                                                        name={field.name}
                                                        value={formValues[field.name] || ""}
                                                        onChange={handleInputChange}
                                                        className="w-full border px-3 py-2 rounded-lg"
                                                        required={field.label.includes('*')}
                                                    />
                                                ) : (
                                                    <input
                                                        id={field.name}
                                                        name={field.name}
                                                        type={field.type}
                                                        value={formValues[field.name] || ""}
                                                        onChange={handleInputChange}
                                                        className="w-full border px-3 py-2 rounded-lg"
                                                        required={field.label.includes('*')}
                                                        min={field.min}
                                                        max={field.max}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        {isEditing ? "Update" : "Submit"}
                                    </button>
                                </div>
                            </form>
                        </div>
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

export default AdminDashboard;