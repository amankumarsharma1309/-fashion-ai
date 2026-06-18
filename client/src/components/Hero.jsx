import { useNavigate } from "react-router-dom";
function Hero() {
  function scrollToChat() {
    document.getElementById("chatbot").scrollIntoView({
      behavior: "smooth",
    });
  }
  const navigate = useNavigate();
  return (
    <section id="home">
      <h1>Discover Your Perfect Style</h1>

      <p>
        AI-powered fashion recommendations based on your height, skin tone,
        and occasion.
      </p>

      <button>Shop Now</button>
      <button onClick={() => navigate("/ai-stylist")}>Try AI Stylist</button>
    </section>
  );
}

export default Hero;