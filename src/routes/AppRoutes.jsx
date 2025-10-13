import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";

export default function AppRouter() {
  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Accueil</Link> | {" "}
        <Link to="/login">Connexion</Link> | {" "}
        <Link to="/home">Accueil</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}