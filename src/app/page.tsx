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

  const handleSearch = async () => {
    try {
      const res = await axios.get<{ judul: string; url: string; img: string; snippet: string; Sumber: string; Tanggal: string }[]>(
        `http://localhost:5000/search?q=${query}`
      );
      setResults(res.data);
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
                  }}
                >
                  <img
                    src={r.img}
                    alt={r.judul}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                  <div style={{ flex: 1 }}>
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
                    <p style={{ margin: '0 0 0.5rem 0', color: '#4d5156' }}>{r.snippet}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', textAlign: 'center' }}>No results found.</p>
          )}

          {/* Pagination */}
          {results.length > resultsPerPage && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  style={{
                    padding: '0.5rem 1rem',
                    margin: '0 0.25rem',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    backgroundColor: currentPage === i + 1 ? '#0070f3' : 'white',
                    color: currentPage === i + 1 ? 'white' : '#0070f3',
                    cursor: 'pointer',
                  }}
                >
                  {i + 1}
                </button>
              ))}
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
