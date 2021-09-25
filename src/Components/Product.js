import { Container, Grid, Rating } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Assets/CSS/Product.css";
// import "../Assets/CSS/Auth.css";
import SearchBox from "./SearchBox";
export default function Product() {
  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    vendor: "",
    tag: "",
    rating: "",
    image: "",
    amountInStock: "",
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(window.location.href);
  function fetchProductInfo() {
    var url = new URL(window.location.href);
    const lastIndex = url.pathname.lastIndexOf("/");
    const length = url.pathname.length;
    const productID = parseInt(url.pathname.substring(lastIndex + 1, length));
    setProduct({ ...product, id: productID });
    axios
      .get(`http://localhost:8080/product/details/${productID}`)
      .then((res) => {
        setProduct(res.data.product);
        setRelatedProducts(res.data.relatedProducts);
      });
  }
  useEffect(() => {
    console.log(product);
    fetchProductInfo();
  }, []);

  useEffect(() => {
    fetchProductInfo();
  }, [currentLocation]);
  function formatPrice(price) {
    return parseInt(price).toLocaleString();
  }
  return (
    <>
      <SearchBox />
      <Container maxWidth="md">
        <div className="product-top-side">
          <img src={product.image} alt="" className="product-top-left-image" />
          <div className="product-top-right">
            <span className="product-top-right-name">{product.name}</span>
            <Rating
              name="read-only"
              value={product.rating}
              readOnly
              style={{ zIndex: "-1" }}
            />
            <div className="top-right-row">
              <span className="top-right-vendor">Vendor: &nbsp;</span>
              <span className="top-right-vendor-name">{product.vendor}</span>
            </div>
            <span className="top-right-price">
              <span style={{ fontSize: "25px", wordSpacing: "-14px" }}>₦ </span>
              {formatPrice(product.price)}
            </span>
            <button className="continue-btn">Add to cart</button>
            <div className="top-right-row">
              <span className="top-right-product-action">
                <i className="far fa-share-alt"></i>
              </span>
              <span className="top-right-product-action">
                <i className="far fa-heart"></i>
              </span>
            </div>
            <span
              style={{ fontSize: "20px", fontWeight: "500", marginTop: "17px" }}
            >
              Description
            </span>
            <div className="top-right-product-description">
              {product.description}
            </div>
          </div>
        </div>
        <hr className="product-top-hr" />

        <span
          style={{
            borderRadius: "0px 10px",
            background: "#746F6F",
            color: "#FCFCFC",
            fontSize: "17px",
            padding: "4px 18px",
          }}
        >
          Related Products
        </span>
        <br />
        <br />
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          alignContent="center"
        >
          {relatedProducts.map((relatedProduct) => {
            return (
              <Grid item xs={6} key={relatedProduct.id} sm={4} md={3} lg={3}>
                <a
                  href={`/product/${relatedProduct.id}`}
                  className="related-product"
                >
                  <img
                    src={relatedProduct.image}
                    alt=""
                    className="related-product-image"
                  />
                </a>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
