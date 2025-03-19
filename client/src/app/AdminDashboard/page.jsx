"use client";
import { useState } from "react";
import BooksSection from "./BooksSection";
import CafesSection from "./CafesSection";
import TransactionsSection from "./TransactionsSection";
import UsersSection from "./UsersSection";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("books");

  const dummyData = {
    books: [
      {
        id: "book_001",
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        language: "English",
        publisher: "Scribner",
        genre: "Fiction",
        keeper_id: "cafe_001",
        available: true,
        ratings: 4.5,
      },
      // Add more books as needed
    ],
    cafes: [
      {
        cafe_id: "cafe_001",
        name: "Reading Room Café",
        location: "New Town, Kolkata",
        average_bill: 250,
        ratings: 4.2,
        discount: 10,
      },
      // Add more cafes as needed
    ],
    users: [
      {
        user_id: "user_001",
        name: "John Doe",
        email: "john@example.com",
        phone_number: "+91-9876543210",
        subscription_type: "premium",
        role: "user",
      },
      // Add more users as needed
    ],
    transactions: [
      {
        transaction_id: 1001,
        book_id: "book_001",
        user_id: "user_001",
        cafe_id: "cafe_001",
        status: "picked_up",
        created_at: "2024-01-20T10:30:00Z",
      },
      // Add more transactions as needed
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>
        <div className="flex space-x-4 mb-6">
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

        {activeTab === "books" && <BooksSection data={dummyData.books} />}
        {activeTab === "cafes" && <CafesSection data={dummyData.cafes} />}
        {activeTab === "users" && <UsersSection data={dummyData.users} />}
        {activeTab === "transactions" && (
          <TransactionsSection data={dummyData.transactions} />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
