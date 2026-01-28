import axiosInstance from "@/shared/api/axios";

export type DeleteMeResponse = {
  message?: string;
};

export const deleteMe = async (): Promise<DeleteMeResponse> => {
  const { data } = await axiosInstance.delete<DeleteMeResponse>("/users/me");
  return data;
};
