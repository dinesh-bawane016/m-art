import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mart_token');
    const userData = localStorage.getItem('mart_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('mart_token', data.token);
    localStorage.setItem('mart_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const adminLogin = async (email, password) => {
    const { data } = await API.post('/auth/admin/login', { email, password });
    localStorage.setItem('mart_token', data.token);
    localStorage.setItem('mart_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await API.post('/auth/register', { name, email, password, role });
    localStorage.setItem('mart_token', data.token);
    localStorage.setItem('mart_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mart_token');
    localStorage.removeItem('mart_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
