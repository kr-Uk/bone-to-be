import styled from "styled-components";

interface Props {
  username: string;
  text: string;
  time: string;
}

export function CommentItem({ username, text, time }: Props) {
  return (
    <Wrapper>
      <Avatar />
      <TextArea>
        <Username>{username}</Username>
        <CommentText>{text}</CommentText>
        <Time>{time}</Time>
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

const Time = styled.div`
  font-size: 12px;
  color: #a1a1a1;
`;
