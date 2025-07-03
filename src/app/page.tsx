"use client";

import React from 'react'; // Explicitly import React
import { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<
    { judul: string; url: string; img: string; snippet: string; Sumber: string; Tanggal: string }[]
  >([]);
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const resultsPerPage = 10; // Maximum results per page

  const handleSearch = async () => {
    try {
      const res = await axios.get<{ judul: string; url: string; img: string; snippet: string; Sumber: string; Tanggal: string }[]>(
        `http://localhost:5000/search?q=${query}`
      );

      // Debugging: Log the results received from the backend
      console.log('Results from backend:', res.data);

      // Set the results and reset pagination
      setResults(res.data); // Use all results from the backend
      setHasSearched(true); // Mark that a search has been performed
      setCurrentPage(1); // Reset to the first page on a new search
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Calculate the current results to display
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  // Handle pagination
  const totalPages = Math.ceil(results.length / resultsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-gray-50">
      <div className="w-full max-w-lg text-center">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Football News</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Trigger search on Enter key press
            placeholder="Masukkan kata kunci..."
            className="flex-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>

      {hasSearched ? (
        <div className="w-full max-w-4xl mt-8">
          {currentResults.length > 0 ? (
            <div className="flex flex-col gap-4">
              {currentResults.map((r, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start p-4 border border-gray-200 rounded-lg shadow-md gap-4 bg-white"
                >
                  <img
                    src={r.img}
                    alt={r.judul}
                    className="w-full sm:w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="mb-2 text-sm text-gray-500">
                      <strong>Sumber:</strong> {r.Sumber}
                    </p>
                    <h2 className="mb-2 text-lg font-semibold text-blue-600">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {r.judul}
                      </a>
                    </h2>
                    <p className="mb-2 text-sm text-gray-500">
                      <strong>Tanggal:</strong> {r.Tanggal}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-6">{r.snippet}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No results found.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-blue-500 border-gray-300 hover:bg-gray-100'
                }`}
              >
                &#8592; {/* Left arrow */}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show the first 3 pages, the last page, and pages around the current page
                  return (
                    page <= 3 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, filteredPages) => (
                  <React.Fragment key={page}>
                    {index > 0 && page !== filteredPages[index - 1] + 1 && (
                      <span className="px-2">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md border ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-blue-500 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-blue-500 border-gray-300 hover:bg-gray-100'
                }`}
              >
                &#8594; {/* Right arrow */}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          <p>Masukkan kata kunci untuk mencari artikel.</p>
        </div>
      )}
    </div>
  );
}
