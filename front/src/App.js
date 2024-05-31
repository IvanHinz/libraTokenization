import './App.css';
import React, { useState } from 'react';
import LaunchCurrency from './LibraCurrencyFront.js'
import LaunchToken from './LibraTokenFront.js'
import LaunchDEX from './LibraDEXFront.js'


function App() {

  return (
    <div>
      <LaunchCurrency/>
      <hr/>
      <LaunchToken/>
      <hr/>
      <LaunchDEX/>
    </div>
  );
}

export default App;
