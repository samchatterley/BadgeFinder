import React, { useContext } from "react";
import WrappedAuthForm from "./page components/authform";
import { ChakraProvider, VStack } from "@chakra-ui/react";
import logo from '../assets/scouts-logo.jpg';
import { UserContext } from './page components/usercontext';
import { useNavigate } from 'react-router-dom';

const SignupSecondary = () => {
  const [, setUser] = useContext(UserContext);
  const history = useNavigate();

  const handleSignUpSecondarySuccess = (userData) => {
    setUser(userData);
    history.push('/home');  // or any other route you want to redirect to
  };

  return (
    <ChakraProvider>
      <VStack className="container" alignItems="center" spacing={3}>
        <img src={logo} alt="Scouts Logo" className="logo" style={{ width: '180px' }} />
        <WrappedAuthForm formType="signupSecondary" onSignUpSuccess={handleSignUpSecondarySuccess} />
      </VStack>
    </ChakraProvider>
  );
};

export default SignupSecondary;