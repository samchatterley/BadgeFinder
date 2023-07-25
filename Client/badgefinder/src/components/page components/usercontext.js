import React, { useState, useEffect, useCallback, useMemo } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAchievements, setUserAchievements] = useState({});

  const handleCheckboxChange = useCallback(async (badgeId, requirementId, isChecked) => {
    try {
      const response = await axios.post(`http://localhost:5000/users/${user._id}/achievements`, {
        badge_id: badgeId,
        requirement_id: requirementId,
        achieved: isChecked,
      });
  
      if (response.status === 200) {
        setUserAchievements((prevAchievements) => ({
          ...prevAchievements,
          [badgeId]: isChecked
            ? [...(prevAchievements[badgeId] || []), requirementId]
            : (prevAchievements[badgeId] || []).filter(id => id !== requirementId),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { userId } = jwtDecode(token);
          const response = await fetch(`http://localhost:5000/auth/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const userData = await response.json();
          setUser(userData);
          
          const achievementsResponse = await axios.get(`http://localhost:5000/users/${userId}/achievements`);
          setUserAchievements(achievementsResponse.data.badges);

          setIsLoading(false);
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
        setError(e.toString());
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const value = useMemo(() => ({ user, setUser, error, isLoading, userAchievements, handleCheckboxChange }), [user, setUser, error, isLoading, userAchievements, handleCheckboxChange]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
