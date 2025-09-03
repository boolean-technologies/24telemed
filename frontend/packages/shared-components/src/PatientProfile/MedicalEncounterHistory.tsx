import React, { useState } from 'react';
import { List, Typography, Modal, Timeline, Card } from 'antd';
import styled from 'styled-components';
import { Flex } from '../Flex';
import { MedicalEncounter } from '@local/api-generated';
import { DateTime } from 'luxon';

const { Text } = Typography;

interface MedicalEncounterHistoryProps {
  encounters: MedicalEncounter[];
  pageSize?: number;
  total?: number;
  isLoading?: boolean;
  onPaginationChange?: (page: number, pageSize: number) => void;
}

export const MedicalEncounterHistory: React.FC<
  MedicalEncounterHistoryProps
> = ({ encounters, pageSize = 5, total, isLoading, onPaginationChange }) => {
  const [selectedEncounter, setSelectedEncounter] =
    useState<MedicalEncounter | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (encounter: MedicalEncounter) => {
    setSelectedEncounter(encounter);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedEncounter(null);
    setIsModalVisible(false);
  };

  return (
    <StyledContainer>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={encounters}
        pagination={{
          pageSize,
          onChange: onPaginationChange,
          total,
        }}
        loading={isLoading}
        renderItem={(encounter) => (
          <List.Item>
            <StyledCard onClick={() => showModal(encounter)} hoverable>
              <Flex direction="column" gap="xs">
              <Text>
                <b>Date:</b>{' '}
                  {DateTime.fromISO(encounter.created_at!).toFormat(
                    'EEE dd LLL. yyyy'
                  )}
                </Text>
              <Text>
                <b>Doctor:</b> {encounter.doctor_name}
              </Text>
                {encounter.reason_for_visit && (
                  <Text ellipsis>
                    <b>Reason for Visit:</b> {encounter.reason_for_visit}
                  </Text>
                )}
              </Flex>
            </StyledCard>
          </List.Item>
        )}
      />

      <Modal
        title="Encounter Details"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedEncounter && (
          <Flex direction="column" gap="sm">
            <Text>
              <b>Date:</b>{' '}
              {DateTime.fromISO(selectedEncounter.created_at!).toFormat(
                'EEE dd LLL. yyyy'
              )}
            </Text>
            <Text>
              <b>Doctor:</b> {selectedEncounter.doctor_name ?? '-'}
            </Text>
            <Text>
              <b>Reason for Visit:</b>{' '}
              <br/>
              {selectedEncounter.reason_for_visit ?? '-'}
            </Text>
            <StyledTimeline>
              <Timeline.Item color="blue">
                <Text>
                  <b>Assessment and Diagnosis:</b>{' '}
                 <br/>
                  {selectedEncounter.assessment_and_diagnosis ?? '-'}
                </Text>
              </Timeline.Item>
              <Timeline.Item color="green">
                <Text>
                  <b>Treatment and Interventions:</b>{' '}
                    <br/>
                  {selectedEncounter.treatment_and_interventions ?? '-'}
                </Text>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <Text>
                  <b>Follow-up Plans:</b>{' '}
                    <br/>
                  {selectedEncounter.follow_up_plans ?? '-'}
                </Text>
              </Timeline.Item>
            </StyledTimeline>
          </Flex>
        )}
      </Modal>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const StyledTimeline = styled(Timeline)`
  margin-top: 12px;
  .ant-timeline-item-head {
    background-color: ${({ theme }) => theme.palette.primary2.main};
  }
`;

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.palette.neutral.main};
`;