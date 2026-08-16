import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiHome,
  FiPackage,
} from "react-icons/fi";

import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* =========================
            LEFT CONTENT
        ========================= */}

        <section className={styles.content}>
          <span className={styles.eyebrow}>
            ERROR 404
          </span>

          <h1 className={styles.heading}>
            This page
            <span> doesn't exist.</span>
          </h1>

          <p className={styles.description}>
            Looks like the page you're trying to reach
            has moved, been removed, or never existed in
            the first place.
          </p>

          <div className={styles.actions}>
            <Link
              to="/"
              className={styles.primaryButton}
            >
              <FiHome />
              <span>Back to Home</span>
              <FiArrowRight />
            </Link>

            <Link
              to="/products"
              className={styles.secondaryButton}
            >
              <FiPackage />
              <span>Explore Products</span>
            </Link>
          </div>

          <Link
            to="/"
            className={styles.backLink}
          >
            <FiArrowLeft />
            <span>Return to homepage</span>
          </Link>
        </section>

        {/* =========================
            RIGHT VISUAL
        ========================= */}

        <section className={styles.visual}>
          <div className={styles.visualTop}>
            <span>PRODUCTSPHERE</span>

            <div className={styles.statusDot} />
          </div>

          <div className={styles.visualBody}>
            <div className={styles.number}>
              4
            </div>

            <div className={styles.centerObject}>
              <FiPackage />

              <span>
                PAGE
                <br />
                MISSING
              </span>
            </div>

            <div className={styles.number}>
              4
            </div>
          </div>

          <div className={styles.visualBottom}>
            <span>
              Nothing to see here
            </span>

            <span>
              /404
            </span>
          </div>
        </section>

      </div>
    </main>
  );
};

export default NotFound;