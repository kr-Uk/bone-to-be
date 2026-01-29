import axiosInstance from "@/shared/api/axios";

export type Me = {
  email: string;
  nickname: string;
  role?: string;
  avatarUrl?: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
};

export type LogoutResponse = {
  message?: string;
};

export type PasswordResetRequestPayload = {
  email: string;
};

export type PasswordResetRequestResponse = {
  message?: string;
};

export type PasswordResetVerifyResponse = {
  code: number;
  message: string;
  data: null;
};

export type PasswordResetConfirmPayload = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type PasswordResetConfirmResponse = {
  code: number;
  message: string;
  data: null;
};

export const getMe = async (): Promise<Me> => {
  const { data } = await axiosInstance.get<Me>("/auth/me");
  if (!data) {
    throw new Error("인증 정보가 없습니다");
  }
  return data;
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const form = new URLSearchParams();
  form.set("email", payload.email);
  form.set("password", payload.password);

  const { data } = await axiosInstance.post<LoginResponse>("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const { data } = await axiosInstance.post<LogoutResponse>("/auth/logout");
  return data;
};

export const requestPasswordReset = async (
  payload: PasswordResetRequestPayload,
): Promise<PasswordResetRequestResponse> => {
  const { data } = await axiosInstance.post<PasswordResetRequestResponse>(
    "/auth/password/reset/request",
    payload,
  );
  return data;
};

export const verifyPasswordResetToken = async (token: string): Promise<PasswordResetVerifyResponse> => {
  const { data } = await axiosInstance.get<PasswordResetVerifyResponse>(
    "/auth/password/reset/verify",
    { params: { token } },
  );
  return data;
};

export const confirmPasswordReset = async (
  payload: PasswordResetConfirmPayload,
): Promise<PasswordResetConfirmResponse> => {
  const { data } = await axiosInstance.post<PasswordResetConfirmResponse>(
    "/auth/password/reset/confirm",
    payload,
  );
  return data;
};
