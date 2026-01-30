import { useEffect, useMemo, useState } from "react";

import type { SectionId } from "@/pages/AboutPage/hooks/useScrollSpy";

type AnimationState = "in" | "out";

type AnimationMap = Record<SectionId, AnimationState>;

const buildInitialState = (ids: readonly SectionId[]) =>
  ids.reduce<AnimationMap>((acc, id) => {
    acc[id] = "out";
    return acc;
  }, {} as AnimationMap);

export const useSectionAnimation = (sectionIds: readonly SectionId[]) => {
  const idsKey = sectionIds.join("|");
  const ids = useMemo(() => [...sectionIds], [idsKey]);
  const [state, setState] = useState<AnimationMap>(() => buildInitialState(ids));

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setState((prev) => {
          const next = { ...prev };
          entries.forEach((entry) => {
            const id = entry.target.id as SectionId;
            next[id] = entry.isIntersecting ? "in" : "out";
          });
          return next;
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids]);

  return state;
};
