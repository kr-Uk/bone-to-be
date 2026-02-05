import { type ReactNode, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";

type LazySectionProps = {
  children: ReactNode;
  minHeight?: string;
  rootMargin?: string;
  fallback?: ReactNode;
  onVisible?: () => void;
};

export const LazySection = ({
  children,
  minHeight,
  rootMargin = "600px 0px",
  fallback = null,
  onVisible,
}: LazySectionProps) => {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const target = placeholderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
        }
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  useEffect(() => {
    if (!shouldRender || !onVisible) return;
    const frame = requestAnimationFrame(() => onVisible());
    return () => cancelAnimationFrame(frame);
  }, [onVisible, shouldRender]);

  return (
    <Placeholder ref={placeholderRef} $minHeight={minHeight}>
      {shouldRender ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </Placeholder>
  );
};

const Placeholder = styled.div<{ $minHeight?: string }>`
  width: 100%;
  min-height: ${({ $minHeight }) => $minHeight ?? "1px"};
`;
