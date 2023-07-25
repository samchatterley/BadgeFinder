import React, { useContext } from "react";
import WrappedAuthForm from "./page components/authform";
import { ChakraProvider, VStack } from "@chakra-ui/react";
import logo from '../assets/scouts-logo.jpg';
import { UserContext } from './page components/usercontext';

function SignIn() {
  const [, setUser] = useContext(UserContext);

  const handleSignInSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <ChakraProvider>
      <VStack className="container" alignItems="center" spacing={3}>
        <img src={logo} alt="Scouts Logo" className="logo" style={{ width: '180px' }} />
        <WrappedAuthForm formType="signin" onSignInSuccess={handleSignInSuccess} />
      </VStack>
    </ChakraProvider>
  );
};

export default SignIn;
