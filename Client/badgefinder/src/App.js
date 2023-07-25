import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Landing from './components/Landing';
import { UserProvider } from './components/page components/usercontext';
import PrivateRoute from './components/page components/privateRoute';

const logger = require('./logger');
const SignUp = lazy(() => import('./components/SignUp'));
const SignIn = lazy(() => import('./components/SignIn'));
const SecondarySignUp = lazy(() => import('./components/SecondarySignUp'));
const Home = lazy(() => import('./components/Home'));
const Badges = lazy(() => import('./components/Badges'));
const Community = lazy(() => import('./components/Community'));
const Profile = lazy(() => import('./components/Profile'));

const LoggingComponent = ({ children }) => {
  const startTime = Date.now();

  useEffect(() => {
    const endTime = Date.now();
    logger.info("Component rendered in", endTime - startTime, "ms");
  }, [startTime]);

  return children;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoggingComponent><Landing /></LoggingComponent>} />
            <Route path="/auth/signup" element={<LoggingComponent><SignUp /></LoggingComponent>} />
            <Route path="/auth/signup-secondary" element={<LoggingComponent><SecondarySignUp /></LoggingComponent>} />
            <Route path="/auth/signin" element={<LoggingComponent><SignIn /></LoggingComponent>} />
            <Route path="/home" element={<PrivateRoute><LoggingComponent><Home /></LoggingComponent></PrivateRoute>} />
            <Route path="/badges" element={<PrivateRoute><LoggingComponent><Badges /></LoggingComponent></PrivateRoute>} />
            <Route path="/community" element={<PrivateRoute><LoggingComponent><Community /></LoggingComponent></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><LoggingComponent><Profile /></LoggingComponent></PrivateRoute>} />
            <Route path="*" element={<LoggingComponent><div>404 Not Found</div></LoggingComponent>} />
          </Routes>
        </Suspense>
      </Router>
    </UserProvider>
  );
}

export default App;
