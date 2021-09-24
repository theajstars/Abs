import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Assets/CSS/Sidebar.css";
import {
  computingCategory,
  computingAccessoriesCategory,
  electronicsCategory,
  gamingCategory,
  largeAppliancesCategory,
} from "./ProductCategories";
export default function Sidebar() {
  const [currentSubcategoryHeader, seturrentSubcategoryHeader] = useState("");
  const [currentSubcategory, setCurrentSubcategory] = useState([]);
  const [containerDisplay, setContainerDisplay] = useState("-270px");

  return (
    <>
      <span className="open-menu" onClick={() => setContainerDisplay("0px")}>
        <i className="far fa-bars"></i>
      </span>
      <span
        className={`${containerDisplay === "0px" ? "close-all" : "hide-close"}`}
        onClick={() => {
          setContainerDisplay("-270px");
          setCurrentSubcategory([]);
        }}
      >
        <i className="far fa-times"></i>
      </span>
      <span
        className={`${
          currentSubcategory.length === 0 ? "hide-close" : "close-sub"
        }`}
        onClick={() => setCurrentSubcategory([])}
      >
        <i className="far fa-angle-left"></i>
      </span>
      <motion.div
        initial={{ x: "-270px" }}
        animate={{ x: containerDisplay }}
        transition={{ ease: "easeOut", duration: 0.5 }}
        className="sidebar-container"
      >
        <div className="product-categories">
          <span
            className="product-category"
            onClick={() => {
              setCurrentSubcategory(computingCategory);
              seturrentSubcategoryHeader("Computing");
            }}
          >
            Computing
          </span>
          <span
            className="product-category"
            onClick={() => {
              setCurrentSubcategory(computingAccessoriesCategory);
              seturrentSubcategoryHeader("Computing Accessories");
            }}
          >
            Computing Accessories
          </span>
          <span
            className="product-category"
            onClick={() => {
              setCurrentSubcategory(electronicsCategory);
              seturrentSubcategoryHeader("Electronics");
            }}
          >
            Electronics
          </span>
          <span
            className="product-category"
            onClick={() => {
              setCurrentSubcategory(gamingCategory);
              seturrentSubcategoryHeader("Gaming");
            }}
          >
            Gaming
          </span>
          <span
            className="product-category"
            onClick={() => {
              setCurrentSubcategory(largeAppliancesCategory);
              seturrentSubcategoryHeader("Large Appliances");
            }}
          >
            Large appliances
          </span>
        </div>
      </motion.div>
      <div
        className={`${
          currentSubcategory.length > 0
            ? "subcategories-container"
            : "hide-subcategories"
        }`}
      >
        <span className="sub-header">{currentSubcategoryHeader}</span>
        <div className="subcategories">
          {currentSubcategory.map((subcat) => {
            return (
              <Link to={subcat.path} className="subcategory">
                {subcat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
