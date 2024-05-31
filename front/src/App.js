import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout.js'
import Home from './pages/Home.js'
import CurrencyPage from './pages/CurrencyPage.js'
import TokensPage from './pages/TokensPage.js'
import NoPage from './pages/NoPage.js'


function App() {

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
