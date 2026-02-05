import styled from "styled-components";

export const RightContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #262626;
  overflow-y: auto;
  position: relative;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

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

  @media (max-width: 430px) {
    overflow-y: hidden;
  }

  @media (max-width: 430px) {
    overflow-y: hidden;
  }
`;

export const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const BottomStack = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
`;

export const DesktopHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #3f3f3f;
  background: #262626;

  @media (max-width: 430px) {
    display: none;
  }
`;

export const DesktopAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #525252;
  flex-shrink: 0;
  cursor: pointer;
`;

export const DesktopAvatarFallback = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #525252;
  flex-shrink: 0;
  cursor: pointer;
`;

export const DesktopName = styled.div`
  color: #fafafa;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
`;

export const DesktopMeta = styled.div`
  color: #a1a1a1;
  font-size: 13px;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #525252;
  flex-shrink: 0;
  cursor: pointer;
  display: grid;
  place-items: center;
  overflow: hidden;
  position: relative;
`;

export const AvatarImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  border-radius: 50%;
`;

export const AvatarFallback = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #737373;
`;

export const Username = styled.div`
  color: #fafafa;
  font-weight: 600;
  cursor: pointer;
`;

export const PostContent = styled.div`
  padding: 12px;
  display: inline-flex;
  flex: 0 0 Auto;
  gap: 6px;
  position: relative;
`;

export const Text = styled.p`
  color: #fafafa;

  @media (max-width: 430px) {
    font-size: 14px; /* Mobile */
  }
`;

export const Tags = styled.div`
  color: #9810fa;
`;

export const Time = styled.div`
  color: #a1a1a1;
  font-size: 13px;
`;

export const Footer = styled.div`
  padding: 16px 16px 0;
  position: relative;
  background-color: #262626;

  @media (max-width: 430px) {
    padding: 8px 16px 4px;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const LeftActions = styled.div`
  display: flex;
  gap: 16px;
`;

export const IconButton = styled.button`
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

export const HeartButton = styled.button<{ $liked: boolean }>`
  font-size: 20px;
  cursor: pointer;
  color: ${({ $liked }) => ($liked ? "#ef4444" : "#fafafa")};

  svg {
    transition:
      transform 0.2s ease,
      color 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.15);
  }

  &:active svg {
    transform: scale(1.3);
  }
`;

export const LikesButton = styled.button`
  color: #fafafa;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease;

  &:hover {
    color: #e5e5e5;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 430px) {
    font-size: 14px;
  }
`;

export const FixedInput = styled.div`
  position: relative;
  background: #262626;
  padding: 12px 16px;
  border-top: 1px solid #525252;

  @media (max-width: 430px) {
    padding: 12px 16px 12px;
  }
`;
