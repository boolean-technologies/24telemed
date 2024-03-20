import { Flex, Typography, SearchIcon } from '@local/shared-components';
import Header from './Header';
import { Form, Button, Input, InputRef } from 'antd';
import { Popup, SpinLoading } from 'antd-mobile';
import { useSearchPatients } from '../../api/patient';
import PatientFound from './PatientFound';
import { PatientNotFound } from './PatientNotFound';
import { useRef } from 'react';

type FieldType = {
  phoneNumber: string;
};

export function HomePage() {
  const searchPatient = useSearchPatients();
  const onFinish = (values: FieldType) => {
    searchPatient.mutate(values.phoneNumber);
  };

  const searchInput = useRef<InputRef>(null);

  const handleSearchAnother = () => {
    searchPatient.reset();
    searchInput.current?.focus();
  };

  return (
    <>
      <Header />
      <Flex direction="column">
        <Flex fullWidth padding="xl" xsPadding="md" direction="column">
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
            <Flex fullWidth gap="xs">
            <Flex flex={1}>
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
              <Input
                placeholder="Enter patient's phone number"
                ref={searchInput}
              />
            </Form.Item>
            </Flex>
            <Form.Item>
              <Button
                type="primary"
                loading={searchPatient.isPending}
                htmlType="submit"
                icon={<SearchIcon />}
              />
            </Form.Item>
            </Flex>
          </Form>
          <Popup
            visible={!searchPatient.isIdle}
            bodyStyle={{
              maxHeight: '75vh',
              overflow: 'scroll',
              minHeight: 300,
            }}
            onClose={() => searchPatient.reset()}
            onMaskClick={() => searchPatient.reset()}
          >
            {searchPatient.isPending ? (
              <SpinLoading
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ) : searchPatient.data?.length ? (
              <PatientFound data={searchPatient.data || []} />
            ) : (
              <PatientNotFound
                phoneNumber={searchPatient.variables!}
                onSearchAnother={handleSearchAnother}
              />
            )}
          </Popup>
        </Flex>
      </Flex>
    </>
  );
}
