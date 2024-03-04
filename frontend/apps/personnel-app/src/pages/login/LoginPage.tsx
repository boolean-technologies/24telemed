import {
  Flex,
  PasswordInput,
  TextInput,
  Typography,
  Button,
  Logo,
} from '@local/shared-components';
import styled, { css } from 'styled-components';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLogin } from '../../hooks/react-queries/useLogin';
import { BG } from '../../assets';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface LoginData {
  username: string;
  password: string;
}
const schema = yup.object().shape({
  username: yup.string().required('Username is required').min(3),
  password: yup.string().required('Password is required').min(8),
});

export function LoginPage(): JSX.Element {
  const login = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginData> = (data) => {
    login.mutate(data, {
      onSuccess: () => {
        toast.success('Login successful');
      },
      onError: () => {
        toast.error("Login failed, please try again", {
          autoClose: 5000,
          position: 'top-right',
        });
      },
    });
  };
  return (
    <PageContainer
      direction="column"
      gap="sm"
      fullHeight
      justify="center"
      align="flex-start"
    >
      <Flex justify="space-between" fullWidth padding="sm">
        <Logo />
        <Image src={BG} alt="Background" />
      </Flex>
      <Flex direction="column" gap="xs" align="flex-start">
        <Typography variant="bodyLg" weight="bold">
          Secure Login
        </Typography>
        <Typography variant="bodySm">
          Please enter your credentials to login
        </Typography>
      </Flex>

      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Username"
            error={!!errors.username?.message}
            errorText={errors.username?.message}
            placeholder="Enter your username"
            type="username"
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordInput
            {...field}
            label="Password"
            error={!!errors.password?.message}
            errorText={errors.password?.message}
            placeholder="Enter your password"
            type="password"
          />
        )}
      />

      <Flex justify="flex-end" fullWidth>
        <Typography variant="bodySm">Forgot Password?</Typography>
        <Link to="/recover">
          <Typography variant="bodySm" weight="regular" color="common.warning">
            Recover
          </Typography>
        </Link>
      </Flex>
      <Button
        variant="primary"
        text="LOGIN"
        type="submit"
        onClick={handleSubmit(onSubmit)}
        disabled={login.isPending}
        isSubmitting={login.isPending}
      />

      <Flex justify="flex-start" fullWidth>
        <Typography variant="bodySm">Don't have an account?</Typography>
        <Link to="/register">
          <Typography variant="bodySm" color="common.warning">
            Register
          </Typography>
        </Link>
      </Flex>
    </PageContainer>
  );
}

const PageContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.palette.common.white};
  height: 100vh;
  margin: 0 auto;
  padding: 0 200px;
  position: relative;
  ${({ theme }) =>
    theme.breakpoints.xs.down(css`
      padding: 0 20px;
    `)}

  ${({ theme }) =>
    theme.breakpoints.sm.down(css`
      padding: 0 50px;
    `)}
`;

const Image = styled.img`
  width: 300px;
  height: 200px;

  border-radius: 8px;
  position: absolute;
  right: 0;
  top: 0;
  ${({ theme }) =>
    theme.breakpoints.xs.down(css`
      right: -50px;
      top: 50px;
    `)}

  ${({ theme }) =>
    theme.breakpoints.sm.down(css`
      width: 200px;
      height: 150px;
    `)}
`;
