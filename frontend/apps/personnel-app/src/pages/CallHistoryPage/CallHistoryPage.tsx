import { Flex } from '@local/shared-components';
import { List } from 'antd-mobile';
import { CallHistoryItem } from './CallHistoryItem';

export function CallHistoryPage() {
  function handleClick() {
    // ...
  }
  return (
    <List mode="card" style={{ width: '100%', height: '100%', paddingTop: 16 }}>
      <List.Item onClick={handleClick}>
        <CallHistoryItem />
      </List.Item>
      <List.Item onClick={handleClick}>
        <CallHistoryItem />
      </List.Item>
      <List.Item onClick={handleClick}>
        <CallHistoryItem />
      </List.Item>
      <List.Item onClick={handleClick}>
        <CallHistoryItem />
      </List.Item>
      <List.Item onClick={handleClick}>
        <CallHistoryItem />
      </List.Item>
      <List.Item onClick={handleClick}>
        <CallHistoryItem />
      </List.Item>
      <List.Item onClick={handleClick}>
        <CallHistoryItem />
      </List.Item>
      <List.Item onClick={handleClick}>
        <CallHistoryItem />
      </List.Item>
      <List.Item onClick={handleClick}>
        <CallHistoryItem />
      </List.Item>
    </List>
  );
}
