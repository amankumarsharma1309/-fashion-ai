import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import AIStylist from "./pages/AIStylist";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />


      <Route
        path="/profile"
        element={<Profile />}
      />
      <Route
        path="/verify-otp"
        element={<VerifyOtp />}
      />
      <Route
        path="/ai-stylist"
        element={<AIStylist />}
      />
    </Routes>
  );
}

export default App;