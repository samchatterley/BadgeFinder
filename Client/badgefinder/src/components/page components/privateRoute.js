import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from './usercontext';

function PrivateRoute({ children, path }) {
  const [user] = React.useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate("/auth/signin", { state: { from: location } });
    }
  }, [user, navigate, location]);

  return user ? children : null;
}

export default PrivateRoute;