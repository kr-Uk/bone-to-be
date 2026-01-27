import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

interface DropdownPortalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onBackdropClick?: () => void;
  showBackdrop?: boolean;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9998;
  animation: fadeIn 0.2s ease;

  /* Only show on mobile */
  @media (min-width: 768px) {
    display: none;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Singleton portal root
let portalRoot: HTMLElement | null = null;

function getPortalRoot(): HTMLElement {
  if (!portalRoot) {
    portalRoot = document.getElementById("dropdown-portal-root");
    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.id = "dropdown-portal-root";
      document.body.appendChild(portalRoot);
    }
  }
  return portalRoot;
}

/**
 * Portal component for rendering dropdowns outside parent hierarchy
 * Solves scroll conflicts and z-index stacking issues on mobile
 */
export function DropdownPortal({
  isOpen,
  children,
  onBackdropClick,
  showBackdrop = true,
}: DropdownPortalProps) {
  const portalRootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalRootRef.current = getPortalRoot();
  }, []);

  if (!isOpen || !portalRootRef.current) {
    return null;
  }

  return createPortal(
    <>
      {showBackdrop && <Backdrop onClick={onBackdropClick} />}
      {children}
    </>,
    portalRootRef.current,
  );
}
