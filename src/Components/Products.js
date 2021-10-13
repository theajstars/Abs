import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { fetchCart } from "./Auth/FetchUserData";
import NavActions from "./NavActions";
import SearchBox from "./SearchBox";
import "../Assets/CSS/Products.css";
import { Container, Grid, Rating } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function Products() {
  const token = Cookies.get("ud");
  const location = useLocation();
  const [cart, updateCart] = useState([]);
  const [checkout, updateCheckout] = useState([]);
  const [products, updateProducts] = useState([]);

  const [currentProduct, updateCurrentProduct] = useState({});
  function fetchProducts() {
    var url = new URL(window.location.href);
    const lastIndex = url.pathname.lastIndexOf("/");
    const length = url.pathname.length;
    const category = url.pathname.substring(lastIndex + 1, length);
    axios
      .get(`https://abs-shop.herokuapp.com/products/categories/${category}`)
      .then((res) => {
        updateProducts(res.data.products);
      });
  }
  useEffect(() => {
    if (token !== undefined) {
      fetchCart().then((res) => {
        updateCart(res.cart);
      });
      // Get checkout items
      axios
        .get("https://abs-shop.herokuapp.com/user/cart/checkout", {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          updateCheckout(res.data.checkoutCart);
        });
    } else {
      //User is not logged in, so cart is empty
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [location]);

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
              checkout.map((item) => {
                if (item.product_id === product.id) {
                  //Product is in User's cart
                  product.count = item.product_count;
                } else {
                  product.count = 0;
                }
              });
              return (
                <Grid item xs={6} sm={4} md={3} lg={3} key={product.id}>
                  <Link
                    to={`/product/${product.id}`}
                    className="products-product"
                  >
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
