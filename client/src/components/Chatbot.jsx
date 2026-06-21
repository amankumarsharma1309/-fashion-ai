import axios from "axios";
import { useState, useEffect } from "react";
import products from "./storeProducts";
import ProductCard from "./ProductCard";
import { IoSend } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";
import { useRef } from "react";
import { Link } from "react-router-dom";

function Chatbot() {

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("typing.");
  const [currentStep, setCurrentStep] = useState("mainMenu");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [style, setStyle] = useState("");
  const [occasion, setOccasion] = useState("");

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setTypingText((prev) => {
        if (prev === "typing.") return "typing..";
        if (prev === "typing..") return "typing...";
        return "typing.";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);



  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi 👋 I'm your FashionAI stylist. What would you like help with today?",
      widget: "mainMenu"
    },
  ]);



  //here
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);




  async function handleSend() {
    const userMessage = input;
    if (currentStep === "awaitingHeight") {
      setHeight(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: userMessage,
        },
      ]);

      setInput("");

      setLoading(true);

      setTimeout(() => {
        setLoading(false);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "What's your weight?\n(e.g. 70 kg)",
          },
        ]);

        setCurrentStep("awaitingWeight");
      }, 1000);

      return;
    }
    if (currentStep === "awaitingWeight") {
      setWeight(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: userMessage,
        },
      ]);

      setInput("");

      setLoading(true);

      setTimeout(() => {
        setLoading(false);

        const h = parseInt(height);
        const w = parseInt(userMessage);

        let shirtSize = "M";
        let waistSize = "30-32";

        if (h >= 175 && w >= 75) {
          shirtSize = "L";
          waistSize = "32-34";
        }

        if (h >= 180 && w >= 85) {
          shirtSize = "XL";
          waistSize = "34-36";
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `Estimated Fit:
• Shirt Size: ${shirtSize}
• Waist Size: ${waistSize},

Would you like outfit recommendations too?`,
            widget: "recommendationChoice",
          },
        ]);
      }, 1000);

      return;
    }
    if (currentStep === "awaitingOccasion") {
      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: userMessage,
        },
      ]);

      setInput("");

      setLoading(true);

      setTimeout(() => {
        setLoading(false);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "What's your preferred style?\nChoose the vibe that matches you.",
            widget: "stylePreference",
          },
        ]);

        setCurrentStep("awaitingStyle");
      }, 1000);

      return;
    }

    setMessages([
      ...messages,
      { sender: "user", text: userMessage },
    ]);

    setInput("");

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/recommendation?message=${encodeURIComponent(
          userMessage
        )}`
      );
      const recommendedProduct = products.find(
        (p) => p.name === response.data.product
      );

      if (response.data.product === "NONE") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: response.data.reason,


          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            product: response.data.product,
            reason: response.data.reason,
            recommendedProduct: recommendedProduct,

          },
        ]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }
  function closeWidgets() {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.widget
          ? { ...msg, answered: true }
          : msg
      )
    );
  }
  function handleOptionClick(option) {
    closeWidgets();

    if (option === "Find My Size") {
      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: option,
        },
      ]);

      setLoading(true);

      setTimeout(() => {
        setLoading(false);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "What's your height?\n(e.g. 175 cm)",
          },
        ]);

        setCurrentStep("awaitingHeight");
      }, 1000);

      return;
    }

    if (option === "Yes") {
      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: "Yes",
        },
      ]);

      setLoading(true);

      setTimeout(() => {
        setLoading(false);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Choose your skin undertone.",
            widget: "skinTone",
          },
        ]);
      }, 1000);

      return;
    }
    const skinTones = [
      "🌤 Fair",
      "🙂 Light",
      "☀️ Medium",
      "🌞 Tan",
      "🤎 Brown",
      "🌑 Dark",
      "🤷 Not Sure",
    ];

    if (skinTones.includes(option)) {
      setSkinTone(option);

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: option,
        },
      ]);

      setLoading(true);

      setTimeout(() => {
        setLoading(false);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Great! Tell me about the occasion.",
          },
        ]);

        setCurrentStep("awaitingOccasion");
      }, 1000);

      return;
    }

    const styles = [
      "💎 Old Money",
      "🛹 Streetwear",
      "👔 Smart Casual",
      "🎩 Formal",
      "⚪ Minimalist",
      "🤷 Not Sure",
    ];

    if (styles.includes(option)) {
      setStyle(option);

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: option,
        },
      ]);

      setLoading(true);

      setTimeout(async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/fashion-recommendation`,
            {
              height,
              weight,
              skinTone,
              occasion,
              style: option,
            }
          );

          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: response.data.recommendation,
              recommendation: true,
            },
          ]);
        } catch (error) {
          console.error(error);

          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Unable to generate recommendation right now. Please try again.",
            },
          ]);
        } finally {
          setLoading(false);
        }
      }, 1000);

      return;
    }
  }

  return (
    <>
      {/* <button
        className="help-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        Need Help?
      </button> */}

      {isOpen && (
        <section id="chatbot">
          <Link to="/" className="logo-link">
            <div className="chat-header">
              <div>
                <h2 className="chat-title">
                  <span className="fashionai-text">
                    FashionAI
                  </span>{" "}
                  Stylist
                </h2>
                <span>Online</span>
              </div>
            </div>
          </Link>

          <div className="chat-box">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender}>
                  {msg.recommendation ? (
                    <div className="recommendation-card">
                      <h3>Outfit Recommendation</h3>
                      <pre>{msg.text}</pre>
                    </div>
                  ) : (
                    <span style={{ whiteSpace: "pre-line" }}>
                      {msg.text}
                    </span>
                  )}
                  {msg.widget === "mainMenu" && !msg.answered && (
                    <div className="option-cards">

                      <button
                        onClick={() =>
                          handleOptionClick("Find My Size")
                        }
                      >
                        <span>Find My Size</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() =>
                          handleOptionClick("Build an Outfit")
                        }
                      >
                        <span>Build an Outfit</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() =>
                          handleOptionClick("Style Advice")
                        }
                      >
                        <span>Style Advice</span>
                        <FaChevronRight />
                      </button>

                    </div>
                  )}
                  {msg.widget === "recommendationChoice" && !msg.answered && (
                    <div className="option-cards">

                      <button
                        onClick={() =>
                          handleOptionClick("Yes")
                        }
                      >
                        <span>Yes</span>
                        <span>›</span>
                      </button>

                      <button
                        onClick={() =>
                          handleOptionClick("No")
                        }
                      >
                        <span>No</span>
                        <span>›</span>
                      </button>

                    </div>
                  )}
                  {msg.widget === "skinTone" && !msg.answered && (
                    <div className="option-cards">

                      <button
                        onClick={() => handleOptionClick("🌤 Fair")}
                      >
                        <span>🌤 Fair</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() => handleOptionClick("🙂 Light")}
                      >
                        <span>🙂 Light</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() => handleOptionClick("☀️ Medium")}
                      >
                        <span>☀️ Medium</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() => handleOptionClick("🌞 Tan")}
                      >
                        <span>🌞 Tan</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() => handleOptionClick("🤎 Brown")}
                      >
                        <span>🤎 Brown</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() => handleOptionClick("🌑 Dark")}
                      >
                        <span>🌑 Dark</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() => handleOptionClick("🤷 Not Sure")}
                      >
                        <span>🤷 Not Sure</span>
                        <FaChevronRight />
                      </button>

                    </div>
                  )}
                  {msg.widget === "stylePreference" && !msg.answered && (
                    <div className="option-cards">

                      <button
                        onClick={() =>
                          handleOptionClick("💎 Old Money")
                        }
                      >
                        <span>💎 Old Money</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() =>
                          handleOptionClick("🛹 Streetwear")
                        }
                      >
                        <span>🛹 Streetwear</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() =>
                          handleOptionClick("👔 Smart Casual")
                        }
                      >
                        <span>👔 Smart Casual</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() =>
                          handleOptionClick("🎩 Formal")
                        }
                      >
                        <span>🎩 Formal</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() =>
                          handleOptionClick("⚪ Minimalist")
                        }
                      >
                        <span>⚪ Minimalist</span>
                        <FaChevronRight />
                      </button>

                      <button
                        onClick={() =>
                          handleOptionClick("🤷 Not Sure")
                        }
                      >
                        <span>🤷 Not Sure</span>
                        <FaChevronRight />
                      </button>

                    </div>
                  )}

                  {msg.product && (
                    <>
                      <br />
                      <strong>{msg.product}</strong>
                      <br />
                      {msg.reason}
                      {/* {msg.recommendedProduct && (
                        <div className="chatbot-card">
                          <ProductCard
                            name={msg.recommendedProduct.name}
                            price={msg.recommendedProduct.price}
                            image={msg.recommendedProduct.image}
                            addToCart={() => addToCart(msg.recommendedProduct)}
                          />
                        </div>
                      )} */}
                    </>
                  )}
                </div>
              ))}
              {loading && (
                <div className="bot typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="input-area">

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Type here..."
              />

              {input.trim() && (
                <button
                  className="send-btn"
                  onClick={handleSend}
                >
                  ➤
                </button>
              )}

            </div>

            {/* <button
              onClick={() => window.location.reload()}
            >
              Reset
            </button> */}
          </div>
        </section>
      )}
    </>
  );
}

export default Chatbot;