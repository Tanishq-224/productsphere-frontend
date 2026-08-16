import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  isAuthenticated,
  removeToken,
} from "../../../utils/auth";

import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const authenticated = isAuthenticated();

  const handleLogout = () => {
    removeToken();
    setIsMenuOpen(false);

    navigate("/", {
      replace: true,
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAuthClick = () => {
    closeMenu();

    navigate("/auth/login");
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>

        {/* =========================
            BRAND
        ========================= */}

        <NavLink
          to="/"
          className={styles.brand}
          onClick={closeMenu}
        >
          <span className={styles.brandPrimary}>
            PRODUCT
          </span>

          <span className={styles.brandAccent}>
            SPHERE
          </span>
        </NavLink>

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}

        <nav className={styles.navLinks}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${
                isActive ? styles.active : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${styles.navLink} ${
                isActive ? styles.active : ""
              }`
            }
          >
            Products
          </NavLink>

          <a
            href="/about"
            className={styles.navLink}
          >
            About
          </a>

          <a
            href="/contact"
            className={styles.navLink}
          >
            Contact
          </a>
        </nav>

        {/* =========================
            DESKTOP ACTION
        ========================= */}

        <div className={styles.action}>
          {authenticated ? (
            <button
              type="button"
              className={styles.avatar}
              onClick={() => navigate("/profile")}
              aria-label="Open profile"
            >
              T
            </button>
          ) : (
            <button
              type="button"
              className={styles.authButton}
              onClick={handleAuthClick}
            >
              Login / Sign Up
            </button>
          )}
        </div>

        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}

        <button
          type="button"
          className={`${styles.menuButton} ${
            isMenuOpen ? styles.menuOpen : ""
          }`}
          onClick={() =>
            setIsMenuOpen((previous) => !previous)
          }
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================= */}

      <div
        className={`${styles.mobileMenu} ${
          isMenuOpen
            ? styles.mobileMenuOpen
            : ""
        }`}
      >
        <nav className={styles.mobileNavLinks}>

          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${
                isActive
                  ? styles.mobileActive
                  : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            onClick={closeMenu}
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${
                isActive
                  ? styles.mobileActive
                  : ""
              }`
            }
          >
            Products
          </NavLink>

          <a
            href="#about"
            className={styles.mobileNavLink}
            onClick={closeMenu}
          >
            About
          </a>

          <a
            href="#contact"
            className={styles.mobileNavLink}
            onClick={closeMenu}
          >
            Contact
          </a>

          {authenticated ? (
            <>
              <button
                type="button"
                className={styles.mobileProfile}
                onClick={() => {
                  closeMenu();
                  navigate("/profile");
                }}
              >
                Profile
              </button>

              <button
                type="button"
                className={styles.mobileLogout}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.mobileAuthButton}
              onClick={handleAuthClick}
            >
              Login / Sign Up
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;