import { Link } from "react-router-dom";
function Navbar({ cartCount, toggleCart }) {
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.reload();
  }


  function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
      behavior: "smooth",
    });

  }

  let authButtons;
  if (token) {
    authButtons = (
      <>
        <a href="/profile">Profile</a>
        <a onClick={handleLogout}>
          Logout
        </a>
      </>

    );
  } else {
    authButtons = (
      <>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </>
    );
  }

  return (
    <nav>
      <h2>FashionAI</h2>

      <div>
        <a onClick={() => scrollToSection("home")}>Home</a>
        <a onClick={() => scrollToSection("shop")}>Shop</a>
        <Link to="/ai-stylist">
          AI Stylist
        </Link>
        <a onClick={toggleCart}>Cart ({cartCount})</a>


        {authButtons}
      </div>
    </nav>
  );
}

export default Navbar;