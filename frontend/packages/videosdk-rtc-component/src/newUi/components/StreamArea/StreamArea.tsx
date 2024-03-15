import { Flex, Typography } from '@local/shared-components';
import { Layout } from 'antd';
import { useState } from 'react';
import { SideContent } from './SideContent';

export type StreamAreaProps = {
  sideView?: 'chats' | 'participants' | 'menu';
  onClose: () => void;
}

export function StreamArea({ sideView, onClose }: StreamAreaProps) {
  
  return (
    <Flex flex={1} justify="center" fullHeight>
      <Layout style={{ minHeight: '100%', background: 'transparent' }}>
        <Layout.Sider
          collapsible
          collapsed={!sideView}
          onCollapse={(value) => onClose()}
          width={400}
          collapsedWidth={0}
          style={{ background: 'transparent', overflow: "hidden" }}
          trigger={null}
        >
        <SideContent onClose={() => onClose()} />
        </Layout.Sider>
        <Layout style={{ background: 'transparent' }}>
          <Layout.Content style={{ background: 'transparent' }}>
            <Flex fullHeight fullWidth justify="center">
              <Typography color="common.white">Main area: <strong>{sideView}</strong></Typography>
            </Flex>
          </Layout.Content>
        </Layout>
      </Layout>
    </Flex>
  );
}
