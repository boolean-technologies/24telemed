import { Badge, Tabs } from 'antd';
import MedicalHistory from './MedicalHistory';
import { Patient } from '@local/api-generated';
import AvailableDoctors from './AvailableDoctors';
import { doctors } from '../../mockdata/availaibledoctors';
import { usePersonnelCommunication } from '@local/websocket';

export type Props = {
  patient: Patient;
};

const Tab = ({ patient }: Props) => {
  const { availableDoctors } = usePersonnelCommunication();
  return (
    <Tabs
      defaultActiveKey="medicalHistory"
      type="card"
      tabBarStyle={{
        width: 'calc(100vw - 32px)',
      }}
      tabBarGutter={8}
      items={[
        {
          key: 'medicalHistory',
          label: 'Medical History',
          children: <MedicalHistory patient={patient} />,
        },
        {
          key: 'availableDoctors',
          label: (
            <>
              Available Doctors{' '}
              <Badge
                count={availableDoctors.length}
                style={{ fontWeight: 'bold' }}
              />
            </>
          ),
          children: <AvailableDoctors doctors={doctors} />,
        },
      ]}
    />
  );
};
export default Tab;
