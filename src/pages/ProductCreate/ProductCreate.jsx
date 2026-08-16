import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiImage,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

import { createProduct } from "../../services/productService";
import styles from "./ProductCreate.module.css";
import useReveal from "../../hooks/useReveal";

const ProductCreate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const headerRef = useReveal({ delay: 0 });
  const basicInfoRef = useReveal({ delay: 100 });
  const pricingRef = useReveal({ delay: 200 });
  const imagesRef = useReveal({ delay: 300 });
  const descRef = useReveal({ delay: 400 });
  const actionsRef = useReveal({ delay: 500 });

  const [formData, setFormData] = useState({
    metaTitle: "",
    productName: "",
    slug: "",
    price: "",
    discountedPrice: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const imagePreviews = useMemo(
    () => previews.map((item) => item.url),
    [previews]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSlugChange = (event) => {
    const value = event.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    setFormData((previous) => ({
      ...previous,
      slug: value,
    }));

    setError("");
  };

  const handleProductNameChange = (event) => {
    const value = event.target.value;

    setFormData((previous) => ({
      ...previous,
      productName: value,
    }));

    setError("");
  };

  const handleImages = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    const remainingSlots = 10 - images.length;

    if (remainingSlots <= 0) {
      setError("You can upload a maximum of 10 images.");
      event.target.value = "";
      return;
    }

    const validFiles = selectedFiles
      .slice(0, remainingSlots)
      .filter((file) => file.type.startsWith("image/"));

    if (!validFiles.length) {
      setError("Please select valid image files.");
      event.target.value = "";
      return;
    }

    const newPreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((previous) => [
      ...previous,
      ...validFiles,
    ]);

    setPreviews((previous) => [
      ...previous,
      ...newPreviews,
    ]);

    if (selectedFiles.length > remainingSlots) {
      setError("Only 10 images can be uploaded.");
    } else {
      setError("");
    }

    event.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]?.url);

    setImages((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );

    setPreviews((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );

    setError("");
  };

  const validateForm = () => {
    if (!formData.metaTitle.trim()) {
      return "Please enter meta title.";
    }

    if (formData.metaTitle.trim().length > 100) {
      return "Meta title cannot exceed 100 characters.";
    }

    if (!formData.productName.trim()) {
      return "Please enter product name.";
    }

    if (formData.productName.trim().length > 150) {
      return "Product name cannot exceed 150 characters.";
    }

    if (!formData.slug.trim()) {
      return "Please enter product slug.";
    }

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        formData.slug.trim()
      )
    ) {
      return "Slug can contain only lowercase letters, numbers and hyphens.";
    }

    if (formData.price === "") {
      return "Please enter product price.";
    }

    if (Number(formData.price) < 0) {
      return "Price cannot be negative.";
    }

    if (formData.discountedPrice === "") {
      return "Please enter discounted price.";
    }

    if (Number(formData.discountedPrice) < 0) {
      return "Discounted price cannot be negative.";
    }

    if (
      Number(formData.discountedPrice) >
      Number(formData.price)
    ) {
      return "Discounted price cannot be greater than price.";
    }

    if (!formData.description.trim()) {
      return "Please enter product description.";
    }

    if (images.length === 0) {
      return "Please upload at least one product image.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);

      const data = new FormData();

      data.append(
        "metaTitle",
        formData.metaTitle.trim()
      );

      data.append(
        "productName",
        formData.productName.trim()
      );

      data.append(
        "slug",
        formData.slug.trim()
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "discountedPrice",
        formData.discountedPrice
      );

      data.append(
        "description",
        formData.description
      );

      images.forEach((image) => {
        data.append("galleryImages", image);
      });

      const result = await createProduct(data);

      if (!result?.success) {
        setError(
          result?.message ||
            "Unable to create product."
        );
        return;
      }

      setSuccess(
        result.message ||
          "Product created successfully."
      );

      setTimeout(() => {
        navigate("/products");
      }, 700);
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* =========================
            BACK
        ========================= */}

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/products")}
          disabled={isLoading}
        >
          <FiArrowLeft />
          <span>Back to Products</span>
        </button>

        {/* =========================
            HEADER
        ========================= */}

        <section ref={headerRef} className={`${styles.header} reveal`}>
          <span className={styles.eyebrow}>
            PRODUCT MANAGEMENT
          </span>

          <h1 className={styles.heading}>
            Add a new{" "}
            <span>product.</span>
          </h1>

          <p className={styles.description}>
            Create a product listing with pricing,
            images and detailed product information.
          </p>
        </section>

        {/* =========================
            FORM
        ========================= */}

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <section ref={basicInfoRef} className={`${styles.card} reveal`}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  01
                </span>

                <h2>
                  Basic information
                </h2>

                <p>
                  Add the essential information
                  for your product.
                </p>
              </div>
            </div>

            <div className={styles.fields}>

              <div className={styles.field}>
                <label htmlFor="metaTitle">
                  Meta Title
                </label>

                <input
                  id="metaTitle"
                  name="metaTitle"
                  type="text"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  placeholder="Enter meta title"
                  maxLength={100}
                  disabled={isLoading}
                />

                <span className={styles.helper}>
                  {formData.metaTitle.length}/100
                </span>
              </div>

              <div className={styles.field}>
                <label htmlFor="productName">
                  Product Name
                </label>

                <input
                  id="productName"
                  name="productName"
                  type="text"
                  value={formData.productName}
                  onChange={handleProductNameChange}
                  placeholder="Enter product name"
                  maxLength={150}
                  disabled={isLoading}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="slug">
                  Product URL Slug
                </label>

                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="product-name"
                  disabled={isLoading}
                />

                <span className={styles.helper}>
                  Example: premium-wireless-headphones
                </span>
              </div>

            </div>
          </section>

          {/* =========================
              PRICING
          ========================= */}

          <section ref={pricingRef} className={`${styles.card} reveal`}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  02
                </span>

                <h2>
                  Pricing
                </h2>

                <p>
                  Set the original and discounted
                  product price.
                </p>
              </div>
            </div>

            <div className={styles.priceFields}>

              <div className={styles.field}>
                <label htmlFor="price">
                  Price
                </label>

                <div className={styles.priceInput}>
                  <span>₹</span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="discountedPrice">
                  Discounted Price
                </label>

                <div className={styles.priceInput}>
                  <span>₹</span>

                  <input
                    id="discountedPrice"
                    name="discountedPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    placeholder="0"
                    disabled={isLoading}
                  />
                </div>
              </div>

            </div>
          </section>

          {/* =========================
              IMAGES
          ========================= */}

          <section ref={imagesRef} className={`${styles.card} reveal`}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  03
                </span>

                <h2>
                  Product gallery
                </h2>

                <p>
                  Upload up to 10 product images.
                </p>
              </div>

              <span className={styles.imageCount}>
                {images.length}/10
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImages}
              disabled={
                isLoading ||
                images.length >= 10
              }
            />

            <button
              type="button"
              className={styles.uploadBox}
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={
                isLoading ||
                images.length >= 10
              }
            >
              <div className={styles.uploadIcon}>
                <FiImage />
              </div>

              <strong>
                Add product images
              </strong>

              <span>
                Click to browse image files
              </span>
            </button>

            {imagePreviews.length > 0 && (
              <div className={styles.previewGrid}>
                {imagePreviews.map(
                  (preview, index) => (
                    <div
                      key={preview}
                      className={styles.previewItem}
                    >
                      <img
                        src={preview}
                        alt={`Product ${index + 1}`}
                      />

                      <span
                        className={
                          styles.previewNumber
                        }
                      >
                        {index + 1}
                      </span>

                      <button
                        type="button"
                        className={styles.removeImage}
                        onClick={() =>
                          removeImage(index)
                        }
                        disabled={isLoading}
                        aria-label={`Remove image ${
                          index + 1
                        }`}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* =========================
              DESCRIPTION
          ========================= */}

          <section ref={descRef} className={`${styles.card} reveal`}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  04
                </span>

                <h2>
                  Product description
                </h2>

                <p>
                  Provide detailed information
                  about your product.
                </p>
              </div>
            </div>

            <div className={styles.editor}>
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                disabled={isLoading}
                onChange={(_, editor) => {
                  const data = editor.getData();

                  setFormData((previous) => ({
                    ...previous,
                    description: data,
                  }));

                  setError("");
                }}
                config={{
                  licenseKey: "GPL",
                  plugins: [
                    Essentials,
                    Paragraph,
                    Heading,
                    Bold,
                    Italic,
                    Link,
                    List,
                    Undo,
                  ],
                  toolbar: [
                    "undo",
                    "redo",
                    "|",
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "|",
                    "bulletedList",
                    "numberedList",
                  ],
                }}
              />
            </div>
          </section>

          {/* =========================
              MESSAGES
          ========================= */}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              <FiCheck />
              <span>{success}</span>
            </div>
          )}

          {/* =========================
              ACTIONS
          ========================= */}

          <div ref={actionsRef} className={`${styles.actions} reveal`}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() =>
                navigate("/products")
              }
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              <FiPlus />

              <span>
                {isLoading
                  ? "Creating..."
                  : "Create Product"}
              </span>
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};

export default ProductCreate;