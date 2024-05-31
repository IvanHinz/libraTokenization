import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) return null;
    try {
      const userToken = JSON.parse(tokenString);
      return userToken?.token;
    } catch (e) {
      console.error("Failed to parse token from localStorage", e);
      return null;
    }
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }
}