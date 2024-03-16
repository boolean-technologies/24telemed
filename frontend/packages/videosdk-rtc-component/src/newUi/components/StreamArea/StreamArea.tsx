import { Flex } from '@local/shared-components';
import { Layout } from 'antd';
import { SideContent } from './SideContent';
import { StreamLayout } from './Streaming';
import styled from 'styled-components';

export type StreamAreaProps = {
  sideView?: 'chats' | 'participants' | 'menu';
  onClose: () => void;
};

export function StreamArea({ sideView, onClose }: StreamAreaProps) {


  return (
    <Flex flex={1} justify="center" fullHeight>
      <StyledRootLayout collapsed={!sideView}>
        
        <Layout style={{ background: 'transparent' }}>
          <Flex
            fullHeight
            fullWidth
            justify="center"
            gap="md"
            direction="column"
          >
            <StreamLayout />
          </Flex>
        </Layout>
        <Layout.Sider
          collapsible
          collapsed={!sideView}
          onCollapse={(value) => onClose()}
          width={400}
          collapsedWidth={0}
          style={{ background: 'transparent', overflow: 'hidden' }}
          trigger={null}
        >
          <SideContent onClose={() => onClose()} />
        </Layout.Sider>
      </StyledRootLayout>
    </Flex>
  );
}

const StyledRootLayout = styled(Layout)<{
  collapsed: boolean;
}>`
  min-height: 100%;
  background: transparent;
  gap: ${({ theme, collapsed }) =>  collapsed ? theme.spacing.none : theme.spacing.md};
`;
