import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from './pages/Layout.js'
import LoginPage from './pages/LoginPage.js'
import Home from './pages/Home.js'
import CurrencyPage from './pages/CurrencyPage.js'
import TokensPage from './pages/TokensPage.js'
import NoPage from './pages/NoPage.js'
import useToken from './useToken.js'


function App() {

  const { token, setToken } = useToken();

  if(!token) {
    return <LoginPage setToken={setToken} />
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>} />
          <Route path="currency" element={<CurrencyPage/>} />
          <Route path="tokens" element={<TokensPage/>} />
          <Route path="*"  element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
