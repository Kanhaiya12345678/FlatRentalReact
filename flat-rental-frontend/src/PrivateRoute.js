// PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import axios from 'axios';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const result = await axios.get("http://localhost:8081/home");
        
        if (result.data && result.data.Status === "Success") {
          if (result.data.role === 'user') {
            setAuthenticated(true);
          } else {
            setAuthenticated(false);
            navigate("/login");
          } 
        } else { 
          setAuthenticated(false);
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        setAuthenticated(false);
        navigate("/login");
      }
    };

    if (!isAuthenticated) {
      checkAuthentication();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, setAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;

