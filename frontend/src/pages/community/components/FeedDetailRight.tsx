import styled from "styled-components";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { IoIosMore } from "react-icons/io";
import { CommentRow } from "./CommentRow";

import { FaRegHeart, FaHeart, FaRegPaperPlane, FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useState, useRef } from "react";

export function FeedDetailRight() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(245);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <RightContainer>
      <Header>
        <UserInfo>
          <Avatar />
          <div>
            <Username>strong_ssong</Username>
            <SubInfo>Natural · Gumi, Korea</SubInfo>
          </div>
        </UserInfo>
        <IoIosMore color="#FAFAFA" size={25}/>
      </Header>

      <PostContent>
        <Avatar />
        <div>
          <Username>strong_ssong</Username>
          <Text>내추럴 체형에 딱 맞는 오버핏 자켓 스타일링!</Text>
          <Text>저랑 체형 비슷하신 분 이런 스탈 완전 추천</Text>
          <Tags>#Natural #OOTD #좋댓구알</Tags>
          <Time>2h ago</Time>
        </div>
      </PostContent>

      <CommentsSection>
        <CommentRow username="handsome_hojung" text="자켓 정보 알 수 있을까요?" time="1h ago" />
        <CommentRow username="junyong_cute" text="대박 너무 이뻐요 진심;;" time="1h ago" />
        <CommentRow username="junyong_cute" text="대박 너무 이뻐요 진심;;" time="1h ago" />
        <CommentRow username="junyong_cute" text="대박 너무 이뻐요 진심;;" time="1h ago" />
        <CommentRow username="junyong_cute" text="대박 너무 이뻐요 진심;;" time="1h ago" />
        <CommentRow username="junyong_cute" text="대박 너무 이뻐요 진심;;" time="1h ago" />
        <CommentRow username="junyong_cute" text="대박 너무 이뻐요 진심;;" time="1h ago" />
        <CommentRow username="junyong_cute" text="대박 너무 이뻐요 진심;;" time="1h ago" />
        <CommentRow username="junyong_cute" text="대박 너무 이뻐요 진심;;" time="1h ago" />
      </CommentsSection>

      <Footer>
        <ActionRow>
            <LeftActions>
            <HeartButton
            liked={liked}
              onClick={() => {
                setLiked(v => !v);
                setLikeCount(c => liked ? c - 1 : c + 1);
              }}
              >
              {liked ? <FaHeart /> : <FaRegHeart />}
            </HeartButton>

            <IconButton onClick={() => commentInputRef.current?.focus()}>
                <FaRegComment />
            </IconButton>

            <IconButton>
                <FaRegPaperPlane size={18}/>
            </IconButton>
            </LeftActions>

            <IconButton onClick={() => setSaved(v => !v)}>
            {saved ? <FaBookmark /> : <FaRegBookmark />}
            </IconButton>
        </ActionRow>

        <Likes>{likeCount} likes</Likes>

        <CommentInput ref={commentInputRef} />
      </Footer>
    </RightContainer>
  );
}

const RightContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #050505;
  overflow-y: auto;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;

  /* Chrome, Edge, Safari */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    transition: background 0.2s ease;
  }

`;



const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #525252;
`;

const UserInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #525252;
  flex-shrink: 0;
`;

const Username = styled.div`
  color: #fafafa;
  font-weight: 700;

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;

const SubInfo = styled.div`
  color: #a1a1a1;
  font-size: 14px;
`;

const PostContent = styled.div`
  padding: 20px;
  display: inline-flex;
  flex: 0 0 Auto;
  gap: 6px;
  position: relative;
`;

const Text = styled.p`
  color: #fafafa;

  @media (max-width: 390px) {
    font-size: 12px;
  }
`;

const Tags = styled.div`
  color: #9810fa;
`;

const Time = styled.div`
  color: #a1a1a1;
  font-size: 13px;
`;

const CommentsSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Desktop */

  @media (max-width: 768px) {
    gap: 12px; /* Tablet */
  }

  @media (max-width: 390px) {
    gap: 8px; /* Mobile */
  }
`;



const Footer = styled.div`
  padding: 16px;
  border-top: 1px solid #525252;
`;


const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const LeftActions = styled.div`
  display: flex;
  gap: 16px;
`;

const IconButton = styled.button`
  font-size: 20px;
  color: #fafafa;
  cursor: pointer;

  svg {
    transition: all 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.15);
  }
`;

const HeartButton = styled.button<{ liked: boolean }>`
  font-size: 20px;
  cursor: pointer;
  color: ${({ liked }) => (liked ? "#ef4444" : "#fafafa")};

  svg {
    transition: transform 0.2s ease, color 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.15);
  }

  &:active svg {
    transform: scale(1.3);
  }
`;


const Likes = styled.div`
  color: #fafafa;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;

