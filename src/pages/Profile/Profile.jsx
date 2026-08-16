import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLogOut,
  FiMail,
  FiUser,
} from "react-icons/fi";

import { removeToken } from "../../utils/auth";
import {
  changePassword,
  getProfile,
} from "../../services/profileService";
import useReveal from "../../hooks/useReveal";

import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();

  const headerRef = useReveal({ delay: 0 });
  const detailsRef = useReveal({ delay: 100 });
  const passwordRef = useReveal({ delay: 200 });
  const logoutRef = useReveal({ delay: 300 });

  const [user, setUser] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  /* =========================
     FETCH PROFILE
  ========================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);

        const result = await getProfile();

        if (!result.success || !result.data) {
          throw new Error(
            result.message || "Unable to fetch profile."
          );
        }

        setUser(result.data);
      } catch (error) {
        const status = error.response?.status;

        if (status === 401) {
          removeToken();

          navigate("/auth/login", {
            replace: true,
          });

          return;
        }

        console.error("Profile fetch error:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* =========================
     PASSWORD STRENGTH
  ========================= */

  const passwordRules = useMemo(() => {
    const password = passwordData.newPassword;

    return {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [passwordData.newPassword]);

  const strengthScore = Object.values(passwordRules).filter(
    Boolean
  ).length;

  const getStrengthLabel = () => {
    if (!passwordData.newPassword) return "";

    if (strengthScore <= 2) return "Weak";
    if (strengthScore === 3) return "Fair";
    if (strengthScore === 4) return "Good";

    return "Strong";
  };

  const strengthLabel = getStrengthLabel();

  /* =========================
     PASSWORD CHANGE
  ========================= */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordData.currentPassword) {
      setPasswordError(
        "Please enter your current password."
      );
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError(
        "Please enter your new password."
      );
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (
      passwordData.currentPassword ===
      passwordData.newPassword
    ) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setIsChangingPassword(true);

      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (!result.success) {
        setPasswordError(
          result.message ||
            "Unable to change password."
        );
        return;
      }

      setPasswordSuccess(
        "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      setPasswordError(
        error.response?.data?.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    removeToken();

    navigate("/auth/login", {
      replace: true,
    });
  };

  /* =========================
     LOADING
  ========================= */

  if (isLoadingProfile) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <section className={styles.card}>
            <div className={styles.loading}>
              Loading profile...
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <section className={styles.card}>
            <div className={styles.loading}>
              Unable to load profile.
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* Back */}

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        <section className={styles.card}>

          {/* =========================
              PROFILE HEADER
          ========================= */}

          <div ref={headerRef} className={`${styles.header} reveal`}>

            <div className={styles.avatar}>
              {(user.fullName || user.username)
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <span className={styles.eyebrow}>
                MY PROFILE
              </span>

              <h1 className={styles.heading}>
                {user.fullName || user.username}
              </h1>

              <p className={styles.username}>
                @{user.username}
              </p>
            </div>

          </div>

          {/* =========================
              PROFILE DETAILS
          ========================= */}

          <div ref={detailsRef} className={`${styles.details} reveal`}>

            <div className={styles.detailItem}>
              <div className={styles.iconBox}>
                <FiUser />
              </div>

              <div>
                <span className={styles.label}>
                  Username
                </span>

                <span className={styles.value}>
                  {user.username}
                </span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.iconBox}>
                <FiMail />
              </div>

              <div>
                <span className={styles.label}>
                  Email
                </span>

                <span className={styles.value}>
                  {user.email}
                </span>
              </div>
            </div>

            {user.phone && (
              <div className={styles.detailItem}>
                <div className={styles.iconBox}>
                  <FiUser />
                </div>

                <div>
                  <span className={styles.label}>
                    Phone
                  </span>

                  <span className={styles.value}>
                    {user.phone}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* =========================
              CHANGE PASSWORD
          ========================= */}

          <div ref={passwordRef} className={`${styles.passwordSection} reveal`}>

            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FiKey />
              </div>

              <div>
                <h2 className={styles.sectionTitle}>
                  Change Password
                </h2>

                <p className={styles.sectionDescription}>
                  Update your password using your current
                  password.
                </p>
              </div>
            </div>

            <form
              className={styles.passwordForm}
              onSubmit={handleChangePassword}
            >

              {/* Current Password */}

              <div className={styles.field}>
                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <div className={styles.inputWrapper}>

                  <FiKey
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.currentPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    disabled={isChangingPassword}
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setShowCurrentPassword(
                        (previous) => !previous
                      )
                    }
                    disabled={isChangingPassword}
                    aria-label={
                      showCurrentPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showCurrentPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>
              </div>

              {/* New Password */}

              <div className={styles.field}>
                <label htmlFor="newPassword">
                  New Password
                </label>

                <div className={styles.inputWrapper}>

                  <FiKey
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />

                  <input
                    id="newPassword"
                    name="newPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.newPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={isChangingPassword}
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setShowNewPassword(
                        (previous) => !previous
                      )
                    }
                    disabled={isChangingPassword}
                    aria-label={
                      showNewPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

                {/* Password Strength */}

                {passwordData.newPassword && (
                  <div className={styles.passwordStrength}>

                    <div className={styles.strengthHeader}>
                      <span>
                        Password strength
                      </span>

                      <strong
                        className={
                          strengthScore <= 2
                            ? styles.strengthWeak
                            : strengthScore === 3
                            ? styles.strengthFair
                            : strengthScore === 4
                            ? styles.strengthGood
                            : styles.strengthStrong
                        }
                      >
                        {strengthLabel}
                      </strong>
                    </div>

                    <div className={styles.strengthBars}>
                      {[1, 2, 3, 4, 5].map(
                        (bar) => (
                          <span
                            key={bar}
                            className={
                              bar <= strengthScore
                                ? styles.strengthActive
                                : ""
                            }
                          />
                        )
                      )}
                    </div>

                    <ul
                      className={styles.passwordRules}
                    >
                      <li
                        className={
                          passwordRules.minLength
                            ? styles.rulePassed
                            : ""
                        }
                      >
                        At least 8 characters
                      </li>

                      <li
                        className={
                          passwordRules.uppercase
                            ? styles.rulePassed
                            : ""
                        }
                      >
                        One uppercase letter
                      </li>

                      <li
                        className={
                          passwordRules.lowercase
                            ? styles.rulePassed
                            : ""
                        }
                      >
                        One lowercase letter
                      </li>

                      <li
                        className={
                          passwordRules.number
                            ? styles.rulePassed
                            : ""
                        }
                      >
                        One number
                      </li>

                      <li
                        className={
                          passwordRules.special
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
                  Confirm New Password
                </label>

                <div className={styles.inputWrapper}>

                  <FiKey
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={isChangingPassword}
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    disabled={isChangingPassword}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>
              </div>

              {passwordError && (
                <p className={styles.errorMessage}>
                  {passwordError}
                </p>
              )}

              {passwordSuccess && (
                <p className={styles.successMessage}>
                  <FiCheck />
                  <span>{passwordSuccess}</span>
                </p>
              )}

              <button
                type="submit"
                className={styles.changePasswordButton}
                disabled={isChangingPassword}
              >
                <FiKey />

                <span>
                  {isChangingPassword
                    ? "Changing Password..."
                    : "Change Password"}
                </span>
              </button>

            </form>
          </div>

          {/* =========================
              LOGOUT
          ========================= */}

          <div ref={logoutRef} className={`${styles.actions} reveal`}>

            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              <FiLogOut />
              <span>Logout</span>
            </button>

          </div>

        </section>
      </div>
    </main>
  );
};

export default Profile;