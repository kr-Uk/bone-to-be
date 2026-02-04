import styled from "styled-components";

interface Props {
  username: string;
  text: string;
  time: string;
  likeCount: number;
  onUserClick?: () => void;
}

const formatCount = (count: number) => count.toLocaleString();

export function CommentItem({ username, text, time, likeCount, onUserClick }: Props) {
  return (
    <Wrapper>
      <Avatar onClick={onUserClick} />
      <TextArea>
        <Username onClick={onUserClick}>{username}</Username>
        <CommentText>{text}</CommentText>
        <MetaRow>
          <Time>{time}</Time>
          {likeCount > 0 ? <LikeCount>좋아요 {formatCount(likeCount)}개</LikeCount> : null}
        </MetaRow>
      </TextArea>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #525252;
  flex-shrink: 0;
  cursor: pointer;
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Username = styled.div`
  font-weight: 600;
  color: #fafafa;
  cursor: pointer;
  @media (max-width: 430px) {
    font-size: 14px;
  }
`;

const CommentText = styled.div`
  color: #e5e5e5;
  @media (max-width: 430px) {
    font-size: 14px;
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Time = styled.div`
  font-size: 12px;
  color: #a1a1a1;
`;

const LikeCount = styled.div`
  font-size: 12px;
  color: #a1a1a1;
  font-weight: 600;
`;
