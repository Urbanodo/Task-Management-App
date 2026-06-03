import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post(
        "/users/login",
        formData
      );

      login(response.data);

      navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Erreur de connexion"
      );

    }
  };

  return (
    <div>

      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br />

        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          onChange={handleChange}
        />

        <br />

        <button type="submit">
          Se connecter
        </button>

      </form>

    </div>
  );
}

export default Login;