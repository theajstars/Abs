import { Container, Grid } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../Assets/CSS/Home.css";
import { fetchCart } from "./Auth/FetchUserData";
import NavActions from "./NavActions";

import SearchBox from "./SearchBox";

export default function Home() {
  const token = Cookies.get("ud");
  const [products, setProducts] = useState([]);
  const [cart, updateCart] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/products/home").then((res) => {
      console.log(res.data);
      setProducts(res.data.products);
    });
    if (token !== undefined) {
      fetchCart().then((res) => {
        updateCart(res.cart);
        console.log(res.cart);
      });
    }
    document.title = "Abs | Home";
  }, []);
  function formatPrice(price) {
    return parseInt(price).toLocaleString();
  }
  return (
    <>
      <SearchBox />
      <NavActions cart={cart} />
      <Container maxWidth="lg">
        <div className="home-container">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
            alignContent="center"
          >
            {products.map((product) => {
              return (
                <Grid item xs={6} sm={4} md={3} lg={3}>
                  <Link
                    to={`/product/${product.id}`}
                    className="home-product"
                    key={product.id}
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="home-product-image"
                    />
                    <div className="home-product-details">
                      <span className="home-product-name">
                        {product.name.length <= 35
                          ? product.name
                          : `${product.name.substring(0, 35)}...`}
                      </span>
                      <span className="home-product-price">
                        ₦{formatPrice(product.price)}
                      </span>
                    </div>
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
