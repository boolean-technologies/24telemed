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
import AvailableDoctors from './AvailableDoctors';
import { Popup, SpinLoading } from 'antd-mobile';
import { useSearchPatients } from '../../api/patient';

type FieldType = {
  phoneNumber: string;
};

const doctors = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    speciality: 'Dermatologist',
    location: 'New York, USA',
    rating: 4.8,
    totalRating: 120,
  },
  {
    id: '2',
    name: 'Dr. Mark Johnson',
    speciality: 'Orthopedic Surgeon',
    location: 'Los Angeles, USA',
    rating: 4.7,
    totalRating: 90,
  },
  {
    id: '3',
    name: 'Dr. Sarah Davis',
    speciality: 'Pediatrician',
    location: 'Chicago, USA',
    rating: 4.9,
    totalRating: 150,
  },
  {
    id: '4',
    name: 'Dr. Michael Brown',
    speciality: 'Neurologist',
    location: 'San Francisco, USA',
    rating: 4.6,
    totalRating: 80,
  },
  {
    id: '4',
    name: 'Dr. Michael Brown',
    speciality: 'Neurologist',
    location: 'San Francisco, USA',
    rating: 4.6,
    totalRating: 80,
  }
];

export function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [enableSearch, setEnableSearch] = useState<boolean>(false);
  const { data, isLoading, isError, error } = useSearchPatients(
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
            bodyStyle={{ maxHeight: '75vh', overflow: 'scroll' }}
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
            ) : (
              <AvailableDoctors doctors={doctors} />
            )}
          </Popup>
        </Flex>
      </Flex>
    </>
  );
}
