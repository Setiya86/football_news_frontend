// pages/index.js

"use client";

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
  const maxPageButtons = 5; // Maximum number of pagination buttons to display at a time

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

  // Calculate the range of pagination buttons to display
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Football News</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Trigger search on Enter key press
          placeholder="Masukkan kata kunci..."
          style={{
            flex: 1,
            maxWidth: '500px',
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#0070f3',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      {hasSearched ? (
        <div>
          {currentResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentResults.map((r, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #eee',
                    gap: '1rem',
                    width: '100%', // Ensure consistent width
                    height: '150px', // Set a fixed height for all cards
                  }}
                >
                  <img
                    src={r.img}
                    alt={r.judul}
                    style={{
                      width: '100px',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#888', fontSize: '0.9rem' }}>
                      <strong>Sumber:</strong> {r.Sumber}
                    </p>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#1a0dab' }}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        {r.judul}
                      </a>
                    </h2>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#888', fontSize: '0.9rem' }}>
                      <strong>Tanggal:</strong> {r.Tanggal}
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#4d5156', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.snippet}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', textAlign: 'center' }}>No results found.</p>
          )}

          {/* Pagination */}
          {results.length > resultsPerPage && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                style={{
                  padding: '0.375rem 0.75rem', // Reduced size to 3/4
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: currentPage === 1 ? '#f0f0f0' : 'white',
                  color: currentPage === 1 ? '#ccc' : '#0070f3',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                &#8592; {/* Left arrow */}
              </button>
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '0.375rem 0.75rem', // Reduced size to 3/4
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    backgroundColor: currentPage === page ? '#0070f3' : 'white',
                    color: currentPage === page ? 'white' : '#0070f3',
                    cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.375rem 0.75rem', // Reduced size to 3/4
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: currentPage === totalPages ? '#f0f0f0' : 'white',
                  color: currentPage === totalPages ? '#ccc' : '#0070f3',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                &#8594; {/* Right arrow */}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
          <p>Masukkan kata kunci untuk mencari artikel.</p>
        </div>
      )}
    </div>
  );
}
