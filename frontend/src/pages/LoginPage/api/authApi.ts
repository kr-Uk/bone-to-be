import axiosInstance from "@/shared/api/axios";

export type EmailCheckResponse = {
  code: number;
  message: string;
  data: {
    hasEmail: boolean;
  };
};

export type NicknameCheckResponse = {
  code: number;
  message: string;
  data: {
    hasNickname: boolean;
  };
};

export type LoginResponse = {
  message: string;
};

export type SignUpResponse = {
  code: number;
  message: string;
  data: {
    id: number;
    email: string;
    nickname: string;
  } | null;
};

export type SignUpPayload = {
  nickname: string;
  email: string;
  authCode: string;
  password: string;
  passwordConfirm: string;
};

export const checkEmail = async (email: string) => {
  const { data } = await axiosInstance.get<EmailCheckResponse>("/api/auth/check/email", {
    params: { email },
  });
  return data;
};

export const sendEmailValidation = async (email: string) => {
  await axiosInstance.post("/api/auth/email/validate", { email });
};

export const confirmEmailValidation = async (email: string, code: string) => {
  await axiosInstance.get("/api/auth/email/validate", {
    params: { email, code },
  });
};

export const checkNickname = async (nickname: string) => {
  const { data } = await axiosInstance.get<NicknameCheckResponse>("/api/auth/check/nickname", {
    params: { nickname },
  });
  return data;
};

export const login = async (email: string, password: string) => {
  const payload = new URLSearchParams({ email, password });
  const { data } = await axiosInstance.post<LoginResponse>("/api/auth/login", payload, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
};

export const signup = async (payload: SignUpPayload) => {
  const { data } = await axiosInstance.post<SignUpResponse>("/api/auth/signup", payload);
  return data;
};
