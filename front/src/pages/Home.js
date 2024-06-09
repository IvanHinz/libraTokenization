import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {getToken, useToken} from '../useToken.js';
import LoginPage from './LoginPage.js'
import './Home.css'

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate('/login', { replace: true});
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default function Home(props) {
  const { token, setToken } = useToken();

  return(
    <div className="home-container">
    <h1>Home</h1>
    <LogoutButton />
    </div>
  );
}
