import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createProfileImagePresignedUrl,
  updateMyProfile,
  uploadProfileImageToS3,
} from "../api/profile.api";

import { profileQueryKey } from "./useProfileQuery";

type ProfileImageUpdateParams = {
  file: File;
  nickname: string;
  bio: string;
};

export const useProfileImageUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, nickname, bio }: ProfileImageUpdateParams) => {
      console.log("[ProfileImage] presigned-url request", {
        originalFileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });
      const presignedResponse = await createProfileImagePresignedUrl({
        originalFileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });
      console.log("[ProfileImage] presigned-url response", presignedResponse);

      console.log("[ProfileImage] s3 upload start", {
        uploadUrl: presignedResponse.data.uploadUrl,
        contentType: file.type,
      });
      await uploadProfileImageToS3(presignedResponse.data.uploadUrl, file, file.type);
      console.log("[ProfileImage] s3 upload success");

      console.log("[ProfileImage] update profile request", {
        nickname,
        bio,
        profileImageId: presignedResponse.data.fileId,
      });
      await updateMyProfile({
        nickname,
        bio,
        profileImageId: presignedResponse.data.fileId,
      });
      console.log("[ProfileImage] update profile success");

      return { profileImageId: presignedResponse.data.fileId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey() });
    },
    onError: (error) => {
      console.error("[ProfileImage] update profile error", error);
    },
  });
};
