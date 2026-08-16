import api from "../api/axios";

/* =========================
   LOGIN
========================= */

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};

/* =========================
   SIGNUP
========================= */

export const signupUser = async (userData) => {
  const response = await api.post(
    "/auth/signup",
    userData
  );

  return response.data;
};

/* =========================
   VERIFY SIGNUP OTP
========================= */

export const verifyOtp = async (otpData) => {
  const response = await api.post(
    "/auth/verify-otp",
    otpData
  );

  return response.data;
};

/* =========================
   FORGOT PASSWORD
========================= */

export const forgotPassword = async (data) => {
  const response = await api.post(
    "/auth/forgot-password",
    data
  );

  return response.data;
};

/* =========================
   RESET PASSWORD
========================= */

export const resetPassword = async (data) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  );

  return response.data;
};