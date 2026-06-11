import axios from "axios";

const API = axios.create({
  baseURL: "https://gestion-des-taches-backend.onrender.com",
});

export default API;