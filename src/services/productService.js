import api from "../api/axios";

/* =========================
   GET ALL PRODUCTS
========================= */

export const getAllProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};


/* =========================
   GET PRODUCT BY SLUG
========================= */

export const getProductBySlug = async (slug) => {
  const response = await api.get(
    `/products/${slug}`
  );

  return response.data;
};


/* =========================
   CREATE PRODUCT
========================= */

export const createProduct = async (formData) => {
  const response = await api.post(
    "/products",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


/* =========================
   UPDATE PRODUCT
========================= */

export const updateProduct = async (
  slug,
  formData
) => {
  const response = await api.put(
    `/products/${slug}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


/* =========================
   DELETE PRODUCT
========================= */

export const deleteProduct = async (slug) => {
  const response = await api.delete(
    `/products/${slug}`
  );

  return response.data;
};