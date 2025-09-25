
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import request from '../utils/httpsRequest';
import { useUserAuthContext } from '../context/user/user.hook';
import { UserAuthAction } from '../context/user/user-reducer';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  Link,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { jwtDecode } from 'jwt-decode';
import { LuSparkles } from 'react-icons/lu';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {

  const navigate = useNavigate();
  const { dispatch } = useUserAuthContext();
  const initialValues: LoginFormValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const handleSubmit = async (values: LoginFormValues) => {
   try {
    const response = await request({token: ''}).post('/api/Auth/Login', values);
    if (response && response.status === 200) {
      toast.success(response.data.message || 'Login successful!');
      dispatch({
        type: UserAuthAction.SET_TOKEN as keyof typeof UserAuthAction,
        payload: response?.data?.accessToken,
      });
      localStorage.setItem('refreshToken', response?.data?.refreshToken);
      // Decode JWT to get user role
      const decodedToken = jwtDecode<{ [key: string]: any }>(response?.data?.accessToken);
      const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const userRole = decodedToken[roleClaim];
      if (userRole?.includes('SuperAdmin')) {
        navigate('/dashboard');
      } else if(userRole === 'User'){
        navigate('/events');
      }
    }
   } catch (error) {
     toast.error('Login failed. Please try again.');
   }
  };

  const [showPassword, setShowPassword] = React.useState(false);
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
            Welcome back! Sign in to your account
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
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <VStack spacing={4} align="flex-start">
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
                      placeholder="Enter your email"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
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
                        placeholder="Enter your password"
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

                  <Stack direction="row" justify="space-between" w="full" align="center">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      onChange={handleChange}
                      isChecked={values.rememberMe}
                      colorScheme="blue"
                    >
                      Remember me
                    </Checkbox>
                    <Link as={RouterLink} to="#" color={brandColor} fontSize="sm">
                      Forgot password?
                    </Link>
                  </Stack>
                  
                  <Button
                    type="submit"
                    colorScheme="red"
                    width="full"
                    size="lg"
                    fontSize="md"
                    isLoading={isSubmitting}
                    loadingText="Signing in"
                  >
                    Sign in
                  </Button>
                  
                  <Stack direction="row" justify="center" w="full" pt={2}>
                    <Text align="center">
                      Don't have an account?{" "}
                      <Link as={RouterLink} to="/register" color={brandColor}>
                        Sign up here
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

export default Login;