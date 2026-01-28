import { useCallback, useEffect, useRef, useState } from "react";

import { useFeedCreate } from "../../api/useCommunityQueries";

import * as S from "./FeedCreateModal.styles";
import { FeedFormSection, ProfileHeader } from "./FeedFormSection";
import { FeedImageUpload } from "./FeedImageUpload";

import type { BodyType, FeedCreateModalProps, Gender } from "./types";

export function FeedCreateModal({ isOpen, onClose }: FeedCreateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [bodyType, setBodyType] = useState<BodyType | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [styles, setStyles] = useState<string[]>([]);

  const { mutate: createFeed, isPending: isSubmitting } = useFeedCreate();

  // Handle image change
  const handleImageChange = useCallback(
    (file: File | null) => {
      setImage(file);

      // Clean up previous preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      // Create new preview URL
      if (file) {
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
      } else {
        setImagePreview(null);
      }
    },
    [imagePreview],
  );

  // Validate form
  const isValid = image !== null && bodyType !== null && gender !== null && styles.length > 0;

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!isValid || isSubmitting || !image || !bodyType || !gender) return;

    createFeed(
      {
        image,
        content,
        bodyType,
        gender,
        height: height ? parseInt(height, 10) : 0,
        weight: weight ? parseInt(weight, 10) : undefined,
        styles,
      },
      {
        onSuccess: () => {
          // Reset form and close modal
          setImage(null);
          setImagePreview(null);
          setContent("");
          setBodyType(null);
          setGender(null);
          setHeight("");
          setWeight("");
          setStyles([]);
          onClose();
        },
        onError: (error) => {
          console.error("Failed to create feed:", error);
          // TODO: Show error toast
        },
      },
    );
  }, [
    isValid,
    isSubmitting,
    image,
    content,
    bodyType,
    gender,
    height,
    weight,
    styles,
    createFeed,
    onClose,
  ]);

  // Handle close
  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    onClose();
  }, [isSubmitting, onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose],
  );

  // Handle ESC key and focus trap
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && isOpen) {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Focus first element
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isSubmitting, handleClose]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  return (
    <S.ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <S.ModalContainer
        ref={modalRef}
        $isOpen={isOpen}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* <S.ModalHeader>
          <S.ModalTitle id="modal-title">새 게시글 작성하기</S.ModalTitle>
          <S.CloseButton onClick={handleClose} aria-label="Close modal">
            ×
          </S.CloseButton>
        </S.ModalHeader> */}

        <S.ModalContent>
          {/* Desktop: ImageSection outside FormSection (Left) */}
          <S.DesktopImageSection>
            <FeedImageUpload imagePreview={imagePreview} onImageChange={handleImageChange} />
          </S.DesktopImageSection>

          <S.FormSection>
            <ProfileHeader />

            <S.ScrollableContent>
              {/* Mobile/Tablet: ImageSection inside ScrollableContent */}
              <S.MobileTabletImageSection>
                <FeedImageUpload imagePreview={imagePreview} onImageChange={handleImageChange} />
              </S.MobileTabletImageSection>

              <FeedFormSection
                content={content}
                bodyType={bodyType}
                gender={gender}
                height={height}
                weight={weight}
                styles={styles}
                onContentChange={setContent}
                onBodyTypeChange={setBodyType}
                onGenderChange={setGender}
                onHeightChange={setHeight}
                onWeightChange={setWeight}
                onStylesChange={setStyles}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isValid={isValid}
              />
            </S.ScrollableContent>
          </S.FormSection>
        </S.ModalContent>
      </S.ModalContainer>
    </S.ModalOverlay>
  );
}
