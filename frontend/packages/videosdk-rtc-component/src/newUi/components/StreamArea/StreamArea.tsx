import { Flex, useBreakpoints } from '@local/shared-components';
import { Drawer, Layout } from 'antd';
import { SideContent } from './SideContent';
import { StreamLayout } from './Streaming';
import styled from 'styled-components';
import { Messanger } from './Messanger';
import { MedicalNote } from './MedicalNote';
import { SectionsType } from './MedicalNote/useMedicalNoteSections';
import { NoteType } from './MedicalNote/types';
import { Medications } from './Medications';
import { PatientProfile } from './PatientProfile';

export type StreamAreaProps = {
  sideView?: 'chats' | 'medicalNotes' | 'medication' | 'patientProfile';
  onClose: () => void;
  activeNoteSection: NoteType;
  medicalNoteSections: SectionsType;
  setActiveNoteSection: React.Dispatch<React.SetStateAction<NoteType>>;
};

export function StreamArea({
  sideView,
  onClose,
  activeNoteSection,
  medicalNoteSections,
  setActiveNoteSection,
}: StreamAreaProps) {
  const titles = {
    chats: 'Messages',
    medicalNotes: 'Visitation Notes',
    medication: 'Medication & Review',
    patientProfile: 'Patient Info',
  };
  const { isXs, isMobile } = useBreakpoints();

  const siderContent = (
    <SideContent
      title={sideView ? titles[sideView] : ''}
      onClose={() => onClose()}
    >
      {sideView === 'patientProfile' ? <PatientProfile /> : null}
      {sideView === 'chats' ? <Messanger /> : null}
      {sideView === 'medication' ? <Medications /> : null}
      {sideView === 'medicalNotes' ? (
        <MedicalNote
          section={activeNoteSection}
          setSection={setActiveNoteSection}
          sections={medicalNoteSections}
        />
      ) : null}
    </SideContent>
  );

  return (
    <Flex flex={1} justify="center" fullHeight>
      <StyledRootLayout collapsed={!sideView}>
        <Layout
          style={{
            background: 'transparent',
            display: sideView && isXs ? 'none' : 'unset',
          }}
        >
          <Flex
            fullHeight
            fullWidth
            justify="center"
            gap="md"
            direction="column"
            style={isMobile ? { height: '100vh' } : undefined}
          >
            <StreamLayout />
          </Flex>
        </Layout>
        {isMobile ? (
          <StyledDrawer
            open={!!sideView}
            width={600}
            onClose={onClose}
            closable={false}
            style={{ background: 'rgba(0,0,0,0.95)', overflow: 'hidden' }}
          >
            {siderContent}
          </StyledDrawer>
        ) : (
          <Layout.Sider
            collapsible
            collapsed={!sideView}
            onCollapse={(_) => onClose()}
            width={isXs ? '100%' : 400}
            collapsedWidth={0}
            style={{ background: 'transparent', overflow: 'hidden' }}
            trigger={null}
          >
            {siderContent}
          </Layout.Sider>
        )}
      </StyledRootLayout>
    </Flex>
  );
}

const StyledRootLayout = styled(Layout)<{
  collapsed: boolean;
}>`
  min-height: 100%;
  background: transparent;
  gap: ${({ theme, collapsed }) =>
    collapsed ? theme.spacing.none : theme.spacing.md};
`;


const StyledDrawer = styled(Drawer)`
  border-left: 2px solid ${({ theme }) => theme.palette.primary1.light};
`;