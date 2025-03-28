import api, { setAuthToken } from "./api";

export const login = async (registration, password) => {
  try {
    const response = await api.post("/login", { registration, password });
    setAuthToken(response.data.token); // Salva o token no localStorage
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const logout = () => {
  setAuthToken(null); // Remove o token
};
