import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

const HelloWorldBox = ({ onContinue }) => {
    return (
        <Box
            p={6}
            borderRadius="2xl"
            boxShadow="lg"
            bg="gray.50"
            maxW="md"
            mx="auto"
            mt={10}
            textAlign="center"
        >
            <Text fontSize="2xl" mb={4}>
                Hello, world
            </Text>
            <Button colorScheme="blue" onClick={onContinue}>
                Continue
            </Button>
        </Box>
    );
};

export default HelloWorldBox;