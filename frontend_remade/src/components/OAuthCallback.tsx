import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // To programmatically navigate

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract tokens and handle login
    // After handling, redirect to a default or user-intended page
    navigate('/');
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default OAuthCallback;