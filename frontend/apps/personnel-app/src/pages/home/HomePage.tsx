import React, { useState, useCallback } from 'react';
import {
  Flex,
  Typography,
  FlexProps,
  SearchIcon,
} from '@local/shared-components';
import styled from 'styled-components';
import Header from './Header';
import { Form, Button, FormProps, Input } from 'antd';
import { useSearchPatients } from '../../hooks/react-queries';
import RecentCalls from './RecentCalls';
import AvailableDoctors from './AvailableDoctors';

type FieldType = {
  phoneNumber: string;
};

export function HomePage(): JSX.Element {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [enableSearch, setEnableSearch] = useState<boolean>(false);
  const { data, isLoading, isError, error } = useSearchPatients(
    { phoneNumber },
    {
      enabled: enableSearch,
      retry: false,
    }
  );

  const onFinish = useCallback(
    (values: FieldType) => {
      setPhoneNumber(values.phoneNumber);
      setEnableSearch(true);
    },
    [phoneNumber]
  );

  return (
    <Root direction="column">
      <Header />
      <Flex direction="column">
        <Content fullWidth padding="xl" direction="column">
          <Typography variant="bodyMd">Find patient's profile</Typography>

          <Form
            layout="horizontal"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{
              maxWidth: '100%',
              width: '100%',
              display: 'flex',

              flexDirection: 'row',
            }}
          >
            <Form.Item<FieldType>
              name="phoneNumber"
              rules={[
                { required: true, message: 'Please input the phone number!' },
                {
                  pattern: new RegExp('^[0-9]*$'),
                  message: 'Please input valid phone number!',
                },
                {
                  max: 10,
                  message: 'Phone number should be 10 digits',
                },
              ]}
              style={{ width: '100%' }}
            >
              <Input placeholder="Search" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <StyledButton type="primary" htmlType="submit">
                <SearchIcon />
              </StyledButton>
            </Form.Item>
          </Form>
          <RecentCalls

            
          />
          <AvailableDoctors />
        </Content>
      </Flex>
    </Root>
  );
}

const Content = styled(Flex)<FlexProps>``;

const StyledButton = styled(Button)`
  background-color: #000000;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const Root = styled(Flex)`
padding-bottom: 60px;

`;