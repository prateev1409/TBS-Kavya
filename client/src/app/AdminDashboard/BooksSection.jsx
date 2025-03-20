import { useEffect, useRef, useState } from "react";

function BooksSection({ data, setData, onEdit }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState({
        author: "",
        publisher: "",
        language: "",
        genre: "",
    });
    const [filterOptions, setFilterOptions] = useState({
        authors: [],
        publishers: [],
        languages: [],
        genres: [],
    });

    const scrollRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/filters`, {
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

    const filteredData = data.filter((book) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (book.name.toLowerCase().includes(searchLower) ||
                book.id.toLowerCase().includes(searchLower)) &&
            (filter.author === "" || book.author.toLowerCase() === filter.author.toLowerCase()) &&
            (filter.publisher === "" || book.publisher?.toLowerCase() === filter.publisher.toLowerCase()) &&
            (filter.language === "" || book.language.toLowerCase() === filter.language.toLowerCase()) &&
            (filter.genre === "" || book.genre?.toLowerCase() === filter.genre.toLowerCase())
        );
    });

    const handleDelete = async (bookId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete book');
            setData(data.filter(book => book.id !== bookId));
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
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <select
                    className="px-4 py-2 border rounded-lg"
                    value={filter.author}
                    onChange={(e) => setFilter({ ...filter, author: e.target.value })}
                >
                    <option value="">Filter by Author</option>
                    {filterOptions.authors.map((author, idx) => (
                        <option key={idx} value={author}>{author}</option>
                    ))}
                </select>
                <select
                    className="px-4 py-2 border rounded-lg"
                    value={filter.publisher}
                    onChange={(e) => setFilter({ ...filter, publisher: e.target.value })}
                >
                    <option value="">Filter by Publisher</option>
                    {filterOptions.publishers.map((publisher, idx) => (
                        <option key={idx} value={publisher}>{publisher}</option>
                    ))}
                </select>
                <select
                    className="px-4 py-2 border rounded-lg"
                    value={filter.genre}
                    onChange={(e) => setFilter({ ...filter, genre: e.target.value })}
                >
                    <option value="">Filter by Genre</option>
                    {filterOptions.genres.map((genre, idx) => (
                        <option key={idx} value={genre}>{genre}</option>
                    ))}
                </select>
                <select
                    className="px-4 py-2 border rounded-lg"
                    value={filter.language}
                    onChange={(e) => setFilter({ ...filter, language: e.target.value })}
                >
                    <option value="">Filter by Language</option>
                    {filterOptions.languages.map((language, idx) => (
                        <option key={idx} value={language}>{language}</option>
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
                                <td className="px-4 py-3">{book.publisher || 'N/A'}</td>
                                <td className="px-4 py-3">{book.genre || 'N/A'}</td>
                                <td className="px-4 py-3">{book.description || 'N/A'}</td>
                                <td className="px-4 py-3">{book.image_url || 'N/A'}</td>
                                <td className="px-4 py-3">{book.audio_url || 'N/A'}</td>
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
                                <td className="px-4 py-3">{book.keeper_id || 'N/A'}</td>
                                <td className="px-4 py-3">
                                    {new Date(book.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(book.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => onEdit(book)}
                                        className="text-blue-600 hover:text-blue-800 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(book.id)}
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

export default BooksSection;