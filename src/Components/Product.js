import { Container, Grid, Rating } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import "../Assets/CSS/Product.css";
import SearchBox from "./SearchBox";
import { fetchCart } from "./Auth/FetchUserData";
import NavActions from "./NavActions";

export function toggleProductInSaved(productID) {
  axios.post(
    "https://abs-shop-api.onrender.com/product/saved/toggle",
    { productID },
    { headers: { "x-access-token": Cookies.get("ud") } }
  );
}
export default function Product() {
  const token = Cookies.get("ud");
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
  const [numberInCart, updateNumberInCart] = useState(0);

  const [copiedResponseMessage, setCopiedResponseMessage] = useState("");
  const [cart, updateCart] = useState([]);

  function fetchProductInfo() {
    var url = new URL(window.location.href);
    const lastIndex = url.pathname.lastIndexOf("/");
    const length = url.pathname.length;
    const productID = parseInt(url.pathname.substring(lastIndex + 1, length));
    setProduct({ ...product, id: productID });
    axios
      .get(`https://abs-shop-api.onrender.com/product/details/${productID}`)
      .then((res) => {
        setProduct(res.data.product);
        setRelatedProducts(res.data.relatedProducts);
      });
  }
  function findProductInCart() {
    const token = Cookies.get("ud");
    if (token !== undefined) {
      // User is logged in
      axios
        .post(
          "https://abs-shop-api.onrender.com/cart/product",
          { productID: product.id },
          {
            headers: { "x-access-token": token },
          }
        )
        .then((res) => {
          if (res.data.inCart) {
            updateNumberInCart(res.data.inCart.length);
          }
        });
    }
  }
  useEffect(() => {
    fetchProductInfo();
    findProductInCart();
    if (token !== undefined) {
      fetchCart().then((res) => {
        updateCart(res.cart);
      });
    }
  }, []);

  useEffect(() => {
    if (product.id !== "") {
      findProductInCart();
      document.title = product.name + " | Abs";
    }
  }, [product]);

  function formatPrice(price) {
    return parseInt(price).toLocaleString();
  }

  function addProductToCart() {
    if (token !== undefined) {
      axios
        .post(
          "https://abs-shop-api.onrender.com/product/cart/add",
          { product_id: product.id, product_name: product.name },
          { headers: { "x-access-token": Cookies.get("ud") } }
        )
        .then((res) => {
          findProductInCart();
          fetchCart().then((res) => {
            updateCart(res.cart);
          });
        });
    } else {
      window.location.href = "/login";
    }
  }
  function removeProductFromCart() {
    axios
      .post(
        "https://abs-shop-api.onrender.com/product/cart/remove",
        { product_id: product.id },
        { headers: { "x-access-token": Cookies.get("ud") } }
      )
      .then((res) => {
        findProductInCart();
        fetchCart().then((res) => {
          updateCart(res.cart);
        });
      });
  }
  function shareProduct() {
    navigator.clipboard.writeText(window.location.href).then((success) => {
      setCopiedResponseMessage("Link Copied!");
      setTimeout(() => setCopiedResponseMessage(""), 2500);
    });
  }
  return (
    <>
      <SearchBox />
      <NavActions cart={cart} />
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
            {/* {cartOptions} */}
            {numberInCart === 0 && (
              <button
                className="continue-btn"
                onClick={() => addProductToCart()}
              >
                Add to cart
              </button>
            )}
            {numberInCart > 0 && (
              <div className="top-right-row">
                <button
                  className="continue-btn modify-cart-btn"
                  onClick={() => addProductToCart()}
                >
                  <i className="far fa-plus"></i>
                </button>
                <button
                  className="continue-btn modify-cart-btn"
                  onClick={() => removeProductFromCart()}
                >
                  <i className="far fa-minus"></i>
                </button>
                <span
                  className={`${
                    numberInCart > 0
                      ? "top-right-number-in-cart"
                      : "none-display"
                  }`}
                >
                  {numberInCart > 0 ? numberInCart : ""}
                </span>
              </div>
            )}
            <div className="top-right-row">
              <span
                className="top-right-product-action"
                onClick={() => shareProduct()}
              >
                <i className="far fa-share-alt"></i>
              </span>
              <span
                style={{
                  display: `${
                    copiedResponseMessage.length === 0 ? "none" : "block"
                  }`,
                }}
                className="top-right-copied-response"
              >
                {copiedResponseMessage}
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
                  <div className="home-product-details">
                    <span className="home-product-name">
                      {relatedProduct.name.length <= 35
                        ? relatedProduct.name
                        : `${relatedProduct.name.substring(0, 35)}...`}
                    </span>
                    <span className="home-product-price">
                      {relatedProduct.price}
                    </span>
                  </div>
                </a>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
