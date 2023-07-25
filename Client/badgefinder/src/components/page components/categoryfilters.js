import React from "react";
import {
  VStack,
  Heading,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

const CategoryFilters = ({ onCategoryClick, selectedCategories }) => {
  const categories = [
    "Activity Badges",
    "At Camp",
    "Budget Friendly",
    "Challenge Badges",
    "Community Impact",
    "Hobbies",
    "Indoors",
    "Outdoors",
    "Physical Recreation",
    "Staged",
    "Troop Night",
  ];

  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      width={["100%", "100%", "250px"]}
      padding={4}
      position="fixed"
      top="40px"
    >
      <Box maxHeight="calc(100vh - 40px)" overflowY="auto">
        <VStack align="start" spacing={4}>
          <Heading size="md" paddingLeft="6px" paddingBottom={1} paddingTop={6}>
            Categories
          </Heading>
          {categories.map((category) => (
            <CategoryFilter
              key={category}
              name={category}
              onClick={onCategoryClick}
              isSelected={selectedCategories.has(category)}
            />
          ))}
        </VStack>
      </Box>
      <Box
        display={{ base: "none", md: "block" }}
        position="fixed"
        width="1px"
        height="calc(100vh - 40px)"
        bg={borderColor}
        right="0"
        top="0"
      />{" "}
      {/* Add this line */}
    </Box>
  );
};

const CategoryFilter = ({ name, onClick, isSelected }) => {
  const bgColor = useColorModeValue(
    isSelected ? "purple.500" : "transparent",
    isSelected ? "teal.500" : "transparent"
  );
  const textColor = isSelected ? "white" : "inherit";
  const activeColor = useColorModeValue("purple.500", "teal.500");

  return (
    <Box
      as="button"
      textAlign="left"
      p={2}
      borderRadius="md"
      bg={bgColor}
      color={textColor}
      _hover={{
        bg: isSelected ? bgColor : activeColor,
        color: isSelected ? textColor : "white",
      }}
      _active={{
        bg: isSelected ? bgColor : "gray.300",
        color: isSelected ? textColor : "inherit",
      }}
      onClick={() => onClick(name)}
    >
      <Text fontSize="sm">{name}</Text>
    </Box>
  );
};

export default CategoryFilters;
