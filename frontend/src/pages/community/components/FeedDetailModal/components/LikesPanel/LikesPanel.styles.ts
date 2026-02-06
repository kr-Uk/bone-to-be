import styled from "styled-components";

export const LikesOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

export const LikesPanel = styled.div`
  --likes-item-height: 72px;
  --likes-visible-count: 7;
  width: min(640px, 92vw);
  height: calc(var(--likes-item-height) * var(--likes-visible-count) + 56px);
  max-height: calc(var(--likes-item-height) * var(--likes-visible-count) + 56px);
  background: #202124;
  border: 1px solid #2f3033;
  border-radius: 18px;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const LikesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 14px 18px;
  border-bottom: 1px solid #2f3033;
`;

export const LikesTitle = styled.div`
  color: #fafafa;
  font-size: 18px;
  font-weight: 700;
`;

export const LikesCloseButton = styled.button`
  color: #a1a1a1;
  font-size: 22px;
  cursor: pointer;
  transition: color 0.2s ease;
  position: absolute;
  right: 16px;
  top: 8px;

  &:hover {
    color: #fafafa;
  }
`;

export const LikesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  padding: 6px 0;
  max-height: calc(var(--likes-item-height) * var(--likes-visible-count));
`;

export const LikeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  min-height: 72px;
`;

export const LikeLeft = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const LikeName = styled.div`
  color: #fafafa;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
`;

export const LikeMeta = styled.div`
  color: #a1a1a1;
  font-size: 14px;
`;

export const LikesEmpty = styled.div`
  color: #a1a1a1;
  font-size: 15px;
  padding: 16px 18px;
`;

export const FollowButton = styled.button`
  background: var(--neutral-800, #262626);
  color: var(--neutral-200, #e5e5e5);
  font-weight: 700;
  font-size: 14px;
  padding: 8px 18px;
  border-radius: 999px;
  outline: 1px solid var(--neutral-600, #525252);
  outline-offset: -1px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &[data-active="false"] {
    background: var(--color-brand-primary-900, #59168b);
    outline-color: var(--color-brand-primary-900, #59168b);
    color: var(--neutral-50, #fafafa);
  }

  &:hover {
    background: #2f3033;
    transform: translateY(-1px);
  }

  &[data-active="false"]:hover {
    background: var(--color-brand-primary-800, #6b21a8);
  }

  &:active {
    transform: translateY(0);
  }
`;
