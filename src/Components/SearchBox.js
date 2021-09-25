import React, { useState } from "react";
import "../Assets/CSS/SearchBox.css";
export default function SearchBox() {
  const [searchText, updateSearchText] = useState("");
  const [searchError, setSearchError] = useState(false);

  function handleSearch() {
    if (searchText.length === 0) {
      setSearchError(true);
    } else {
      setSearchError(false);
    }
  }
  return (
    <>
      <div className="search-bg">
        <div className="search-container">
          <input
            type="text"
            className={`search-box ${searchError ? "search-box-error" : ""}`}
            value={searchText}
            placeholder="Find products"
            spellCheck="false"
            onChange={(e) => updateSearchText(e.target.value)}
          />
          <span className="search-button" onClick={() => handleSearch()}>
            Search
          </span>
        </div>
      </div>
    </>
  );
}
