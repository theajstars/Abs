import React from "react";

var CartContext = React.createContext();
var CartProvider = CartContext.Provider;
var CartConsumer = CartContext.Consumer;

export { CartProvider, CartConsumer };
