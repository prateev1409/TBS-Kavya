import { useRef, useState } from "react";

function BooksSection({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    author: "",
    publisher: "",
    language: "",
    genre: "",
  });

  // Drag scroll variables
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    scrollRef.current.style.userSelect = "none";
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    scrollRef.current.style.userSelect = "auto";
  };

  const handleMouseUp = () => {
    isDown.current = false;
    scrollRef.current.style.userSelect = "auto";
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Adjust the multiplier to control speed
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const filteredData = data.filter((book) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (book.name.toLowerCase().includes(searchLower) ||
        book.id.toLowerCase().includes(searchLower)) &&
      (filter.author === "" || book.author === filter.author) &&
      (filter.publisher === "" || book.publisher === filter.publisher) &&
      (filter.language === "" || book.language === filter.language) &&
      (filter.genre === "" || book.genre === filter.genre)
    );
  });

  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap mb-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filter.author}
          onChange={(e) =>
            setFilter({ ...filter, author: e.target.value })
          }
        >
          <option value="">Filter by Author</option>
          <option value="F. Scott Fitzgerald">F. Scott Fitzgerald</option>
          <option value="Author 2">Author 2</option>
        </select>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filter.publisher}
          onChange={(e) =>
            setFilter({ ...filter, publisher: e.target.value })
          }
        >
          <option value="">Filter by Publisher</option>
          <option value="Scribner">Scribner</option>
          <option value="Publisher 2">Publisher 2</option>
        </select>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filter.genre}
          onChange={(e) =>
            setFilter({ ...filter, genre: e.target.value })
          }
        >
          <option value="">Filter by Genre</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
        </select>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filter.language}
          onChange={(e) =>
            setFilter({ ...filter, language: e.target.value })
          }
        >
          <option value="">Filter by Language</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Bengali">Bengali</option>
        </select>
      </div>

      {/* Table Container with Drag-to-Scroll */}
      <div
        className="overflow-x-auto cursor-grab"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 whitespace-nowrap">
              <th className="px-4 py-3 text-left">Book_Id</th>
              <th className="px-4 py-3 text-left">Is Free</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Author</th>
              <th className="px-4 py-3 text-left">Language</th>
              <th className="px-4 py-3 text-left">Publisher</th>
              <th className="px-4 py-3 text-left">Genre</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Image URL</th>
              <th className="px-4 py-3 text-left">Audio URL</th>
              <th className="px-4 py-3 text-left">Ratings</th>
              <th className="px-4 py-3 text-left">Available</th>
              <th className="px-4 py-3 text-left">Keeper ID</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Updated At</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((book, idx) => (
              <tr key={idx} className="border-t whitespace-nowrap">
                <td className="px-4 py-3">{book.id}</td>
                <td className="px-4 py-3">{book.is_free ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{book.name}</td>
                <td className="px-4 py-3">{book.author}</td>
                <td className="px-4 py-3">{book.language}</td>
                <td className="px-4 py-3">{book.publisher}</td>
                <td className="px-4 py-3">{book.genre}</td>
                <td className="px-4 py-3">{book.description}</td>
                <td className="px-4 py-3">{book.image_url}</td>
                <td className="px-4 py-3">{book.audio_url}</td>
                <td className="px-4 py-3">{book.ratings}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      book.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.available ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">{book.keeper_id}</td>
                <td className="px-4 py-3">
                  {new Date(book.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {new Date(book.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    Edit
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

export default BooksSection;
