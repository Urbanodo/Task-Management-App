import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../pages/Login.css"; // ✅ import du CSS de Login

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/register", formData);
      alert("Inscription réussie");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="login-page"> {/* ✅ même classe que Login */}
      <div className="login-container">
        <h1>Inscription</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nom"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            onChange={handleChange}
          />

          <button type="submit">S'inscrire</button>
        </form>

        <div className="register-link">
          <p>Vous avez déjà un compte ?</p>
          <button onClick={() => navigate("/")}>
            Se connecter
          </button>
        </div>

      </div>
    </div>
  );
}

export default Register;