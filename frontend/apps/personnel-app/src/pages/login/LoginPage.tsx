import {
  Flex,
  PasswordInput,
  TextInput,
  Typography,
  Button,
} from '@local/shared-components';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLogin } from '../../hooks/react-queries/useLogin';

interface LoginForm {
  username: string;
  password: string;
}
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export function LoginPage(): JSX.Element {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginForm) => {
    login.mutate(data);
  };

  return (
    <PageContainer
      direction="column"
      gap="lg"
      fullHeight
      justify="center"
      align="flex-start"
    >
      <Flex direction="column" gap="xxs" align="flex-start">
        <Typography variant="bodyLg" weight="bold">
          Secure Login
        </Typography>
        <Typography variant="bodySm">
          Please enter your credentials to login
        </Typography>
      </Flex>

      <TextInput
        label="Username"
        placeholder="Enter your username"
        error={!!errors.username}
        errorText={errors.username?.message}
        type="text"
        {...register('username')}
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        error={!!errors.password}
        errorText={errors.password?.message}
        {...register('password')}
        type="password"
      />

      <Flex justify="flex-end" fullWidth>
        <Typography variant="bodySm" weight="bold">
          Forgot Password?
        </Typography> 
        <Typography variant="bodySm" weight="bold" color="primary2.light">
          Recover
        </Typography>
      </Flex>
      <Button onClick={handleSubmit(onSubmit)} variant="primary" text="LOGIN" />
    </PageContainer>
  );
}

const PageContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
  height: 100vh;
  margin: 0 auto;
  padding: 0 200px;
`;

const FormContainer = styled(Flex)`
  width: 90%;
  max-width: 400px;
`;
