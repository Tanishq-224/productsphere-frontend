import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBox,
  FiCheckCircle,
} from "react-icons/fi";

import useReveal from "../../../hooks/useReveal";

import styles from "./Hero.module.css";

const Hero = () => {
  const eyebrowRef = useReveal({
    delay: 0,
    threshold: 0.2,
  });

  const headingRef = useReveal({
    delay: 100,
    threshold: 0.2,
  });

  const descriptionRef = useReveal({
    delay: 200,
    threshold: 0.2,
  });

  const actionsRef = useReveal({
    delay: 300,
    threshold: 0.2,
  });

  const statsRef = useReveal({
    delay: 400,
    threshold: 0.15,
  });

  return (
    <section className={styles.hero}>
      <div className={styles.background} />
      <div className={styles.overlay} />

      <div className={styles.container}>
        {/* LEFT CONTENT */}
        <div className={styles.content}>
          <div
            ref={eyebrowRef}
            className={`${styles.eyebrow} reveal`}
          >
            <span className={styles.eyebrowLine} />

            <span>
              PRODUCT MANAGEMENT PLATFORM
            </span>
          </div>

          <h1
            ref={headingRef}
            className={`${styles.heading} reveal`}
          >
            SMARTER
            <br />
            PRODUCTS.
            <br />
            SIMPLER{" "}
            <span className={styles.accent}>
              MANAGEMENT.
            </span>
          </h1>

          <p
            ref={descriptionRef}
            className={`${styles.description} reveal`}
          >
            Manage your products, pricing, content and catalog
            from one simple workspace built to keep everything
            organized.
          </p>

          <div
            ref={actionsRef}
            className={`${styles.actions} reveal`}
          >
            <Link
              to="/products"
              className={styles.primaryButton}
            >
              <span>Explore Products</span>
              <FiArrowUpRight aria-hidden="true" />
            </Link>

            <Link
              to="/contact"
              className={styles.secondaryButton}
            >
              <span>Get Started</span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* RIGHT STATS */}
        <div
          ref={statsRef}
          className={`${styles.stats} reveal`}
        >
          <article className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIconBox}>
                <FiBox aria-hidden="true" />
              </div>

              <span className={styles.statNumber}>
                250+
              </span>
            </div>

            <div className={styles.statBottom}>
              <span className={styles.statLabel}>
                Products Managed
              </span>

              <span className={styles.statStatus}>
                <FiCheckCircle aria-hidden="true" />
                Organized
              </span>
            </div>
          </article>

          <article
            className={`${styles.statCard} ${styles.statCardMuted}`}
          >
            <div className={styles.statTop}>
              <div className={styles.statIconBox}>
                <FiCheckCircle aria-hidden="true" />
              </div>

              <span className={styles.statNumber}>
                99%
              </span>
            </div>

            <div className={styles.statBottom}>
              <span className={styles.statLabel}>
                Catalog Accuracy
              </span>

              <span className={styles.statStatus}>
                <FiCheckCircle aria-hidden="true" />
                Reliable
              </span>
            </div>
          </article>
        </div>
      </div>

      {/* BOTTOM INDICATOR */}
      {/* <div
        className={styles.indicator}
        aria-hidden="true"
      >
        <span className={styles.activeIndicator}>
          01
        </span>

        <span className={styles.indicatorLine} />

        <span>02</span>

        <span className={styles.indicatorLine} />

        <span>03</span>
      </div> */}
    </section>
  );
};

export default Hero;