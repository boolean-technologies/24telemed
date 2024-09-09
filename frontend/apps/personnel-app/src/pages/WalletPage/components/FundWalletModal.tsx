import { Modal, Button, Form, InputNumber, Space, Typography, Divider } from 'antd';
import { usePaystackPayment } from 'react-paystack';
import styled from 'styled-components';
import { formatToNaira } from '../../../utils/formatToNaira';
import { useCurrentUser } from '@local/api-generated';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const PUBLICKEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const { Text } = Typography;


export function FundWalletModal() {
  const [form] = Form.useForm();
  const { data: user } = useCurrentUser();
  const callSessions = Form.useWatch('call_sessions', form);

  const totalAmount = callSessions * (user?.wallet?.call_unit_cost ?? 0);

  const queryClient = useQueryClient();

  const config = {
    reference: new Date().getTime().toString(),
    email: user?.email,
    amount: totalAmount * 100,
    publicKey: PUBLICKEY,
  };

  const initializePayment = usePaystackPayment(config);

  const navigate = useNavigate();

  const onPaymentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    queryClient.invalidateQueries({ queryKey: ['walletTransactions'] });
    onClose();
  };

  const handleFinish = () => {
    initializePayment({
      onSuccess: onPaymentSuccess,
    });
  };


  const onClose = () => navigate("..")

  return (
    <Modal
      title="Fund Your Wallet"
      open
      onCancel={onClose}
      width={400}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{ call_sessions: 1 }}
      >
        <Text
          type="secondary"
          style={{ marginBottom: '10px', display: 'block' }}
        >
          A "call session" refers to a medical visitation session with a doctor.
          You can purchase multiple sessions for future medical consultations.
        </Text>
        <Divider />
        <Form.Item label="Number of Call Sessions" name="call_sessions">
          <InputNumber min={1} defaultValue={1} style={{ width: '100%' }} />
        </Form.Item>

        <TotalAmount>Total: {formatToNaira(totalAmount)}</TotalAmount>
        <Divider />

        <Space style={{ width: '100%' }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            disabled={totalAmount === 0}
          >
            Proceed to Pay
          </Button>
          <Button type="primary" onClick={onClose} danger>
            Cancel
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}

const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.palette.primary2.main};
  margin-top: 20px;
  text-align: center;
`;
