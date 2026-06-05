import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import "../pages/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
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
      const response = await API.post("/users/login", formData);
      login(response.data);
      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message || "Erreur de connexion"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Connexion</h1>

        <form onSubmit={handleSubmit}>
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

          <button type="submit">Se connecter</button>
        </form>

        <div className="register-link">
          <p>Vous n'avez pas de compte ?</p>
          <button onClick={() => navigate("/register")}>
            Créer un compte
          </button>
        </div>
      </div>
    </div> 
  );
}

export default Login; 