import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import {
  signupUser,
  verifyOtp,
} from "../../../services/authService";

import styles from "./Signup.module.css";

const Signup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("signup");

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

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

  const handleSignup = async (event) => {
    event.preventDefault();

    const username = formData.username.trim();
    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();

    if (username.length < 3 || username.length > 30) {
      setError(
        "Username must be between 3 and 30 characters."
      );
      return;
    }

    if (!fullName || fullName.length > 100) {
      setError("Please enter a valid full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      setError(
        "Phone number must contain exactly 10 digits."
      );
      return;
    }

    const isStrongPassword =
      formData.password.length >= 8 &&
      /[A-Z]/.test(formData.password) &&
      /[a-z]/.test(formData.password) &&
      /\d/.test(formData.password) &&
      /[^A-Za-z0-9]/.test(formData.password);

    if (!isStrongPassword) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character."
      );
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const result = await signupUser({
        username,
        fullName,
        email,
        phone,
        password: formData.password,
      });

      if (!result.success) {
        setError(
          result.message ||
            "Unable to create account."
        );
        return;
      }

      setStep("otp");

      setSuccess(
        result.message ||
          "OTP sent to your email."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!/^[0-9]{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const result = await verifyOtp({
        email: formData.email.trim().toLowerCase(),
        otp,
      });

      if (!result.success) {
        setError(
          result.message ||
            "Unable to verify OTP."
        );
        return;
      }

      setSuccess(
        result.message ||
          "Account created successfully."
      );

      setTimeout(() => {
        navigate("/auth/login", {
          replace: true,
        });
      }, 900);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to verify OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const password = formData.password;

  const isStrongPassword =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  const isFairPassword = password.length >= 8;

  return (
    <main className={styles.page}>
      <div className={styles.background} />

      <div className={styles.container}>
        <section className={styles.card}>

          {/* BRAND */}
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

          {/* HEADING */}
          <div className={styles.headingBlock}>
            <span className={styles.eyebrow}>
              {step === "signup"
                ? "CREATE ACCOUNT"
                : "VERIFY EMAIL"}
            </span>

            <h1 className={styles.heading}>
              {step === "signup" ? (
                <>
                  Build your
                  <br />
                  <span>account.</span>
                </>
              ) : (
                <>
                  Verify your
                  <br />
                  <span>email.</span>
                </>
              )}
            </h1>

            <p className={styles.description}>
              {step === "signup"
                ? "Create your ProductSphere account and start managing your product catalog from one workspace."
                : `We've sent a 6-digit verification code to ${formData.email}.`}
            </p>
          </div>

          {/* SIGNUP FORM */}
          {step === "signup" && (
            <form
              className={styles.form}
              onSubmit={handleSignup}
            >
              {/* USERNAME */}
              <div className={styles.field}>
                <label htmlFor="username">
                  Username
                </label>

                <div className={styles.inputWrapper}>
                  <FiUser
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    autoComplete="username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* FULL NAME */}
              <div className={styles.field}>
                <label htmlFor="fullName">
                  Full Name
                </label>

                <div className={styles.inputWrapper}>
                  <FiUser
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* EMAIL */}
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
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* PHONE */}
              <div className={styles.field}>
                <label htmlFor="phone">
                  Phone
                  <span className={styles.optional}>
                    Optional
                  </span>
                </label>

                <div className={styles.inputWrapper}>
                  <FiPhone
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10 digit phone number"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className={styles.field}>
                <label htmlFor="password">
                  Password
                </label>

                <div
                  className={`${styles.inputWrapper} ${styles.passwordWrapper}`}
                >
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
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    aria-describedby="password-help"
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
                    aria-pressed={showPassword}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>

                {/* PASSWORD STRENGTH */}
                {password && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthHeader}>
                      <span>
                        Password strength
                      </span>

                      <span
                        className={`${styles.strengthLabel} ${
                          isStrongPassword
                            ? styles.strengthStrong
                            : isFairPassword
                            ? styles.strengthFair
                            : styles.strengthWeak
                        }`}
                      >
                        {isStrongPassword
                          ? "Strong"
                          : isFairPassword
                          ? "Fair"
                          : "Weak"}
                      </span>
                    </div>

                    <div className={styles.strengthBar}>
                      <span
                        className={`${styles.strengthProgress} ${
                          isStrongPassword
                            ? styles.progressStrong
                            : isFairPassword
                            ? styles.progressFair
                            : styles.progressWeak
                        }`}
                      />
                    </div>

                    <p
                      id="password-help"
                      className={styles.passwordHint}
                    >
                      Use a combination of
                      letters, numbers and special
                      characters.
                    </p>

                    <div className={styles.passwordRequirements}>
                      <span
                        className={
                          password.length >= 8
                            ? styles.requirementPassed
                            : ""
                        }
                      >
                        <FiCheckCircle />
                        8+ characters
                      </span>

                      <span
                        className={
                          /[A-Z]/.test(password)
                            ? styles.requirementPassed
                            : ""
                        }
                      >
                        <FiCheckCircle />
                        Uppercase letter
                      </span>

                      <span
                        className={
                          /[a-z]/.test(password)
                            ? styles.requirementPassed
                            : ""
                        }
                      >
                        <FiCheckCircle />
                        Lowercase letter
                      </span>

                      <span
                        className={
                          /\d/.test(password)
                            ? styles.requirementPassed
                            : ""
                        }
                      >
                        <FiCheckCircle />
                        Number
                      </span>

                      <span
                        className={
                          /[^A-Za-z0-9]/.test(password)
                            ? styles.requirementPassed
                            : ""
                        }
                      >
                        <FiCheckCircle />
                        Special character
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ERROR */}
              {error && (
                <p className={styles.errorMessage}>
                  {error}
                </p>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className={styles.signupButton}
                disabled={isLoading}
              >
                <span>
                  {isLoading
                    ? "Sending OTP..."
                    : "Create Account"}
                </span>

                {!isLoading && (
                  <FiArrowRight
                    aria-hidden="true"
                  />
                )}
              </button>
            </form>
          )}

          {/* OTP FORM */}
          {step === "otp" && (
            <form
              className={styles.form}
              onSubmit={handleVerifyOtp}
            >
              <div className={styles.otpField}>
                <label htmlFor="otp">
                  Verification Code
                </label>

                <div className={styles.otpWrapper}>
                  <FiLock
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />

                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="000000"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {success && (
                <p className={styles.successMessage}>
                  <FiCheckCircle
                    aria-hidden="true"
                  />
                  <span>{success}</span>
                </p>
              )}

              {error && (
                <p className={styles.errorMessage}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={styles.signupButton}
                disabled={
                  isLoading ||
                  otp.length !== 6
                }
              >
                <span>
                  {isLoading
                    ? "Verifying..."
                    : "Verify Email"}
                </span>

                {!isLoading && (
                  <FiArrowRight
                    aria-hidden="true"
                  />
                )}
              </button>

              <button
                type="button"
                className={styles.backButton}
                onClick={() => {
                  setStep("signup");
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                disabled={isLoading}
              >
                Edit signup details
              </button>
            </form>
          )}

          {/* FOOTER */}
          <div className={styles.loginPrompt}>
            <span>
              Already have an account?
            </span>

            <Link to="/auth/login">
              Login
            </Link>
          </div>

        </section>
      </div>
    </main>
  );
};

export default Signup;