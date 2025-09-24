import { Box, Button, Flex, Heading, Text, VStack, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const PageNotFound = ({ errorCode = "404", title = "Page Not Found", desc = "Sorry, we couldn’t find the page you’re looking for." }) => {
  return (
    <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-br, orange.50, red.100)">
      <Box w={["full", "400px"]} p={[6, 8]} bg="white" rounded="xl" boxShadow="lg">
        <VStack spacing={6} align="center">
          <Text fontSize="5xl" fontWeight="bold" color="orange.400">
            {errorCode}
          </Text>
          <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
            {title}
          </Heading>
          <Text fontSize="md" color="gray.500" textAlign="center">
            {desc}
          </Text>
          <Flex gap={4} pt={4} wrap="wrap" justify="center">
            <Button as={Link} to="/" colorScheme="red" size="md" rounded="md" shadow="md">
              Go back home
            </Button>
            <Button as={ChakraLink} href="mailto:support@yourdomain.com" variant="outline" colorScheme="orange" size="md" rounded="md">
              Contact support
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
};

export default PageNotFound;