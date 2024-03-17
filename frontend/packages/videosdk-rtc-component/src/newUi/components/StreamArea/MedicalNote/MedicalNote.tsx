import { Badge, Button } from 'antd';
import { VisitationReason } from './VisitationReason';
import { AssessmentAndDiagnosis } from './AssessmentAndDiagnosis';
import { FollowUpPlan } from './FollowUpPlans';
import { Flex, IonIcon, addAlpha } from '@local/shared-components';
import styled, { css } from 'styled-components';
import { NoteType } from './types';
import { SectionsType } from './useMedicalNoteSections';
import { TreatmentAndInterventions } from './TreatmentAndInterventions';
import { find } from 'lodash-es';
import { useCallContext } from '../../../context/AppContext';

type MedicalNoteProps = {
  section: NoteType;
  sections: SectionsType;
  setSection: React.Dispatch<React.SetStateAction<NoteType>>;
};

export function MedicalNote({
  sections = [],
  setSection,
  section,
}: MedicalNoteProps) {
  const { userType } = useCallContext();
  const readOnly = userType === "personnel";
  return (
    <Flex direction="column" fullWidth fullHeight padding="sm" gap="xs">
      <StyledTabRoot fullWidth padding="xs" justify="space-between" gap="xs">
        {sections.map(({ icon, section: rowSection, hasNotication }) => (
          <Badge style={{ boxShadow: 'none' }} dot={hasNotication}>
            <StyledButton
              key={rowSection}
              type="primary"
              shape="default"
              size="middle"
              icon={<IonIcon name={icon} size={20} outlined={section !== rowSection} />}
              active={section === rowSection}
              onClick={() => setSection(rowSection)}
            />
          </Badge>
        ))}
      </StyledTabRoot>
      {section === 'reason_for_visit' ? (
        <VisitationReason
          readOnly={readOnly}
          value={find(sections, { section: 'reason_for_visit' })?.content}
        />
      ) : null}
      {section === 'assessment_and_diagnosis' ? (
        <AssessmentAndDiagnosis
          readOnly={readOnly}
          value={
            find(sections, { section: 'assessment_and_diagnosis' })?.content
          }
        />
      ) : null}
      {section === 'treatment_and_interventions' ? (
        <TreatmentAndInterventions
          readOnly={readOnly}
          value={
            find(sections, { section: 'treatment_and_interventions' })?.content
          }
        />
      ) : null}
      {section === 'follow_up_plans' ? (
        <FollowUpPlan
          readOnly={readOnly}
          value={find(sections, { section: 'follow_up_plans' })?.content}
        />
      ) : null}
    </Flex>
  );
}

const StyledTabRoot = styled(Flex)`
  background: ${({ theme }) => theme.palette.primary1.main};
  border-radius: ${({ theme }) => theme.spacing.xs};
  span {
    width: 100%;
  }
`;

const StyledButton = styled(Button)<{
  active?: boolean;
}>`
  font-weight: bold;
  flex: 1;
  background: ${({ theme }) => addAlpha(theme.palette.primary1.lighter, 0.2)};
  min-width: 100%;
  text-transform: capitalize;
  ${({ active, theme }) =>
    active &&
    css`
      background: ${theme.palette.primary2.main};
      color: ${theme.palette.common.black};
    `}
`;
