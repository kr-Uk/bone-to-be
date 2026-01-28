import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import { useFeedCreate } from "../../api/useCommunityQueries";

import * as S from "./FeedCreateModal.styles";
import { FeedFormSection, ProfileHeader } from "./FeedFormSection";
import { FeedImageUpload } from "./FeedImageUpload";
import { feedFormSchema, type FeedFormValues } from "./validation";

import type { FeedCreateModalProps } from "./types";

export function FeedCreateModal({ isOpen, onClose }: FeedCreateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const { mutate: createFeed, isPending: isSubmitting } = useFeedCreate();

  // Initialize React Hook Form
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FeedFormValues>({
    resolver: zodResolver(feedFormSchema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      content: "",
      height: "",
      weight: "",
      styles: [],
    },
  });

  // Watch image for preview
  const imageFile = watch("image");
  const contentValue = watch("content");

  // Create image preview URL
  const imagePreview = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  // Handle form submission
  const onSubmit = handleSubmit((data) => {
    // Transform data to match API requirements
    const apiData = {
      ...data,
      height: data.height ? parseInt(data.height, 10) : 0,
      weight: data.weight ? parseInt(data.weight, 10) : undefined,
    };

    createFeed(apiData, {
      onSuccess: () => {
        reset(); // Reset form
        onClose();
      },
      onError: (error) => {
        console.error("Failed to create feed:", error);
        // TODO: Show error toast
      },
    });
  });

  // Handle close
  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    reset(); // Reset form on close
    onClose();
  }, [isSubmitting, onClose, reset]);

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
        <S.ModalContent>
          {/* Desktop: ImageSection outside FormSection (Left) */}
          <S.DesktopImageSection>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <FeedImageUpload
                  imagePreview={imagePreview}
                  onImageChange={(file) => field.onChange(file)}
                />
              )}
            />
          </S.DesktopImageSection>

          <S.FormSection>
            <ProfileHeader />

            <S.ScrollableContent>
              {/* Mobile/Tablet: ImageSection inside ScrollableContent */}
              <S.MobileTabletImageSection>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <FeedImageUpload
                      imagePreview={imagePreview}
                      onImageChange={(file) => field.onChange(file)}
                    />
                  )}
                />
              </S.MobileTabletImageSection>

              <FeedFormSection
                control={control}
                register={register}
                errors={errors}
                contentLength={contentValue?.length || 0}
                onSubmit={onSubmit}
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
