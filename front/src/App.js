import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Layout from './pages/Layout.js'
import LoginPage from './pages/LoginPage.js'
import Home from './pages/Home.js'
import CurrencyPage from './pages/CurrencyPage.js'
import TokensPage from './pages/TokensPage.js'
import NoPage from './pages/NoPage.js'
import { useToken, getToken } from './useToken.js'

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  if (!token || !token.userAddress) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};

const LoginRoute = ({ children }) => {
  const token = getToken();
  if (token && token.userAddress) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const { token, setToken } = useToken();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute><LoginPage setToken={setToken}/></LoginRoute>} />
        <Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route index element={<Home setToken={setToken}/>} />
          <Route path="currency" element={<CurrencyPage/>} />
          <Route path="tokens" element={<TokensPage/>} />
          <Route path="*"  element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
