import axios from "axios";

const API = axios.create({
  baseURL: "https://gestion-des-taches-backend.onrender.com/api",
});

export default API;