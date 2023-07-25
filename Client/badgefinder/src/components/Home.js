import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Flex, Grid } from '@chakra-ui/react';
import NavBar from './page components/navbar';
import CategoryFilters from './page components/categoryfilters';
import Badge from './page components/badge';
import { UserContext } from './page components/usercontext';

const Home = () => {
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [user] = useContext(UserContext); // Get the user from context
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // Fetch the badges that could be achieved
    const fetchBadges = async () => {
      try {
        const response = await axios.get('http://localhost:5000/badges');
        const fetchedBadges = response.data;
        setBadges(fetchedBadges);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBadges();
  }, []);

  const handleCategoryClick = (category) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  const filteredBadges = selectedCategories.size
    ? badges.filter((badge) =>
        badge.categories &&
        [...selectedCategories].every((selectedCategory) =>
          badge.categories.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      )
    : badges;

  return (
    <>
      <Box position="fixed" top={0} left={0} right={0} zIndex={10}>
        <NavBar />
      </Box>
      <Flex
        marginTop="40px"
        direction={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'center', md: 'flex-start' }}
      >
        <Box
          width={['100%', '100%', '20%']}
          p={4}
          position="relative"
        >
          <Box height="100vh" overflowY="auto">
            <CategoryFilters
              onCategoryClick={handleCategoryClick}
              selectedCategories={selectedCategories}
            />
          </Box>
        </Box>
        <Box width={['100%', '100%', '80%']} p={4}>
          <Grid
            templateColumns={{
              base: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(6, 1fr)',
            }}
            gap={6}
          >
            {filteredBadges.map((badge) => (
              // Pass user ID to Badge component
              <Badge key={badge.badgeId} badge={badge} userId={user.userId} />
            ))}
          </Grid>
        </Box>
      </Flex>
    </>
  );
};

export default Home;