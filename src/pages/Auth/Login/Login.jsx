import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";

import useReveal from "../../../hooks/useReveal";
import { setToken } from "../../../utils/auth";
import { loginUser } from "../../../services/authService";

import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cardRef = useReveal({
    threshold: 0,
    rootMargin: "0px",
    delay: 0,
  });

  const headingRef = useReveal({
    threshold: 0,
    rootMargin: "0px",
    delay: 100,
  });

  const formRef = useReveal({
    threshold: 0,
    rootMargin: "0px",
    delay: 180,
  });

  const footerRef = useReveal({
    threshold: 0,
    rootMargin: "0px",
    delay: 260,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const result = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!result.success || !result.data?.token) {
        setError(result.message || "Login failed.");
        return;
      }

      setToken(result.data.token);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to login. Please try again.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.background} />

      <div className={styles.container}>
        <section
          ref={cardRef}
          className={`${styles.card} reveal`}
        >
          {/* Brand */}
          <Link
            to="/"
            className={styles.brand}
          >
            <span className={styles.brandPrimary}>
              PRODUCT
            </span>

            <span className={styles.brandAccent}>
              SPHERE
            </span>
          </Link>

          {/* Heading */}
          <div
            ref={headingRef}
            className={`${styles.headingBlock} reveal`}
          >
            <span className={styles.eyebrow}>
              WELCOME BACK
            </span>

            <h1 className={styles.heading}>
              Login to your
              <br />
              <span>account.</span>
            </h1>

            <p className={styles.description}>
              Access your products, manage your
              catalog and keep everything organized
              from one workspace.
            </p>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            className={`${styles.form} reveal`}
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email">
                Email
              </label>

              <div className={styles.inputWrapper}>
                <FiMail
                  className={styles.inputIcon}
                  aria-hidden="true"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.field}>
              <div className={styles.passwordLabelRow}>
                <label htmlFor="password">
                  Password
                </label>

                <Link
                  to="/auth/forgot-password"
                  className={styles.forgotPassword}
                >
                  Forgot Password?
                </Link>
              </div>

              <div className={styles.inputWrapper}>
                <FiLock
                  className={styles.inputIcon}
                  aria-hidden="true"
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <FiEyeOff aria-hidden="true" />
                  ) : (
                    <FiEye aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className={styles.errorMessage}>
                {error}
              </p>
            )}

            {/* Login */}
            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              <span>
                {isLoading
                  ? "Logging in..."
                  : "Login"}
              </span>

              {!isLoading && (
                <FiArrowRight
                  aria-hidden="true"
                />
              )}
            </button>
          </form>

          {/* Signup */}
          <div
            ref={footerRef}
            className={`${styles.signupPrompt} reveal`}
          >
            <span>
              Don't have an account?
            </span>

            <Link to="/auth/signup">
              Sign Up
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;