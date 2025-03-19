"use client";
import { useRef, useState } from "react";
import BooksSection from "./BooksSection";
import CafesSection from "./CafesSection";
import TransactionsSection from "./TransactionsSection";
import UsersSection from "./UsersSection";

function AdminDashboard() {
  // Initial dummy data
  const initialBooks = [
    {
      id: "book_001",
      is_free: false,
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      language: "English",
      publisher: "Scribner",
      genre: "Fiction",
      description: "A classic novel",
      image_url: "https://example.com/gatsby.jpg",
      audio_url: "https://example.com/gatsby.mp3",
      ratings: 4.5,
      available: true,
      keeper_id: "cafe_001",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  const initialCafes = [
    {
      cafe_id: "cafe_001",
      name: "Reading Room Café",
      location: "New Town, Kolkata",
      average_bill: 250,
      discount: 10,
      ratings: 4.2,
      specials: "Weekend discounts",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  const initialUsers = [
    {
      user_id: "user_001",
      name: "John Doe",
      email: "john@example.com",
      phone_number: "+91-9876543210",
      subscription_validity: new Date().toISOString(),
      subscription_type: "premium",
      book_id: null,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  const initialTransactions = [
    {
      transaction_id: 1001,
      book_id: "book_001",
      user_id: "user_001",
      cafe_id: "cafe_001",
      status: "picked_up",
      created_at: "2024-01-20T10:30:00Z",
    },
  ];

  // Data state
  const [books, setBooks] = useState(initialBooks);
  const [cafes, setCafes] = useState(initialCafes);
  const [users, setUsers] = useState(initialUsers);
  const [transactions] = useState(initialTransactions);

  const [activeTab, setActiveTab] = useState("books");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  // Modal form values for the current type. For Books, we want available checked by default.
  const [formValues, setFormValues] = useState({});

  // Refs and drag state for modal scroll container
  const modalScrollRef = useRef(null);
  const modalIsDown = useRef(false);
  const modalStartX = useRef(0);
  const modalScrollLeft = useRef(0);

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

  // Determine modal fields based on active tab
  const getModalFields = () => {
    if (activeTab === "books") {
      return [
        { name: "name", label: "Book Name", type: "text" },
        { name: "author", label: "Author", type: "text" },
        { name: "language", label: "Language", type: "text" },
        { name: "publisher", label: "Publisher", type: "text" },
        { name: "genre", label: "Genre", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "image_url", label: "Image URL", type: "text" },
        { name: "audio_url", label: "Audio URL", type: "text" },
        { name: "ratings", label: "Ratings", type: "number" },
        // For checkboxes, we'll display the label and input inline.
        { name: "available", label: "Available", type: "checkbox" },
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
        { name: "subscription_type", label: "Subscription Type", type: "text" },
        { name: "role", label: "Role", type: "text" },
      ];
    }
    return [];
  };

  const getAddButtonLabel = () => {
    if (activeTab === "books") return "Add Book";
    if (activeTab === "cafes") return "Add Cafe";
    if (activeTab === "users") return "Add User";
    return "";
  };

  const openModal = () => {
    // For books, default available to true.
    if (activeTab === "books") {
      setFormValues({ available: true });
    } else {
      setFormValues({});
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Handle modal form changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();

    if (activeTab === "books") {
      const newBook = {
        id: `book_${books.length + 1}`,
        is_free: false,
        name: formValues.name || "New Book",
        author: formValues.author || "",
        language: formValues.language || "",
        publisher: formValues.publisher || "",
        genre: formValues.genre || "",
        description: formValues.description || "",
        image_url: formValues.image_url || "",
        audio_url: formValues.audio_url || "",
        ratings: Number(formValues.ratings) || 0,
        available:
          formValues.available !== undefined ? formValues.available : true,
        keeper_id: formValues.keeper_id || "",
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      setBooks([...books, newBook]);
    } else if (activeTab === "cafes") {
      const newCafe = {
        cafe_id: `cafe_${cafes.length + 1}`,
        name: formValues.name || "New Cafe",
        location: formValues.location || "",
        average_bill: Number(formValues.average_bill) || 0,
        discount: Number(formValues.discount) || 0,
        ratings: Number(formValues.ratings) || 0,
        specials: formValues.specials || "",
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      setCafes([...cafes, newCafe]);
    } else if (activeTab === "users") {
      const newUser = {
        user_id: `user_${users.length + 1}`,
        name: formValues.name || "New User",
        email: formValues.email || "",
        phone_number: formValues.phone_number || "",
        subscription_validity: timestamp,
        subscription_type: formValues.subscription_type || "basic",
        book_id: null,
        role: formValues.role || "user",
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      setUsers([...users, newUser]);
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>
        {/* Tabs and Add Button on Same Line */}
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
          {/* Only show Add button if not transactions */}
          {activeTab !== "transactions" && (
            <button
              onClick={openModal}
              className="px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700"
            >
              {getAddButtonLabel()}
            </button>
          )}
        </div>

        {activeTab === "books" && <BooksSection data={books} />}
        {activeTab === "cafes" && <CafesSection data={cafes} />}
        {activeTab === "users" && <UsersSection data={users} />}
        {activeTab === "transactions" && (
          <TransactionsSection data={transactions} />
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={(e) => {
            // Only close if clicking on the overlay, not the modal content
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-hidden">
            <h2 className="text-2xl font-bold mb-4">{getAddButtonLabel()}</h2>
            {/* Scrollable container with drag-to-scroll for modal form */}
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
                      // Inline layout for checkbox and its label
                      <div className="flex items-center space-x-2">
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          onChange={handleInputChange}
                          className="w-6 h-6"
                          {...{
                            checked:
                              formValues[field.name] !== undefined
                                ? formValues[field.name]
                                : true,
                          }}
                        />
                        <label
                          className="font-medium"
                          htmlFor={field.name}
                        >
                          {field.label}
                        </label>
                      </div>
                    ) : (
                      <>
                        <label
                          className="block mb-1 font-medium"
                          htmlFor={field.name}
                        >
                          {field.label}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded-lg"
                          />
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded-lg"
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
                    Submit
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
