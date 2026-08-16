import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiImage,
  FiSave,
  FiX,
} from "react-icons/fi";

import {
  getProductBySlug,
  updateProduct,
} from "../../services/productService";
import useReveal from "../../hooks/useReveal";

import styles from "./ProductEdit.module.css";

const ProductEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const headerRef = useReveal({ delay: 0 });
  const basicInfoRef = useReveal({ delay: 100 });
  const descRef = useReveal({ delay: 200 });
  const galleryRef = useReveal({ delay: 300 });
  const actionsRef = useReveal({ delay: 400 });

  const [form, setForm] = useState({
    metaTitle: "",
    productName: "",
    price: "",
    discountedPrice: "",
    description: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL =
    import.meta.env.VITE_API_BASE_URL?.replace(
      /\/api\/?$/,
      ""
    );

  /* =========================
     FETCH PRODUCT
  ========================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getProductBySlug(slug);

        if (!result?.success || !result?.data) {
          setError(
            result?.message ||
              "Unable to load product."
          );
          return;
        }

        const product = result.data;

        setForm({
          metaTitle: product.metaTitle || "",
          productName: product.productName || "",
          price: product.price ?? "",
          discountedPrice:
            product.discountedPrice ?? "",
          description: product.description || "",
        });

        setExistingImages(
          product.galleryImages || []
        );
      } catch (error) {
        console.error(
          "Fetch product error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     IMAGE CHANGE
  ========================= */

  const handleImagesChange = (event) => {
    const files = Array.from(
      event.target.files || []
    );

    setNewImages(files);
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      if (
        Number(form.discountedPrice) >
        Number(form.price)
      ) {
        setError(
          "Discounted price cannot be greater than price."
        );
        return;
      }

      const formData = new FormData();

      formData.append(
        "metaTitle",
        form.metaTitle
      );

      formData.append(
        "productName",
        form.productName
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "discountedPrice",
        form.discountedPrice
      );

      formData.append(
        "description",
        form.description
      );

      /*
       * Backend replaces existing gallery
       * only when new files are provided.
       */

      newImages.forEach((file) => {
        formData.append(
          "galleryImages",
          file
        );
      });

      const result = await updateProduct(
        slug,
        formData
      );

      if (!result?.success) {
        setError(
          result?.message ||
            "Unable to update product."
        );
        return;
      }

      setSuccess(
        "Product updated successfully."
      );

      setTimeout(() => {
        navigate(
          `/products/${result.data.slug}`,
          { replace: true }
        );
      }, 800);
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.status}>
            <div className={styles.loader} />
            <p>Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error && !form.productName) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <Link
            to={`/products/${slug}`}
            className={styles.backButton}
          >
            <FiArrowLeft />
            Back to Product
          </Link>

          <div className={styles.status}>
            <p className={styles.error}>
              {error}
            </p>

            <Link
              to="/products"
              className={styles.secondaryButton}
            >
              Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* BACK */}

        <Link
          to={`/products/${slug}`}
          className={styles.backButton}
        >
          <FiArrowLeft />
          <span>Back to Product</span>
        </Link>

        {/* HEADER */}

        <section ref={headerRef} className={`${styles.header} reveal`}>
          <div>
            <span className={styles.eyebrow}>
              PRODUCT MANAGEMENT
            </span>

            <h1 className={styles.heading}>
              Edit{" "}
              <span>product.</span>
            </h1>

            <p className={styles.description}>
              Update your product information,
              pricing and gallery images.
            </p>
          </div>
        </section>

        {/* FORM */}

        <form
          className={styles.formCard}
          onSubmit={handleSubmit}
        >

          {/* BASIC INFO */}

          <div ref={basicInfoRef} className={`${styles.section} reveal`}>
            <div className={styles.sectionHeader}>
              <h2>
                Product Information
              </h2>

              <p>
                Update the basic product details.
              </p>
            </div>

            <div className={styles.grid}>

              {/* META TITLE */}

              <div className={styles.field}>
                <label htmlFor="metaTitle">
                  Meta Title
                </label>

                <input
                  id="metaTitle"
                  name="metaTitle"
                  type="text"
                  value={form.metaTitle}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  placeholder="Enter meta title"
                />
              </div>

              {/* PRODUCT NAME */}

              <div className={styles.field}>
                <label htmlFor="productName">
                  Product Name
                </label>

                <input
                  id="productName"
                  name="productName"
                  type="text"
                  value={form.productName}
                  onChange={handleChange}
                  maxLength={150}
                  required
                  placeholder="Enter product name"
                />
              </div>

              {/* PRICE */}

              <div className={styles.field}>
                <label htmlFor="price">
                  Price
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="Enter price"
                />
              </div>

              {/* DISCOUNTED PRICE */}

              <div className={styles.field}>
                <label htmlFor="discountedPrice">
                  Discounted Price
                </label>

                <input
                  id="discountedPrice"
                  name="discountedPrice"
                  type="number"
                  min="0"
                  value={
                    form.discountedPrice
                  }
                  onChange={handleChange}
                  required
                  placeholder="Enter discounted price"
                />
              </div>

            </div>
          </div>

          {/* DESCRIPTION */}

          <div ref={descRef} className={`${styles.section} reveal`}>
            <div className={styles.sectionHeader}>
              <h2>
                Description
              </h2>

              <p>
                Update the product description.
              </p>
            </div>

            <div className={styles.field}>
              <label htmlFor="description">
                Product Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={8}
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* GALLERY */}

          <div ref={galleryRef} className={`${styles.section} reveal`}>
            <div className={styles.sectionHeader}>
              <h2>
                Gallery Images
              </h2>

              <p>
                Upload new images only if you
                want to replace the current gallery.
              </p>
            </div>

            {existingImages.length > 0 && (
              <div className={styles.existingImages}>
                {existingImages.map(
                  (image) => (
                    <div
                      key={image}
                      className={
                        styles.imagePreview
                      }
                    >
                      <img
                        src={`${API_URL}/uploads/products/${image}`}
                        alt={
                          form.productName
                        }
                      />
                    </div>
                  )
                )}
              </div>
            )}

            <label
              htmlFor="galleryImages"
              className={
                styles.uploadBox
              }
            >
              <FiImage />

              <span>
                {newImages.length > 0
                  ? `${newImages.length} new image${
                      newImages.length > 1
                        ? "s"
                        : ""
                    } selected`
                  : "Choose new gallery images"}
              </span>

              <small>
                Maximum 10 images
              </small>
            </label>

            <input
              id="galleryImages"
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImagesChange
              }
              className={
                styles.fileInput
              }
            />
          </div>

          {/* MESSAGES */}

          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.successBox}>
              {success}
            </div>
          )}

          {/* ACTIONS */}

          <div ref={actionsRef} className={`${styles.actions} reveal`}>
            <Link
              to={`/products/${slug}`}
              className={
                styles.secondaryButton
              }
            >
              <FiX />
              Cancel
            </Link>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              <FiSave />

              <span>
                {isSubmitting
                  ? "Updating..."
                  : "Update Product"}
              </span>
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};

export default ProductEdit;