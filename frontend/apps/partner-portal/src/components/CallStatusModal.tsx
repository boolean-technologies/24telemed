import { Button, Modal, Spin, Typography } from 'antd';
import { PersonnelCallEventType, usePersonnelCommunication } from '@local/websocket';

const { Paragraph, Text } = Typography;

/** Ringing / declined / failed feedback while a patient calls a doctor. */
export function CallStatusModal() {
  const { callStatus, message, endCall } = usePersonnelCommunication();
  const dismiss = () => endCall(false);

  switch (callStatus) {
    case PersonnelCallEventType.CALLING:
      return (
        <Modal open centered closable={false} title="Calling the doctor…" footer={<Button danger onClick={() => endCall()}>Cancel call</Button>}>
          <Paragraph>
            <Spin size="small" /> Please keep this page open. The video call starts as soon as the doctor answers.
          </Paragraph>
        </Modal>
      );
    case PersonnelCallEventType.DECLINED:
      return (
        <Modal open centered title="The doctor couldn't take the call" onCancel={dismiss} footer={<Button type="primary" onClick={dismiss}>OK</Button>}>
          <Paragraph>Your consultation is still paid for. Try again shortly or choose another doctor.</Paragraph>
          {message?.note && <Text type="secondary">Doctor's note: {message.note}</Text>}
        </Modal>
      );
    case PersonnelCallEventType.BUSY:
      return (
        <Modal open centered title="The doctor is on another call" onCancel={dismiss} footer={<Button type="primary" onClick={dismiss}>OK</Button>}>
          <Paragraph>Your consultation is still paid for. Please try again in a few minutes.</Paragraph>
        </Modal>
      );
    case PersonnelCallEventType.FAILED:
      return (
        <Modal open centered title="The call couldn't be started" onCancel={dismiss} footer={<Button type="primary" onClick={dismiss}>OK</Button>}>
          <Paragraph>
            Make sure your consultation is paid and the doctor is available for this service, then try again.
          </Paragraph>
        </Modal>
      );
    default:
      return null;
  }
}
