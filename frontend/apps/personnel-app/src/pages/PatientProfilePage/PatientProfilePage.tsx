import { useNavigate, useParams } from 'react-router-dom';
import { Theme } from '@local/shared-components';
import { useTheme } from 'styled-components';
import { Drawer } from 'antd';
import { Modal } from 'antd-mobile';
import { PatientProfile } from '../../components/PatientProfile';

export function PatientProfilePage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme() as Theme;

  const onCloseProfile = () => {
    Modal.confirm({
      title: 'Close Profile',
      content: 'Are you sure you want to close this patient profile?',
      confirmText: 'Yes, Close',
      cancelText: 'Cancel',
      onConfirm: () => navigate(-1),
    });
  };

  if (!patientId) return null;

  return (
    <Drawer
      title="Patient Profile"
      onClose={onCloseProfile}
      open
      width="100%"
      styles={{
        body: { padding: 0, background: theme.palette.primary2.main },
        header: { background: theme.palette.primary2.main },
      }}
    >
      <PatientProfile patientId={patientId} />
    </Drawer>
  );
}
