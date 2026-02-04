import styled from "styled-components";

import { CommentItem } from "./CommentItem";

interface Props {
  userId: string;
  username: string;
  avatarUrl?: string | null;
  text: string;
  time: string;
  onUserClick?: (userId: string) => void;
}

export function CommentRow(props: Props) {
  return (
    <Row>
      <CommentItem
        username={props.username}
        avatarUrl={props.avatarUrl}
        text={props.text}
        time={props.time}
        onUserClick={() => props.onUserClick?.(props.userId)}
      />
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; /* 세로 중앙 */
  gap: 12px;
`;
