import React from 'react';
import { Formik, Form } from 'formik';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { RegisterFormValues } from '../utils/types';
import { registrationSchema } from '../utils/validationSchema';
import request from '../utils/httpsRequest';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { LuSparkles } from 'react-icons/lu';

const Register = () => {
    const navigate = useNavigate();
    const initialValues: RegisterFormValues = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    const handleSubmit = async (values: RegisterFormValues) => {
        const payload = {
            firstName: values.firstName,
            lastName: values.lastName,
            userName: values.userName,
            email: values.email,
            password: values.password,
        }
        try {
          const response = await request({token: ''}).post('/api/Auth/Signup', payload);
          if(response && response.status === 200){
            toast.success(response.data.message || 'Registration successful! You can now log in.');
            navigate('/');
          }
        } catch (error) {
          toast.error('Registration failed. Please try again.');
        }
    };

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const formBackground = useColorModeValue("white", "gray.700");
  const brandColor = useColorModeValue("red.500", "red.200");
  
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      // bg={useColorModeValue("gray.50", "gray.800")}
      bgGradient="linear(to-br, orange.50, red.100)"
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <div className="flex items-center justify-center space-x-2">
            <LuSparkles className='text-red-600 w-8 h-8' />
            <Text className="text-red-600 text-2xl font-semibold">SparkHub</Text>
          </div>
          <Text fontSize="lg" color="gray.600">
            Create a new account to get started!
          </Text>
        </Stack>
        <Box
          rounded="lg"
          bg={formBackground}
          boxShadow="lg"
          p={8}
          w={["full", "md"]}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={registrationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <VStack spacing={4} align="flex-start">
                  <Grid templateColumns="repeat(2, 1fr)" gap={4} width="full">
                    <GridItem>
                      <FormControl isInvalid={!!errors.firstName && touched.firstName}>
                        <FormLabel htmlFor="firstName">First Name</FormLabel>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          variant="filled"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.firstName}
                          placeholder="John"
                        />
                        <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl isInvalid={!!errors.lastName && touched.lastName}>
                        <FormLabel htmlFor="lastName">Last Name</FormLabel>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          variant="filled"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.lastName}
                          placeholder="Doe"
                        />
                        <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <FormControl isInvalid={!!errors.email && touched.email}>
                    <FormLabel htmlFor="email">Email address</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      variant="filled"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      placeholder="john.doe@example.com"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.userName && touched.userName}>
                    <FormLabel htmlFor="userName">Username</FormLabel>
                    <Input
                      id="userName"
                      name="userName"
                      type="text"
                      variant="filled"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.userName}
                      placeholder="johndoe"
                    />
                    <FormErrorMessage>{errors.userName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.password && touched.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <InputGroup>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        variant="filled"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        placeholder="Create a strong password"
                      />
                      <InputRightElement width="4.5rem">
                        <IconButton
                          h="1.75rem"
                          size="sm"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.confirmPassword && touched.confirmPassword}>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <InputGroup>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        variant="filled"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmPassword}
                        placeholder="Confirm your password"
                      />
                      <InputRightElement width="4.5rem">
                        <IconButton
                          h="1.75rem"
                          size="sm"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          variant="ghost"
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>

                  {/* <FormControl isInvalid={!!errors.agreeToTerms && touched.agreeToTerms}>
                    <Flex alignItems="start">
                      <Checkbox
                        id="agreeToTerms"
                        name="agreeToTerms"
                        onChange={handleChange}
                        isChecked={values.agreeToTerms}
                        colorScheme="blue"
                        mt={1}
                      />
                      <Text ml={2} fontSize="sm">
                        I agree to the{' '}
                        <Link as={RouterLink} to="#" color={brandColor}>
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link as={RouterLink} to="#" color={brandColor}>
                          Privacy Policy
                        </Link>
                      </Text>
                    </Flex>
                    <FormErrorMessage>{errors.agreeToTerms}</FormErrorMessage>
                  </FormControl> */}

                  <Button
                    type="submit"
                    colorScheme="red"
                    width="full"
                    size="lg"
                    fontSize="md"
                    isLoading={isSubmitting}
                    loadingText="Creating account"
                    mt={4}
                  >
                    Create account
                  </Button>

                  <Stack direction="row" justify="center" w="full" pt={2}>
                    <Text align="center">
                      Already have an account?{" "}
                      <Link as={RouterLink} to="/" color={brandColor}>
                        Sign in here
                      </Link>
                    </Text>
                  </Stack>
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register