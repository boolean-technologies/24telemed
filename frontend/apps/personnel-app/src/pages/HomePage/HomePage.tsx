import { useState, useCallback } from 'react';
import {
  Flex,
  Typography,
  FlexProps,
  SearchIcon,
} from '@local/shared-components';
import styled from 'styled-components';
import Header from './Header';
import { Form, Button, Input } from 'antd';
import { Popup, SpinLoading } from 'antd-mobile';
import { useSearchPatients } from '../../api/patient';
import PatientFound from './PatientFound';


type FieldType = {
  phoneNumber: string;
};


export function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [enableSearch, setEnableSearch] = useState<boolean>(false);
  const { data, isLoading } = useSearchPatients(
    { phoneNumber },
    {
      enabled: enableSearch,
      retry: false,
    }
  );
  const [bottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false);

  const onFinish = useCallback(
    (values: FieldType) => {
      setPhoneNumber(values.phoneNumber);
      setEnableSearch(true);
      setBottomSheetVisible(true);
    },
    [phoneNumber]
  );

  console.log(data);

  return (
    <>
    <Header />
      <Flex direction="column">
        <Flex fullWidth padding="xl" direction="column">
          <Typography variant="bodyLg" weight="bold">
            Find patient's profile
          </Typography>

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
                  max: 11,
                  message: 'Phone number should be 11 digits',
                },
              ]}
              style={{ width: '100%' }}
            >
              <Input placeholder="Enter patient's phone number" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" icon={<SearchIcon />} />
            </Form.Item>
          </Form>
          <Popup
            visible={bottomSheetVisible}
            bodyStyle={{ maxHeight: '75vh', overflow: 'scroll', minHeight: '50vh' }}
            onClose={() => setBottomSheetVisible(false)}
            onMaskClick={() => setBottomSheetVisible(false)}
          >
            {isLoading ? (
              <SpinLoading
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ) :  (
              data && <PatientFound data={data} />
            )}

          </Popup>
        </Flex>
      </Flex>
    </>
  );
}


const PatientContainer = styled(Flex)<FlexProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

`;