import axiosInstance from "@/shared/api/axios";

export type Me = {
  email: string;
  nickname: string;
  role?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
};

export const getMe = async (): Promise<Me> => {
  const { data } = await axiosInstance.get<Me>("/api/auth/me");
  return data;
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const form = new URLSearchParams();
  form.set("email", payload.email);
  form.set("password", payload.password);

  const { data } = await axiosInstance.post<LoginResponse>("/api/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return data;
};

export const logout = async (): Promise<{ message?: string }> => {
  const { data } = await axiosInstance.post("/api/auth/logout");
  return data;
};
