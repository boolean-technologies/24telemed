import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import styled from 'styled-components';
import MedicalHistory from './MedicalHistory';
import { Patient } from '@local/api-generated';
import AvailableDoctors from './AvailableDoctors';
import { doctors } from '../../mockdata/availaibledoctors';

export type Props = {
  patient: Patient;
};

const Tab = ({ patient }: Props) => {
  return (
    <Tabs
      defaultActiveKey="1"
      type="card"
      centered
      tabBarStyle={{
        color: 'black',
        fontSize: '1.25rem',
        lineHeight: '1.5',
        width: '80vw',
        
      }}
      tabBarGutter={5}
    >
      <TabPane tab="Medical History" key="1" >
        <MedicalHistory patient={patient} />
      </TabPane>
      <TabPane tab="Available Doctors" key="2">
        <AvailableDoctors doctors={doctors} />
      </TabPane>
    </Tabs>
  );
};
export default Tab;
