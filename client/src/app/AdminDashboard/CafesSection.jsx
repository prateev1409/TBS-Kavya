import { useRef, useState } from "react";

function CafesSection({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    location: "",
    average_bill: "",
    ratings: "",
  });

  // Drag-to-scroll setup
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
    const walk = (x - startX.current) * 2; // adjust multiplier for speed
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const filteredData = data.filter((cafe) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      cafe.name.toLowerCase().includes(searchLower) ||
      cafe.cafe_id.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap mb-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search cafes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filter.location}
          onChange={(e) =>
            setFilter({ ...filter, location: e.target.value })
          }
        >
          <option value="">Filter by Location</option>
          <option value="New Town, Kolkata">New Town, Kolkata</option>
          <option value="Salt Lake">Salt Lake</option>
        </select>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filter.average_bill}
          onChange={(e) =>
            setFilter({ ...filter, average_bill: e.target.value })
          }
        >
          <option value="">Filter by Avg Bill</option>
          <option value="250">₹250</option>
          {/* Add more options as needed */}
        </select>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filter.ratings}
          onChange={(e) =>
            setFilter({ ...filter, ratings: e.target.value })
          }
        >
          <option value="">Filter by Rating</option>
          <option value="4.2">4.2</option>
          {/* Add more options as needed */}
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
              <th className="px-4 py-3 text-left">Cafe ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Avg Bill</th>
              <th className="px-4 py-3 text-left">Discount</th>
              <th className="px-4 py-3 text-left">Ratings</th>
              <th className="px-4 py-3 text-left">Specials</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Updated At</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((cafe, idx) => (
              <tr key={idx} className="border-t whitespace-nowrap">
                <td className="px-4 py-3">{cafe.cafe_id}</td>
                <td className="px-4 py-3">{cafe.name}</td>
                <td className="px-4 py-3">{cafe.location}</td>
                <td className="px-4 py-3">₹{cafe.average_bill}</td>
                <td className="px-4 py-3">{cafe.discount}</td>
                <td className="px-4 py-3">{cafe.ratings}</td>
                <td className="px-4 py-3">{cafe.specials}</td>
                <td className="px-4 py-3">
                  {new Date(cafe.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {new Date(cafe.updatedAt).toLocaleDateString()}
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

export default CafesSection;
