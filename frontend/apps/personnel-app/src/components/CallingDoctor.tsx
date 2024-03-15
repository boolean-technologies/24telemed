import { CallLog } from '@local/api-generated';
import {
  PersonnelCallEventType,
  usePersonnelCommunication,
} from '@local/websocket';
import { Typography } from 'antd';
import { Modal } from 'antd-mobile';

export function CallingDoctor() {
  const { callStatus, message, endCall, callDoctor } =
    usePersonnelCommunication();

  const callLog = message?.data as CallLog;

  if (callStatus === PersonnelCallEventType.CALLING) {
    return (
      <Modal
        visible
        title="Calling..."
        content="Calling the doctor"
        actions={[
          {
            key: 'end',
            text: 'End Call',
            onClick: () => endCall(),
            primary: true,
          },
        ]}
        maskStyle={{ backdropFilter: 'blur(6px)' }}
        getContainer={document['body']}
      />
    );
  }
  if (callStatus === PersonnelCallEventType.DECLINED) {
    return (
      <Modal
        visible
        title="Call Declined"
        content={
          <div style={{ textAlign: 'center' }}>
            The call has been declined
            <br />
            {message?.note && (
              <Typography.Text type="danger">
                Decline note: <strong>{message?.note}</strong>
              </Typography.Text>
            )}
          </div>
        }
        actions={[
          {
            key: 'again',
            text: 'Retry call',
            onClick: () =>
              callDoctor({
                doctorId: callLog?.doctor as string,
                note: callLog?.notes || "",
                priority: callLog?.priority as unknown as number,
              }),
            primary: true,
          },
          {
            key: 'cancel',
            text: 'Call Another Doctor',
            onClick: () => endCall(false),
          },
        ]}
        maskStyle={{ backdropFilter: 'blur(6px)' }}
        getContainer={document['body']}
        bodyStyle={{ maxWidth: 300 }}
      />
    );
  }
  return null;
}
