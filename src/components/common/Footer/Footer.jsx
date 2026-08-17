import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiChevronDown,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* =========================
            TOP
        ========================= */}

        <div className={styles.top}>

          {/* BRAND */}

          <div className={styles.brand}>
            <Link
              to="/"
              className={styles.logo}
            >
              Product
              <span>Sphere</span>
            </Link>

            <p className={styles.brandDescription}>
              A modern product platform designed to
              help businesses work smarter, improve
              productivity and grow with confidence.
            </p>

            <Link
              to="/products"
              className={styles.exploreButton}
            >
              <span>
                Explore Products
              </span>

              <FiArrowUpRight />
            </Link>
          </div>

          {/* =========================
              DESKTOP LINKS
          ========================= */}

          <div className={styles.linksWrapper}>

            {/* COMPANY */}

            <div className={styles.linkColumn}>
              <h3>Company</h3>

              <Link to="/">
                Home
              </Link>

              <Link to="/products">
                Products
              </Link>

              <Link to="/profile">
                Profile
              </Link>
            </div>

            {/* ACCOUNT */}

            <div className={styles.linkColumn}>
              <h3>Account</h3>

              <Link to="/auth/login">
                Login
              </Link>

              <Link to="/auth/signup">
                Sign Up
              </Link>

              <Link to="/auth/forgot-password">
                Forgot Password
              </Link>
            </div>

            {/* CONTACT */}

            <div className={styles.linkColumn}>
              <h3>Contact</h3>

              <a href="mailto:hello@productsphere.com">
                <FiMail />

                <span>
                  hello@productsphere.com
                </span>
              </a>

              <a href="tel:+919999999999">
                <FiPhone />

                <span>
                  +91 99999 99999
                </span>
              </a>

              <div className={styles.contactItem}>
                <FiMapPin />

                <span>
                  Indore, Madhya Pradesh
                  <br />
                  India
                </span>
              </div>
            </div>

          </div>

          {/* =========================
              MOBILE ACCORDION
          ========================= */}

          <div className={styles.mobileLinks}>

            {/* COMPANY */}

            <div className={styles.mobileSection}>
              <button
                type="button"
                className={`${styles.mobileHeader} ${
                  openSections.company
                    ? styles.mobileHeaderActive
                    : ""
                }`}
                onClick={() =>
                  toggleSection("company")
                }
              >
                <span>Company</span>

                <FiChevronDown
                  className={
                    openSections.company
                      ? styles.chevronOpen
                      : ""
                  }
                />
              </button>

              <div
                className={`${styles.mobileContent} ${
                  openSections.company
                    ? styles.mobileContentOpen
                    : ""
                }`}
              >
                <Link to="/">
                  Home
                </Link>

                <Link to="/products">
                  Products
                </Link>

                <Link to="/profile">
                  Profile
                </Link>
              </div>
            </div>

            {/* ACCOUNT */}

            <div className={styles.mobileSection}>
              <button
                type="button"
                className={`${styles.mobileHeader} ${
                  openSections.account
                    ? styles.mobileHeaderActive
                    : ""
                }`}
                onClick={() =>
                  toggleSection("account")
                }
              >
                <span>Account</span>

                <FiChevronDown
                  className={
                    openSections.account
                      ? styles.chevronOpen
                      : ""
                  }
                />
              </button>

              <div
                className={`${styles.mobileContent} ${
                  openSections.account
                    ? styles.mobileContentOpen
                    : ""
                }`}
              >
                <Link to="/auth/login">
                  Login
                </Link>

                <Link to="/auth/signup">
                  Sign Up
                </Link>

                <Link to="/auth/forgot-password">
                  Forgot Password
                </Link>
              </div>
            </div>

            {/* CONTACT */}

            <div className={styles.mobileSection}>
              <button
                type="button"
                className={`${styles.mobileHeader} ${
                  openSections.contact
                    ? styles.mobileHeaderActive
                    : ""
                }`}
                onClick={() =>
                  toggleSection("contact")
                }
              >
                <span>Contact</span>

                <FiChevronDown
                  className={
                    openSections.contact
                      ? styles.chevronOpen
                      : ""
                  }
                />
              </button>

              <div
                className={`${styles.mobileContent} ${
                  openSections.contact
                    ? styles.mobileContentOpen
                    : ""
                }`}
              >
                <a href="mailto:hello@productsphere.com">
                  <FiMail />

                  <span>
                    hello@productsphere.com
                  </span>
                </a>

                <a href="tel:+919999999999">
                  <FiPhone />

                  <span>
                    +91 99999 99999
                  </span>
                </a>

                <div className={styles.mobileContactItem}>
                  <FiMapPin />

                  <span>
                    Indore, Madhya Pradesh
                    <br />
                    India
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* =========================
            DIVIDER
        ========================= */}

        <div className={styles.divider} />

        {/* =========================
            BOTTOM
        ========================= */}

        <div className={styles.bottom}>

          <p>
            © {currentYear} ProductSphere.
            All rights reserved.
          </p>

          <div className={styles.bottomLinks}>
            <Link to="/">
              Privacy Policy
            </Link>

            <Link to="/">
              Terms & Conditions
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;