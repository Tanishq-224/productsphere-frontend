import api from "../api/axios";

/* =========================
   SUBMIT CONTACT FORM
========================= */

export const submitContact = async (formData) => {
  const response = await api.post("/contact", formData);
  return response.data;
};
