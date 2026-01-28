import styled from "styled-components";

interface Props {
  username: string;
  text: string;
  time: string;
  onReply?: () => void;
}

export function CommentItem({ username, text, time, onReply }: Props) {
  return (
    <Wrapper>
      <Avatar />
      <TextArea>
        <Username>{username}</Username>
        <CommentText>{text}</CommentText>
        <MetaRow>
          <Time>{time}</Time>
          <ReplyButton type="button" onClick={onReply ?? (() => {})}>
            답글달기
          </ReplyButton>
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
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Username = styled.div`
  font-weight: 700;
  color: #fafafa;
`;

const CommentText = styled.div`
  color: #e5e5e5;
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

const ReplyButton = styled.button`
  font-size: 12px;
  color: #a1a1a1;
  cursor: pointer;
`;
