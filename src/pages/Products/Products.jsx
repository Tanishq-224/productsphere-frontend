import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiPackage,
  FiPlus,
  FiRefreshCw,
} from "react-icons/fi";
import DOMPurify from "dompurify";

import { getAllProducts } from "../../services/productService";
import { isAuthenticated } from "../../utils/auth";
import useReveal from "../../hooks/useReveal";

import styles from "./Products.module.css";

const API_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "");


const getImageUrl = (image) => {
  if (!image) return "";

  // Already a complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Already contains upload path
  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }

  // Only filename
  return `${API_URL}/uploads/products/${image}`;
};

/* =========================
   DESCRIPTION PREVIEW
========================= */

const getDescriptionPreview = (html) => {
  if (!html) return "";

  const sanitizedHtml = DOMPurify.sanitize(html);

  const tempElement = document.createElement("div");
  tempElement.innerHTML = sanitizedHtml;

  return tempElement.textContent
    ?.replace(/\s+/g, " ")
    .trim() || "";
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const headerRef = useReveal({ delay: 0 });
  const gridRef = useReveal({ delay: 100 });

  const authenticated = isAuthenticated();

  /* =========================
     FETCH PRODUCTS
  ========================= */

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await getAllProducts();

      if (!result?.success) {
        setError(
          result?.message || "Unable to fetch products."
        );

        return;
      }

      setProducts(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (error) {
      console.error(
        "Fetch products error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* =========================
            HEADER
        ========================= */}

        <section ref={headerRef} className={`${styles.header} reveal`}>

          <div>
            <span className={styles.eyebrow}>
              PRODUCT CATALOG
            </span>

            <h1 className={styles.heading}>
              Explore our{" "}
              <span>products.</span>
            </h1>

            <p className={styles.description}>
              Discover products designed to help you
              manage your work, improve productivity
              and grow your business.
            </p>
          </div>

          {/* =========================
              HEADER ACTIONS
          ========================= */}

          <div className={styles.headerActions}>

            {/* ONLY LOGGED-IN USERS */}

            {authenticated && (
              <Link
                to="/products/create"
                className={
                  styles.addProductButton
                }
              >
                <FiPlus />

                <span>
                  Add Product
                </span>
              </Link>
            )}

            <div className={styles.productCount}>
              <FiPackage />

              <span>
                {products.length}{" "}
                {products.length === 1
                  ? "Product"
                  : "Products"}
              </span>
            </div>

          </div>
        </section>

        {/* =========================
            LOADING
        ========================= */}

        {isLoading && (
          <div className={styles.status}>
            <div className={styles.loader} />

            <p>
              Loading products...
            </p>
          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {!isLoading && error && (
          <div className={styles.status}>

            <p className={styles.errorMessage}>
              {error}
            </p>

            <button
              type="button"
              className={styles.retryButton}
              onClick={fetchProducts}
            >
              <FiRefreshCw />

              <span>
                Try Again
              </span>
            </button>

          </div>
        )}

        {/* =========================
            EMPTY
        ========================= */}

        {!isLoading &&
          !error &&
          products.length === 0 && (
            <div className={styles.status}>

              <FiPackage
                className={styles.emptyIcon}
              />

              <h2>
                No products available
              </h2>

              <p>
                There are no products available
                right now.
              </p>

            </div>
          )}

        {/* =========================
            PRODUCTS
        ========================= */}

        {!isLoading &&
          !error &&
          products.length > 0 && (
            <section ref={gridRef} className={`${styles.grid} reveal`}>

              {products.map((product) => {

                /* =========================
                   PRICE
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

                /* =========================
                   IMAGE
                ========================= */

                const image = product.galleryImages?.[0];

const imageUrl = getImageUrl(image);

                /* =========================
                   DESCRIPTION
                ========================= */

                const descriptionPreview =
                  getDescriptionPreview(
                    product.description
                  );

                return (
                  <article
                    key={product._id}
                    className={styles.card}
                  >

                    {/* =========================
    IMAGE
========================= */}

<div className={styles.imageWrapper}>

  {imageUrl ? (
    <img
      src={imageUrl}
      alt={product.productName || "Product image"}
      className={styles.image}
      loading="lazy"
      onError={(event) => {
        console.error(
          "Product image failed:",
          imageUrl
        );

        event.currentTarget.style.display = "none";

        const placeholder =
          event.currentTarget.nextElementSibling;

        if (placeholder) {
          placeholder.style.display = "flex";
        }
      }}
    />
  ) : null}

  <div
    className={styles.imagePlaceholder}
    style={{
      display: imageUrl ? "none" : "flex",
    }}
  >
    <FiPackage />
  </div>

  {hasDiscount && (
    <span className={styles.discountBadge}>
      {discountPercentage}% OFF
    </span>
  )}

</div>

                    {/* =========================
                        CONTENT
                    ========================= */}

                    <div
                      className={
                        styles.content
                      }
                    >

                      <span
                        className={
                          styles.metaTitle
                        }
                      >
                        {product.metaTitle}
                      </span>

                      <h2
                        className={
                          styles.productName
                        }
                      >
                        {product.productName}
                      </h2>

                      <p
                        className={
                          styles.productDescription
                        }
                      >
                        {descriptionPreview}
                      </p>

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
                        )}

                      </div>

                      {/* =========================
                          ACTION
                      ========================= */}

                      <Link
                        to={`/products/${product.slug}`}
                        className={
                          styles.viewButton
                        }
                      >
                        <span>
                          View Product
                        </span>

                        <FiArrowRight />
                      </Link>

                    </div>

                  </article>
                );
              })}

            </section>
          )}

      </div>
    </main>
  );
};

export default Products;