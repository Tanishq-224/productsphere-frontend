import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiPackage,
} from "react-icons/fi";

import { getAllProducts } from "../../../services/productService";
import useReveal from "../../../hooks/useReveal";

import styles from "./HomeProducts.module.css";

const API_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(
    /\/api\/?$/,
    ""
  );

const HomeProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const headerRef = useReveal({ delay: 0 });
  const gridRef = useReveal({ delay: 100 });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const result = await getAllProducts();

      if (!result?.success) {
        return;
      }

      const latestProducts = Array.isArray(result.data)
        ? result.data.slice(0, 3)
        : [];

      setProducts(latestProducts);
    } catch (error) {
      console.error(
        "Home products error:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* =========================
            HEADER
        ========================= */}

        <div ref={headerRef} className={`${styles.header} reveal`}>

          <div className={styles.headerContent}>
            <span className={styles.eyebrow}>
              OUR PRODUCTS
            </span>

            <h2 className={styles.heading}>
              Explore our{" "}
              <span>products.</span>
            </h2>

            <p className={styles.description}>
              Discover products designed to help you
              work smarter, improve productivity and
              grow your business.
            </p>
          </div>

          <Link
            to="/products"
            className={styles.viewAllButton}
          >
            <span>
              View All Products
            </span>

            <FiArrowRight />
          </Link>

        </div>

        {/* =========================
            LOADING
        ========================= */}

        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.loader} />

            <span>
              Loading products...
            </span>
          </div>
        )}

        {/* =========================
            PRODUCTS
        ========================= */}

        {!isLoading &&
          products.length > 0 && (
            <div ref={gridRef} className={`${styles.grid} reveal`}>

              {products.map((product) => {

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

                const image =
                  product.galleryImages?.[0];

                const imageUrl = image
                  ? `${API_URL}/uploads/products/${image}`
                  : "";

                return (
                  <article
                    key={product._id}
                    className={styles.card}
                  >

                    {/* IMAGE */}

                    <div
                      className={
                        styles.imageWrapper
                      }
                    >

                      {image ? (
                        <img
                          src={imageUrl}
                          alt={
                            product.productName
                          }
                          className={
                            styles.image
                          }
                          loading="lazy"
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

                      {hasDiscount && (
                        <span
                          className={
                            styles.discountBadge
                          }
                        >
                          {discountPercentage}% OFF
                        </span>
                      )}

                    </div>

                    {/* CONTENT */}

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

                      <h3
                        className={
                          styles.productName
                        }
                      >
                        {product.productName}
                      </h3>

                      <p
                        className={
                          styles.productDescription
                        }
                      >
                        {product.description
                          ?.replace(
                            /<[^>]*>/g,
                            ""
                          )
                          .replace(
                            /\s+/g,
                            " "
                          )
                          .trim()}
                      </p>

                      {/* PRICE */}

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

                      {/* CTA */}

                      <Link
                        to={`/products/${product.slug}`}
                        className={
                          styles.productButton
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

            </div>
          )}

        {/* =========================
            VIEW ALL
        ========================= */}

        {!isLoading &&
          products.length > 0 && (
            <div className={styles.bottomAction}>

              <Link
                to="/products"
                className={
                  styles.bottomButton
                }
              >
                <span>
                  View All Products
                </span>

                <FiArrowRight />
              </Link>

            </div>
          )}

      </div>
    </section>
  );
};

export default HomeProducts;