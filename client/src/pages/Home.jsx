
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Chatbot from "../components/Chatbot";
import paymentQR from "../assets/qr.jpeg";
import { useState, useEffect } from "react";

function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart =
      localStorage.getItem("cartItems");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);



  function addToCart(product) {
    const existingItem = cartItems.find(
      (item) => item.name === product.name
    );

    console.log(existingItem);
    setCartCount(cartCount + 1);

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.name === product.name
            ? {
              ...item,
              quantity: item.quantity + 1,
            }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  }

  function toggleCart() {
    setCartOpen(!cartOpen);
  }
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price.replace("₹", "")) * item.quantity,
    0
  );
  function increaseQuantity(productName) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.name === productName
          ? {
            ...item,
            quantity: item.quantity + 1,
          }
          : item
      )
    );
  }
  function decreaseQuantity(productName) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.name === productName
            ? {
              ...item,
              quantity: item.quantity - 1,
            }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  return (
    <div>
      <Navbar
        cartCount={
          cartItems.reduce(
            (total, item) =>
              total + item.quantity,
            0
          )
        }
        toggleCart={toggleCart}
      />
      <Hero />
      <Products addToCart={addToCart} />
      {/* <Chatbot addToCart={addToCart} /> */}

      {cartOpen && (
        <div className="cart-panel">
          <h2>Your Cart</h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-image"
                  />

                  <div className="cart-details">
                    <p>{item.name}</p>

                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          decreaseQuantity(item.name)
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        className="quantity-btn"
                        onClick={() =>
                          increaseQuantity(item.name)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p>{item.price}</p>
                  </div>
                </div>
              ))}

              <h3>Total: ₹{totalPrice}</h3>

              <button onClick={() => setCheckoutOpen(true)}>
                Buy Now
              </button>
            </>
          )}

          <button onClick={toggleCart}>Close</button>
        </div>
      )}
      {checkoutOpen && (
        <div className="cart-panel">
          <h2>Checkout</h2>

          <div className="checkout-form">
            <input placeholder="Name" />
            <input placeholder="Phone" />
            <textarea placeholder="Address"></textarea>
          </div>
          <button
            onClick={() => {
              setCheckoutOpen(false);
              setCartOpen(true);
            }}
          >
            ← Back to Cart
          </button>
          <h3>Scan & Pay</h3>

          <img
            src={paymentQR}
            alt="Payment QR"
            className="payment-qr"
          />
        </div>
      )}

    </div>
  );
}

export default Home;