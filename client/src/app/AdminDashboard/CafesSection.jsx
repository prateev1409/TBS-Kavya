import { useEffect, useRef, useState } from "react";

function CafesSection({ data, setData, onEdit }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState({
        location: "",
        average_bill: "",
        ratings: "",
    });
    const [filterOptions, setFilterOptions] = useState({
        locations: [],
        average_bills: [],
        ratings: [],
    });

    const scrollRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes/filters`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch filters');
                const data = await res.json();
                setFilterOptions(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFilters();
    }, []);

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
        const walk = (x - startX.current) * 2;
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const filteredData = data.filter((cafe) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (cafe.name.toLowerCase().includes(searchLower) ||
                cafe.cafe_id.toLowerCase().includes(searchLower)) &&
            (filter.location === "" || cafe.location.toLowerCase() === filter.location.toLowerCase()) &&
            (filter.average_bill === "" || cafe.average_bill.toString() === filter.average_bill) &&
            (filter.ratings === "" || cafe.ratings.toString() === filter.ratings)
        );
    });

    const handleDelete = async (cafeId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes/${cafeId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete cafe');
            setData(data.filter(cafe => cafe.cafe_id !== cafeId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
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
                    onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                >
                    <option value="">Filter by Location</option>
                    {filterOptions.locations.map((location, idx) => (
                        <option key={idx} value={location}>{location}</option>
                    ))}
                </select>
                <select
                    className="px-4 py-2 border rounded-lg"
                    value={filter.average_bill}
                    onChange={(e) => setFilter({ ...filter, average_bill: e.target.value })}
                >
                    <option value="">Filter by Avg Bill</option>
                    {filterOptions.average_bills.map((bill, idx) => (
                        <option key={idx} value={bill}>₹{bill}</option>
                    ))}
                </select>
                <select
                    className="px-4 py-2 border rounded-lg"
                    value={filter.ratings}
                    onChange={(e) => setFilter({ ...filter, ratings: e.target.value })}
                >
                    <option value="">Filter by Rating</option>
                    {filterOptions.ratings.map((rating, idx) => (
                        <option key={idx} value={rating}>{rating}</option>
                    ))}
                </select>
            </div>

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
                                <td className="px-4 py-3">{cafe.specials || 'N/A'}</td>
                                <td className="px-4 py-3">
                                    {new Date(cafe.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(cafe.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => onEdit(cafe)}
                                        className="text-blue-600 hover:text-blue-800 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cafe.cafe_id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
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