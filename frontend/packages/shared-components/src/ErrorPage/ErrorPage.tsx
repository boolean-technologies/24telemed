import React from 'react';
import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
} from 'react-router-dom';
import { Button, Typography, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Path } from '../AppAuth/paths';

const { Title, Text } = Typography;

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const getErrorInfo = () => {
    if (isRouteErrorResponse(error)) {
      switch (error.status) {
        case 404:
          return {
            status: '404',
            title: 'Page Not Found',
            subTitle: 'Sorry, the page you visited does not exist.',
          };
        case 403:
          return {
            status: '403',
            title: 'Forbidden',
            subTitle: 'Sorry, you are not authorized to access this page.',
          };
        case 500:
          return {
            status: '500',
            title: 'Internal Server Error',
            subTitle: 'Sorry, something went wrong on our end.',
          };
        case 401:
          return {
            status: '401',
            title: 'Unauthorized',
            subTitle: 'Sorry, you need to log in to access this page.',
          };
        case 400:
          return {
            status: '400',
            title: 'Bad Request',
            subTitle: 'Sorry, your request could not be processed.',
          };
        default:
          return {
            status: error.status.toString(),
            title: 'Error',
            subTitle: 'An unexpected error occurred.',
          };
      }
    }
    return {
      status: 'Error',
      title: 'Oops!',
      subTitle: 'An unexpected error occurred.',
    };
  };

  const { status, title, subTitle } = getErrorInfo();

  return (
    <Result
      status={status as any}
      title={<Title level={2}>{title}</Title>}
      subTitle={<Text>{subTitle}</Text>}
      extra={
        <Button
          type="primary"
          icon={<HomeOutlined />}
          onClick={() => navigate(Path.home)}
        >
          Go Home
        </Button>
      }
    />
  );
}
