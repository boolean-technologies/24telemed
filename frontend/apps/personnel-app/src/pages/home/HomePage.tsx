import React from 'react';
import {
  Flex,
  Typography,
  FlexProps,
  
} from '@local/shared-components';
import styled from 'styled-components';
import Header from './Header';
import { Form, Button, FormProps, Input } from 'antd';

type FieldType = {
  phoneNumber:string
};

export function HomePage(): JSX.Element {
  return (
    <Flex direction="column" >
      <Header />
      <Flex direction="column" >
      <Content fullWidth padding="xl" direction="column">
        <Typography variant="bodyMd">Find patient's profile</Typography>

        <Form
          layout="inline"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={(values: FieldType) => {
            console.log(values);
          }}
          

          style={{ maxWidth: "100%",
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
           }}
        >
          <Form.Item<FieldType>
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input your username!' }]}
            style={{ width: '80%' }}
          >
            
            <Input placeholder="Search" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <StyledButton type="primary" htmlType="submit">
              Search
            </StyledButton>
          </Form.Item>
          
        </Form>
        
        

        
        
      </Content>
      </Flex>
    </Flex>
    
    
    
  );
}

const Content = styled(Flex)<FlexProps>``;


const StyledButton = styled(Button)`
  background-color: #000000;
`;

const StyledForm = styled(Form)<FormProps>`
  display: flex;
  width: 100%;
  
  `;