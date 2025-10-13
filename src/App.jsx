import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUsers } from "./api/userApi";
import LoginPage from "./pages/LoginPage";

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.username} ({u.email})</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Accueil</Link> |{" "}
        <Link to="/login">Connexion</Link>
      </nav>

      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;