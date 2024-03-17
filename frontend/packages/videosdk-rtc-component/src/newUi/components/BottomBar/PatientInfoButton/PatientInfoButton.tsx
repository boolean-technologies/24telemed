import { useState } from 'react';
import { IconButton } from '../../IconButton';
import { Drawer } from 'antd';
import { Theme, addAlpha, useBreakpoints } from '@local/shared-components';
import { PatientProfile } from './PatientProfile';
import { useTheme } from 'styled-components';
import { useCallContext } from '../../../context/AppContext';



export function PatientInfoButton() {
  const { isMobile } = useBreakpoints();
  const [open, setOpen] = useState(false);
  const theme = useTheme() as Theme;
  const { patientId } = useCallContext();
  
  return (
    <>
      <IconButton
        icon="information-circle"
        onClick={() => setOpen(true)}
        tooltip="Patient Info"
      />
      <Drawer
        title="Patient Information"
        onClose={() => setOpen(false)}
        open={open}
        width={isMobile ? "100%" : "60%"}
        styles={{
          body: { padding: 0, background: theme.palette.primary2.main },
          header: { background: theme.palette.primary2.main },
          mask: {
            background: addAlpha(theme.palette.common.white, 0.05)
          }
        }}
      >
       <PatientProfile patientId={patientId} />
      </Drawer>
    </>
  );
}
