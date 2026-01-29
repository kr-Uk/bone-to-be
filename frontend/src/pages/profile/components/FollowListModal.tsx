import { useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import styled from "styled-components";

import { Text } from "./ProfileCommon";

import type { FollowModalType, FollowUser } from "../api/profile.types";

type Props = {
  type: FollowModalType;
  users: FollowUser[];
  onClose: () => void;
  onUnfollow?: (userId: string) => void;
  onToggleFollow?: (userId: string) => void;
  isLoading?: boolean;
  errorMessage?: string;
};

export const FollowListModal = ({
  type,
  users,
  onClose,
  onUnfollow,
  onToggleFollow,
  isLoading = false,
  errorMessage,
}: Props) => {
  const [query, setQuery] = useState("");

  const title = type === "following" ? "팔로잉" : "팔로워";
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.username.toLowerCase().includes(q) || (u.bio ?? "").toLowerCase().includes(q),
    );
  }, [query, users]);

  const statusMessage = errorMessage
    ? errorMessage
    : isLoading
      ? "불러오는 중..."
      : filtered.length
        ? null
        : query
          ? "검색 결과가 없습니다."
          : "표시할 사용자가 없습니다.";

  return (
    <ModalRoot role="dialog" aria-modal="true" aria-label={`${title} 목록`}>
      <Header>
        <HeaderLeft>
          <Title as="span">{title}</Title>
          <CountBadge as="span">{users.length}</CountBadge>
        </HeaderLeft>

        <IconButton type="button" onClick={onClose} aria-label="닫기">
          <IoIosClose size={30} color="#9ca3af" />
        </IconButton>
      </Header>

      <SearchSection>
        <SearchWrap>
          <IoIosSearch size={20} color="#9ca3af" />
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="검색"
          />
        </SearchWrap>
      </SearchSection>

      <List>
        {statusMessage ? (
          <EmptyState as="p">{statusMessage}</EmptyState>
        ) : (
          filtered.map((user) => (
            <FollowRow
              key={user.id}
              type={type}
              user={user}
              onUnfollow={onUnfollow}
              onToggleFollow={onToggleFollow}
            />
          ))
        )}
      </List>
    </ModalRoot>
  );
};

function FollowRow({
  type,
  user,
  onUnfollow,
  onToggleFollow,
}: {
  type: FollowModalType;
  user: FollowUser;
  onUnfollow?: (userId: string) => void;
  onToggleFollow?: (userId: string) => void;
}) {
  const buttonLabel =
    type === "following" ? "Following" : user.isFollowing ? "Following" : "Follow";

  const handleClick = () => {
    if (type === "following") {
      onUnfollow?.(user.id);
      return;
    }
    onToggleFollow?.(user.id);
  };

  const isActive = buttonLabel === "Following";

  return (
    <Row>
      <RowLeft>
        <Avatar>
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={`${user.username} avatar`} />
          ) : (
            <AvatarDummy />
          )}
        </Avatar>

        <Info>
          <TopLine>
            <Username as="span">{user.username}</Username>
            {user.styleTag ? <StyleBadge as="span">{user.styleTag}</StyleBadge> : null}
          </TopLine>

          {user.bio ? <Bio as="span">{user.bio}</Bio> : null}
        </Info>
      </RowLeft>

      <ActionButton type="button" data-active={isActive} onClick={handleClick}>
        {buttonLabel}
      </ActionButton>
    </Row>
  );
}

const ModalRoot = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--neutral-800, #262626);
  box-shadow: 0 1.5625rem 3.125rem -0.75rem rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border-radius: 1rem;
  outline: 0.0625rem var(--neutral-600, #525252) solid;
  outline-offset: -0.0625rem;
  backdrop-filter: blur(0.75rem);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 1.25rem;
  border-bottom: 0.041875rem var(--neutral-50, #fafafa) solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled(Text)`
  color: var(--neutral-50, #fafafa);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.75rem;
`;

const CountBadge = styled(Text)`
  padding: 0.104375rem 0.479375rem;
  background: var(--color-brand-primary-900, #59168b);
  border-radius: 624.9375rem;
  outline: 0.0625rem var(--color-brand-primary-900, #59168b) solid;
  outline-offset: -0.0625rem;
  color: var(--color-brand-primary-200, #e9d4ff);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
`;

const IconButton = styled.button`
  padding: 0.5rem;
  border-radius: 624.9375rem;
  background: transparent;
  border: none;
  display: inline-flex;
  cursor: pointer;
`;

const SearchSection = styled.div`
  padding: 1rem;
`;

const SearchWrap = styled.div`
  height: 2.583125rem;
  position: relative;
  background: var(--neutral-800, #262626);
  border-radius: 0.5rem;
  border: 0.0625rem var(--neutral-500, #737373) solid;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.75rem;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--neutral-50, #fafafa);
  font-size: 0.875rem;
  font-family: Pretendard;
  line-height: 1.25rem;

  &::placeholder {
    color: var(--neutral-400, #a1a1a1);
  }
`;

const List = styled.div`
  padding: 0.5rem;
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EmptyState = styled(Text)`
  color: var(--neutral-400, #a1a1a1);
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;
  padding: 1.5rem 0;
`;

const Row = styled.div`
  padding: 0.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  background: var(--neutral-900, #171717);
  overflow: hidden;
  border-radius: 624.9375rem;
  outline: 0.0625rem var(--neutral-700, #404040) solid;
  outline-offset: -0.0625rem;
  display: grid;
  place-items: center;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarDummy = styled.div`
  width: 1rem;
  height: 1rem;
  background: var(--neutral-600, #525252);
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TopLine = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const Username = styled(Text)`
  color: var(--neutral-50, #fafafa);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
`;

const StyleBadge = styled(Text)`
  padding: 0 0.354375rem;
  background: var(--color-brand-primary-900, #59168b);
  border-radius: 0.25rem;
  outline: 0.0625rem var(--color-brand-primary-900, #59168b) solid;
  outline-offset: -0.0625rem;
  color: var(--neutral-300, #d4d4d4);
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.9375rem;
`;

const Bio = styled(Text)`
  color: var(--neutral-300, #d4d4d4);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
`;

const ActionButton = styled.button`
  width: 6rem;
  padding: 0.354375rem 0.979375rem;
  background: var(--neutral-800, #262626);
  border-radius: 0.5rem;
  outline: 0.0625rem var(--neutral-600, #525252) solid;
  outline-offset: -0.0625rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: var(--neutral-200, #e5e5e5);
  font-size: 0.75rem;
  font-family: Pretendard;
  font-weight: 700;
  line-height: 1rem;

  &[data-active="false"] {
    outline-color: var(--color-brand-primary-900, #59168b);
  }
`;
