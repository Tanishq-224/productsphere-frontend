import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import DOMPurify from "dompurify";

import {
  FiArrowLeft,
  FiCheck,
  FiEdit2,
  FiPackage,
  FiRefreshCw,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import {
  getProductBySlug,
  deleteProduct,
} from "../../services/productService";

import { isAuthenticated } from "../../utils/auth";
import useReveal from "../../hooks/useReveal";

import styles from "./ProductDetail.module.css";

const API_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(
    /\/api\/?$/,
    ""
  );

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const galleryRef = useReveal({ delay: 0 });
  const contentRef = useReveal({ delay: 200 });

  const [product, setProduct] = useState(null);

  /* =========================
     SLIDER STATE
  ========================= */

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [imageError, setImageError] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] = useState("");

  const authenticated = isAuthenticated();

  /* =========================
     FETCH PRODUCT
  ========================= */

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result =
        await getProductBySlug(slug);

      if (
        !result?.success ||
        !result?.data
      ) {
        setError(
          result?.message ||
            "Product not found."
        );

        return;
      }

      const productData = result.data;

      setProduct(productData);

      // Always start from first image
      setSelectedIndex(0);

      setImageError(false);
    } catch (error) {
      console.error(
        "Fetch product error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  /* =========================
     GALLERY IMAGES
  ========================= */

  const galleryImages =
    Array.isArray(product?.galleryImages)
      ? product.galleryImages
      : [];

  const totalImages =
    galleryImages.length;

  const currentImage =
    galleryImages[selectedIndex];

  const currentImageUrl = currentImage
    ? `${API_URL}/uploads/products/${currentImage}`
    : "";

  /* =========================
     CHANGE IMAGE
  ========================= */

  const changeImage = (index) => {
    if (
      index < 0 ||
      index >= totalImages
    ) {
      return;
    }

    setSelectedIndex(index);
    setImageError(false);
  };

  /* =========================
     NEXT IMAGE
  ========================= */

  const goToNextImage = () => {
    if (totalImages <= 1) {
      return;
    }

    setSelectedIndex((current) => {
      if (current >= totalImages - 1) {
        return 0;
      }

      return current + 1;
    });

    setImageError(false);
  };

  /* =========================
     PREVIOUS IMAGE
  ========================= */

  const goToPreviousImage = () => {
    if (totalImages <= 1) {
      return;
    }

    setSelectedIndex((current) => {
      if (current <= 0) {
        return totalImages - 1;
      }

      return current - 1;
    });

    setImageError(false);
  };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const handleDelete = async () => {
    if (!product || isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.productName}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      const result =
        await deleteProduct(
          product.slug
        );

      if (!result?.success) {
        setError(
          result?.message ||
            "Unable to delete product."
        );

        return;
      }

      navigate("/products", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete product. Please try again."
      );
    } finally {
      setIsDeleting(false);
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
            <div
              className={styles.loader}
            />

            <p>
              Loading product...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error && !product) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.status}>
            <FiPackage
              className={
                styles.statusIcon
              }
            />

            <h2>
              Product not found
            </h2>

            <p
              className={
                styles.errorMessage
              }
            >
              {error ||
                "The product you're looking for does not exist."}
            </p>

            <div
              className={
                styles.statusActions
              }
            >
              <button
                type="button"
                className={
                  styles.retryButton
                }
                onClick={
                  fetchProduct
                }
              >
                <FiRefreshCw />

                <span>
                  Try Again
                </span>
              </button>

              <Link
                to="/products"
                className={
                  styles.backLink
                }
              >
                <FiArrowLeft />

                <span>
                  Back to Products
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  /* =========================
     PRODUCT DATA
  ========================= */

  const price =
    Number(product.price) || 0;

  const discountedPrice =
    Number(
      product.discountedPrice
    ) || 0;

  const hasDiscount =
    discountedPrice < price;

  const discountPercentage =
    hasDiscount && price > 0
      ? Math.round(
          ((price -
            discountedPrice) /
            price) *
            100
        )
      : 0;

  const savings = hasDiscount
    ? price - discountedPrice
    : 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* =========================
            BACK BUTTON
        ========================= */}

        <Link
          to="/products"
          className={
            styles.backButton
          }
        >
          <FiArrowLeft />

          <span>
            Back to Products
          </span>
        </Link>

        {/* =========================
            PRODUCT CARD
        ========================= */}

        <section
          className={
            styles.productCard
          }
        >

          {/* =========================
              GALLERY
          ========================= */}

          <div
            ref={galleryRef}
            className={`${styles.gallery} reveal`}
          >

            {/* =========================
                MAIN IMAGE SLIDER
            ========================= */}

            <div
              className={
                styles.mainImageWrapper
              }
            >

              {/* IMAGE */}

              {currentImageUrl &&
              !imageError ? (
                <img
                  key={currentImageUrl}
                  src={currentImageUrl}
                  alt={`${product.productName} ${
                    selectedIndex + 1
                  }`}
                  className={
                    styles.mainImage
                  }
                  onError={() => {
                    setImageError(true);
                  }}
                />
              ) : (
                <div
                  className={
                    styles.imagePlaceholder
                  }
                >
                  <FiPackage />
                </div>
              )}

              {/* =========================
                  DISCOUNT BADGE
              ========================= */}

              {hasDiscount && (
                <span
                  className={
                    styles.discountBadge
                  }
                >
                  {discountPercentage}% OFF
                </span>
              )}

              {/* =========================
                  PREVIOUS ARROW
              ========================= */}

              {totalImages > 1 && (
                <button
                  type="button"
                  className={`${styles.sliderButton} ${styles.sliderPrev}`}
                  onClick={
                    goToPreviousImage
                  }
                  aria-label="Previous image"
                >
                  <FiChevronLeft />
                </button>
              )}

              {/* =========================
                  NEXT ARROW
              ========================= */}

              {totalImages > 1 && (
                <button
                  type="button"
                  className={`${styles.sliderButton} ${styles.sliderNext}`}
                  onClick={
                    goToNextImage
                  }
                  aria-label="Next image"
                >
                  <FiChevronRight />
                </button>
              )}

              {/* =========================
                  IMAGE COUNTER
              ========================= */}

              {totalImages > 1 && (
                <div
                  className={
                    styles.imageCounter
                  }
                >
                  {selectedIndex + 1}
                  {" / "}
                  {totalImages}
                </div>
              )}
            </div>

            {/* =========================
                THUMBNAIL NAVIGATION
            ========================= */}

            {totalImages > 1 && (
              <div
                className={
                  styles.thumbnailWrapper
                }
              >

                {/* LEFT THUMBNAIL ARROW */}

                <button
                  type="button"
                  className={
                    styles.thumbnailArrow
                  }
                  onClick={
                    goToPreviousImage
                  }
                  aria-label="Previous thumbnail"
                >
                  <FiChevronLeft />
                </button>

                {/* THUMBNAILS */}

                <div
                  className={
                    styles.thumbnailGrid
                  }
                >
                  {galleryImages.map(
                    (image, index) => {
                      const imageUrl =
                        `${API_URL}/uploads/products/${image}`;

                      const isSelected =
                        selectedIndex ===
                        index;

                      return (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          className={`${styles.thumbnailButton} ${
                            isSelected
                              ? styles.thumbnailActive
                              : ""
                          }`}
                          onClick={() =>
                            changeImage(
                              index
                            )
                          }
                          aria-label={`View image ${
                            index + 1
                          }`}
                          aria-pressed={
                            isSelected
                          }
                        >
                          <img
                            src={imageUrl}
                            alt={`${product.productName} preview ${
                              index + 1
                            }`}
                            className={
                              styles.thumbnail
                            }
                            loading="lazy"
                          />
                        </button>
                      );
                    }
                  )}
                </div>

                {/* RIGHT THUMBNAIL ARROW */}

                <button
                  type="button"
                  className={
                    styles.thumbnailArrow
                  }
                  onClick={
                    goToNextImage
                  }
                  aria-label="Next thumbnail"
                >
                  <FiChevronRight />
                </button>

              </div>
            )}

          </div>

          {/* =========================
              PRODUCT CONTENT
          ========================= */}

          <div
            ref={contentRef}
            className={`${styles.content} reveal`}
          >

            <span
              className={
                styles.metaTitle
              }
            >
              {product.metaTitle}
            </span>

            <h1
              className={
                styles.heading
              }
            >
              {product.productName}
            </h1>

            {/* =========================
                PRICE
            ========================= */}

            <div
              className={
                styles.priceRow
              }
            >
              <strong
                className={
                  styles.discountedPrice
                }
              >
                ₹
                {discountedPrice.toLocaleString(
                  "en-IN"
                )}
              </strong>

              {hasDiscount && (
                <>
                  <span
                    className={
                      styles.originalPrice
                    }
                  >
                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span
                    className={
                      styles.savings
                    }
                  >
                    Save ₹
                    {savings.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </>
              )}
            </div>

            <div
              className={
                styles.divider
              }
            />

            {/* =========================
                DESCRIPTION
            ========================= */}

            <div
              className={
                styles.descriptionSection
              }
            >
              <h2>
                Product Description
              </h2>

              <div
                className={
                  styles.descriptionContent
                }
                dangerouslySetInnerHTML={{
                  __html:
                    DOMPurify.sanitize(
                      product.description ||
                        ""
                    ),
                }}
              />
            </div>

            {/* =========================
                FEATURES
            ========================= */}

            <div
              className={
                styles.features
              }
            >
              <div
                className={
                  styles.feature
                }
              >
                <div
                  className={
                    styles.featureIcon
                  }
                >
                  <FiCheck />
                </div>

                <span>
                  Quality Product
                </span>
              </div>

              <div
                className={
                  styles.feature
                }
              >
                <div
                  className={
                    styles.featureIcon
                  }
                >
                  <FiCheck />
                </div>

                <span>
                  Reliable Support
                </span>
              </div>

              <div
                className={
                  styles.feature
                }
              >
                <div
                  className={
                    styles.featureIcon
                  }
                >
                  <FiCheck />
                </div>

                <span>
                  Business Ready
                </span>
              </div>
            </div>

            {/* =========================
                AUTHENTICATED ACTIONS
            ========================= */}

            {authenticated && (
              <div
                className={
                  styles.actions
                }
              >
                <Link
                  to={`/products/${product.slug}/edit`}
                  className={
                    styles.editButton
                  }
                >
                  <FiEdit2 />

                  <span>
                    Edit Product
                  </span>
                </Link>

                <button
                  type="button"
                  className={
                    styles.deleteButton
                  }
                  onClick={
                    handleDelete
                  }
                  disabled={
                    isDeleting
                  }
                >
                  <FiTrash2 />

                  <span>
                    {isDeleting
                      ? "Deleting..."
                      : "Delete Product"}
                  </span>
                </button>
              </div>
            )}

            {/* =========================
                ERROR
            ========================= */}

            {error && (
              <p
                className={
                  styles.errorMessage
                }
              >
                {error}
              </p>
            )}

          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;