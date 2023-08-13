import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const [userTypeId, setUserTypeId] = useState(null);

  const login = (userId, usertype) => {
    setUserId(userId);
    setUserTypeId(usertype);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userTypeId', usertype);
  };

  const logout = () => {
    setUserId(null);
    setUserTypeId(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userTypeId');
  };

  useEffect(() => {
    // Check if user ID exists in localStorage on component mount
    const storedUserId = localStorage.getItem('userId');
    const storedUserTypeId = localStorage.getItem('userTypeId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if(storedUserTypeId){
      setUserTypeId(storedUserTypeId);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, userTypeId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;