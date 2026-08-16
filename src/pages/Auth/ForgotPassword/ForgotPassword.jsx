import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";

import {
  forgotPassword,
  resetPassword,
} from "../../../services/authService";

import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     PASSWORD STRENGTH
  ========================= */

  const getPasswordStrength = (value) => {
    if (!value) {
      return {
        score: 0,
        label: "",
      };
    }

    let score = 0;

    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 2) {
      return {
        score,
        label: "Weak",
      };
    }

    if (score === 3) {
      return {
        score,
        label: "Fair",
      };
    }

    if (score === 4) {
      return {
        score,
        label: "Good",
      };
    }

    return {
      score,
      label: "Strong",
    };
  };

  const passwordStrength =
    getPasswordStrength(password);

  /* =========================
     CHANGE HANDLERS
  ========================= */

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
    setSuccess("");
  };

  const handleOtpChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);
    setError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setError("");
  };

  /* =========================
     SEND OTP
  ========================= */

  const handleSendOtp = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const result = await forgotPassword({
        email: trimmedEmail,
      });

      if (!result.success) {
        setError(
          result.message ||
            "Unable to send reset OTP."
        );
        return;
      }

      setSuccess(
        "OTP sent successfully. Please check your email."
      );

      setStep("reset");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     RESET PASSWORD
  ========================= */

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (!password) {
      setError("Please enter your new password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (passwordStrength.score < 3) {
      setError(
        "Please choose a stronger password."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const result = await resetPassword({
        email: email.trim(),
        otp,
        newPassword: password,
      });

      if (!result.success) {
        setError(
          result.message ||
            "Unable to reset password."
        );
        return;
      }

      setSuccess(
        "Password reset successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/auth/login", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     BACK TO EMAIL
  ========================= */

  const handleBack = () => {
    setStep("email");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <main className={styles.page}>
      <div className={styles.background} />

      <div className={styles.container}>
        <section className={styles.card}>

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

          <div className={styles.headingBlock}>
            <span className={styles.eyebrow}>
              RESET PASSWORD
            </span>

            <h1 className={styles.heading}>
              {step === "email" ? (
                <>
                  Forgot your
                  <br />
                  <span>password?</span>
                </>
              ) : (
                <>
                  Create a new
                  <br />
                  <span>password.</span>
                </>
              )}
            </h1>

            <p className={styles.description}>
              {step === "email"
                ? "Enter your registered email address and we'll send you a verification OTP."
                : "Enter the OTP sent to your email and create a new secure password."}
            </p>
          </div>

          {/* =========================
              EMAIL STEP
          ========================= */}

          {step === "email" && (
            <form
              className={styles.form}
              onSubmit={handleSendOtp}
            >
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
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <p className={styles.errorMessage}>
                  {error}
                </p>
              )}

              {success && (
                <p className={styles.successMessage}>
                  <FiCheck />
                  {success}
                </p>
              )}

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isLoading}
              >
                <span>
                  {isLoading
                    ? "Sending OTP..."
                    : "Send OTP"}
                </span>

                {!isLoading && <FiArrowRight />}
              </button>
            </form>
          )}

          {/* =========================
              RESET STEP
          ========================= */}

          {step === "reset" && (
            <form
              className={styles.form}
              onSubmit={handleResetPassword}
            >
              {/* OTP */}

              <div className={styles.field}>
                <label htmlFor="otp">
                  Verification OTP
                </label>

                <div className={styles.inputWrapper}>
                  <FiMail
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    autoComplete="one-time-code"
                    disabled={isLoading}
                    className={styles.otpInput}
                  />
                </div>
              </div>

              {/* New Password */}

              <div className={styles.field}>
                <label htmlFor="password">
                  New Password
                </label>

                <div className={styles.inputWrapper}>
                  <FiLock
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
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
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>

                {/* Password Strength */}

                {password && (
                  <div className={styles.passwordStrength}>
                    <div
                      className={
                        styles.strengthHeader
                      }
                    >
                      <span>
                        Password strength
                      </span>

                      <strong
                        className={
                          styles[
                            `strength${passwordStrength.label}`
                          ]
                        }
                      >
                        {passwordStrength.label}
                      </strong>
                    </div>

                    <div
                      className={
                        styles.strengthBars
                      }
                    >
                      {[1, 2, 3, 4, 5].map(
                        (bar) => (
                          <span
                            key={bar}
                            className={
                              bar <=
                              passwordStrength.score
                                ? styles.strengthActive
                                : ""
                            }
                          />
                        )
                      )}
                    </div>

                    <ul
                      className={
                        styles.passwordRules
                      }
                    >
                      <li
                        className={
                          password.length >= 8
                            ? styles.rulePassed
                            : ""
                        }
                      >
                        At least 8 characters
                      </li>

                      <li
                        className={
                          /[A-Z]/.test(password)
                            ? styles.rulePassed
                            : ""
                        }
                      >
                        One uppercase letter
                      </li>

                      <li
                        className={
                          /[a-z]/.test(password)
                            ? styles.rulePassed
                            : ""
                        }
                      >
                        One lowercase letter
                      </li>

                      <li
                        className={
                          /[0-9]/.test(password)
                            ? styles.rulePassed
                            : ""
                        }
                      >
                        One number
                      </li>

                      <li
                        className={
                          /[^A-Za-z0-9]/.test(
                            password
                          )
                            ? styles.rulePassed
                            : ""
                        }
                      >
                        One special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}

              <div className={styles.field}>
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className={styles.inputWrapper}>
                  <FiLock
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={
                      handleConfirmPasswordChange
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className={styles.errorMessage}>
                  {error}
                </p>
              )}

              {success && (
                <p className={styles.successMessage}>
                  <FiCheck />
                  {success}
                </p>
              )}

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isLoading}
              >
                <span>
                  {isLoading
                    ? "Resetting Password..."
                    : "Reset Password"}
                </span>

                {!isLoading && <FiArrowRight />}
              </button>

              <button
                type="button"
                className={styles.backButton}
                onClick={handleBack}
                disabled={isLoading}
              >
                <FiArrowLeft />
                Change email
              </button>
            </form>
          )}

          {/* Footer */}

          <div className={styles.loginPrompt}>
            <span>
              Remember your password?
            </span>

            <Link to="/auth/login">
              Back to Login
            </Link>
          </div>

        </section>
      </div>
    </main>
  );
};

export default ForgotPassword;