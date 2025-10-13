import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import UsersPage from "../pages/UsersPage";
import HomePage from "../pages/HomePage";

export default function AppRouter() {
  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Accueil</Link> |{" "}
        <Link to="/login">Connexion</Link> |{" "}
        <Link to="/home">Projets</Link>
      </nav>

      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}