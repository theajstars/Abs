import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Assets/CSS/SearchBox.css";
export default function SearchBox() {
  const [searchText, updateSearchText] = useState("");
  const [searchError, setSearchError] = useState(false);

  const [isSearchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  function handleSearch() {
    if (searchText.length === 0) {
      setSearchError(true);
    } else {
      setSearchError(false);
      setSearchResults([]);
      axios
        .post("http://localhost:8080/search", { term: searchText })
        .then((res) => {
          // console.clear();
          console.log(res.data.results);
          setSearchResults(res.data.results);
          setSearchActive(true);
        });
    }
  }

  useEffect(() => {
    if (searchText.length > 0) {
      handleSearch();
    } else {
      setSearchActive(false);
    }
  }, [searchText]);

  useEffect(() => {}, [searchText]);
  return (
    <>
      <div className="search-bg">
        <div className="search-container">
          <input
            type="search"
            className={`search-box ${searchError ? "search-box-error" : ""}`}
            value={searchText}
            placeholder="Find products"
            spellCheck="false"
            onsearch={() => {
              console.clear();
              console.log("I am MOANA!");
            }}
            onChange={(e) => updateSearchText(e.target.value)}
          />
          <span className="search-button" onClick={() => handleSearch()}>
            Search
          </span>
        </div>
      </div>
      <div className={`${isSearchActive ? "search-results" : "none-display"}`}>
        {searchResults.length === 0 && (
          <div style={{ textAlign: "center" }}>No results found</div>
        )}
        {searchResults.map((searchResult) => {
          return (
            <>
              <a className="search-item" href={`/product/${searchResult.id}`}>
                <img src={searchResult.image} alt="" className="search-image" />
                {searchResult.name.substring(0, 80)}
              </a>
            </>
          );
        })}
      </div>
    </>
  );
}
