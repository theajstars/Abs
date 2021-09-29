import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { fetchCart } from "./Auth/FetchUserData";
import NavActions from "./NavActions";
import SearchBox from "./SearchBox";
import "../Assets/CSS/Products.css";
import { Container, Grid, Rating } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Products() {
  const token = Cookies.get("ud");
  const [cart, updateCart] = useState([]);
  const [products, updateProducts] = useState([]);
  useEffect(() => {
    if (token !== undefined) {
      fetchCart().then((res) => {
        updateCart(res.cart);
        console.log(res.cart);
      });
    } else {
      //User is not logged in, so cart is empty
    }
    var url = new URL(window.location.href);
    const lastIndex = url.pathname.lastIndexOf("/");
    const length = url.pathname.length;
    const category = url.pathname.substring(lastIndex + 1, length);
    axios
      .get(`http://localhost:8080/products/categories/${category}`)
      .then((res) => {
        console.log(res);
        updateProducts(res.data.products);
      });
  }, []);
  return (
    <>
      <SearchBox />
      <NavActions cart={cart} />
      <Container maxWidth="lg">
        <div className="products-container">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
            alignContent="center"
          >
            {products.map((product) => {
              return (
                <Grid item xs={6} sm={4} md={3} lg={3} key={product.id}>
                  <Link to="/" className="products-product">
                    <img
                      src={product.image}
                      alt=""
                      className="products-product-image"
                    />
                    <span className="products-product-name">
                      {product.name.length <= 30
                        ? product.name
                        : `${product.name.substring(0, 30)}...`}
                    </span>
                    <span className="products-product-price">₦98000</span>
                    <Rating
                      name="half-rating-read"
                      value={product.rating}
                      precision={0.5}
                      readOnly
                    />
                    <button
                      className="continue-btn products-products-btn"
                      onClick={(e) => e.preventDefault()}
                    >
                      Add to cart
                    </button>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Container>
    </>
  );
}
