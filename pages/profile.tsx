import { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Input from "../components/Input/Input";
import Button from "../components/Buttons/Button";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const t = useTranslations("Profile");
  const tNav = useTranslations("Navigation");
  const auth = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form fields
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!auth.user) {
      router.push("/");
      return;
    }

    // Initialize form with user data
    setFullname(auth.user.fullname || "");
    setEmail(auth.user.email || "");
    setPhone(auth.user.phone || "");
    setShippingAddress(auth.user.shippingAddress || "");
  }, [auth.user, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate password fields if changing password
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setErrorMsg("current_password_required");
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg("passwords_not_match");
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg("password_too_short");
        return;
      }
    }

    setIsSaving(true);

    try {
      const updateData: any = {
        fullname,
        phone,
        shippingAddress,
      };

      // Only include password if user wants to change it
      if (currentPassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${auth.user?.id}`,
        updateData
      );

      if (res.data.success) {
        // Update auth context with new user data
        if (auth.updateUser) {
          auth.updateUser({
            ...auth.user!,
            fullname,
            phone,
            shippingAddress,
          });
        }

        setSuccessMsg("profile_updated");
        setIsEditing(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMsg(res.data.error?.message || "update_failed");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMsg(error.response?.data?.error?.message || "update_failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFullname(auth.user?.fullname || "");
    setEmail(auth.user?.email || "");
    setPhone(auth.user?.phone || "");
    setShippingAddress(auth.user?.shippingAddress || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsEditing(false);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleLogout = () => {
    if (auth.logout) {
      auth.logout();
      router.push("/");
    }
  };

  if (!auth.user) {
    return null;
  }

  return (
    <div>
      <Header title="My Profile - Haru Fashion" />

      <main id="main-content">
        {/* Breadcrumb Section */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/" className="text-gray400">
                {tNav("home")}
              </Link>{" "}
              / <span>{t("my_profile")}</span>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="app-x-padding app-max-width my-12">
          <div className="max-w-5xl mx-auto">
            {/* Header with Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-semibold mb-2">
                  {t("my_profile")}
                </h1>
                <p className="text-gray400">{t("manage_your_info")}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/orders"
                  className="px-5 py-2.5 bg-gray500 text-white hover:bg-gray600 transition-colors rounded"
                >
                  📦 {tNav("my_orders")}
                </Link>
                {auth.user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 transition-colors rounded"
                  >
                    🛡️ {tNav("admin_dashboard")}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 transition-colors rounded"
                >
                  🚪 {t("logout")}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-start">
                <span className="text-xl mr-3">✓</span>
                <span>{t(successMsg)}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start">
                <span className="text-xl mr-3">⚠</span>
                <span>{t(errorMsg)}</span>
              </div>
            )}

            {/* Profile Form */}
            <form
              onSubmit={handleSave}
              className="bg-white border border-gray200 rounded-lg shadow-sm"
            >
              {/* Personal Information Section */}
              <div className="p-8 border-b border-gray200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {t("personal_info")}
                    </h2>
                    <p className="text-sm text-gray400">
                      {t("personal_info_desc")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      {t("fullname")} <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      disabled={!isEditing}
                      required
                      className={`w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors ${
                        !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      disabled={true}
                      className="w-full px-4 py-3 border-2 border-gray300 rounded bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray400 mt-1">
                      🔒 {t("email_cannot_change")}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      {t("phone")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors ${
                        !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="p-8 border-b border-gray200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {t("shipping_address")}
                    </h2>
                    <p className="text-sm text-gray400">
                      {t("shipping_address_desc")}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray700 mb-2">
                    {t("address")}
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors ${
                      !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                    placeholder={isEditing ? t("address_placeholder") : ""}
                  />
                </div>
              </div>

              {/* Password Change Section */}
              {isEditing && (
                <div className="p-8 border-b border-gray200 bg-gray-50">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">🔑</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {t("change_password")}
                      </h2>
                      <p className="text-sm text-gray400">
                        {t("password_change_note")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray700 mb-2">
                        {t("current_password")}
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={t("optional")}
                        className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray700 mb-2">
                        {t("new_password")}
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t("min_6_chars")}
                        className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray700 mb-2">
                        {t("confirm_password")}
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("retype_password")}
                        className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-8 bg-gray-50 rounded-b-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  {!isEditing ? (
                    <Button
                      type="button"
                      value={`✏️ ${t("edit_profile")}`}
                      onClick={() => setIsEditing(true)}
                      extraClass="sm:w-auto"
                    />
                  ) : (
                    <>
                      <Button
                        type="submit"
                        value={
                          isSaving ? t("saving") : `💾 ${t("save_changes")}`
                        }
                        disabled={isSaving}
                        extraClass="sm:w-auto"
                      />
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-8 py-3 border-2 border-gray300 text-gray600 hover:bg-gray100 transition-colors rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving}
                      >
                        ✕ {t("cancel")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>

            {/* Account Info Card */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">
                ℹ️ {t("account_info")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray500 font-medium">
                    {t("member_since")}:
                  </span>
                  <span className="ml-2 text-gray700">
                    {new Date().getFullYear()}
                  </span>
                </div>
                <div>
                  <span className="text-gray500 font-medium">
                    {t("account_status")}:
                  </span>
                  <span className="ml-2 text-green-600 font-medium">
                    ✓ {auth.user?.isAdmin ? t("admin_account") : t("active")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../messages/common/${locale}.json`)).default,
      locale: locale || "en",
    },
  };
};

export default Profile;
