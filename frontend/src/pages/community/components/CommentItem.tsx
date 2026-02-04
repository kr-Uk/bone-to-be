import styled from "styled-components";

interface Props {
  username: string;
  avatarUrl?: string | null;
  text: string;
  time: string;
  onUserClick?: () => void;
}

export function CommentItem({ username, avatarUrl, text, time, onUserClick }: Props) {
  return (
    <Wrapper>
      <Avatar onClick={onUserClick}>
        {avatarUrl ? <AvatarImage src={avatarUrl} alt={`${username} avatar`} /> : <AvatarDummy />}
      </Avatar>
      <TextArea>
        <Username onClick={onUserClick}>{username}</Username>
        <CommentText>{text}</CommentText>
        <MetaRow>
          <Time>{time}</Time>
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
  display: grid;
  place-items: center;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const AvatarDummy = styled.div`
  width: 12px;
  height: 12px;
  background: #737373;
  border-radius: 50%;
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

