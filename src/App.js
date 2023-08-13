import React from 'react'
import './App.css';
import MenuPage from './MenuPage';
import UserProvider from './UserProvider';

function App() {
  return (
    <div className="App">

    <UserProvider>
    <MenuPage />
    </UserProvider>
    

  </div>
  );
}

export default App;
