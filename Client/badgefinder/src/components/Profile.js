import React, { useContext } from "react";
import { UserContext } from './page components/usercontext';
import { Box } from "@chakra-ui/react";
import NavBar from "./page components/navbar";

const Profile = () => {
  const [user] = useContext(UserContext);
  let name;
  if(user) {
    name = `${user.user.firstName} ${user.user.lastName}`;
  } else {
    name = "Loading..."
  }

  return (
    <Box>
      <NavBar />
      <div>{name}</div> {/* Using the name here */}
      {/* Add other components or content for the homepage here */}
    </Box>
  );
};
  
export default Profile;