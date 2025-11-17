import { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Buttons/Button";
import { useAuth } from "../../context/AuthContext";

const EditProfile = () => {
  const t = useTranslations("Profile");
  const tNav = useTranslations("Navigation");
  const auth = useAuth();
  const router = useRouter();

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

  // Measurements
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [shoulderWidth, setShoulderWidth] = useState("");
  const [sleeveLength, setSleeveLength] = useState("");
  const [inseam, setInseam] = useState("");
  const [outseam, setOutseam] = useState("");
  const [neckSize, setNeckSize] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

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
    // @ts-ignore
    setChest(auth.user.chest || "");
    // @ts-ignore
    setWaist(auth.user.waist || "");
    // @ts-ignore
    setHips(auth.user.hips || "");
    // @ts-ignore
    setShoulderWidth(auth.user.shoulderWidth || "");
    // @ts-ignore
    setSleeveLength(auth.user.sleeveLength || "");
    // @ts-ignore
    setInseam(auth.user.inseam || "");
    // @ts-ignore
    setOutseam(auth.user.outseam || "");
    // @ts-ignore
    setNeckSize(auth.user.neckSize || "");
    // @ts-ignore
    setHeight(auth.user.height || "");
    // @ts-ignore
    setWeight(auth.user.weight || "");
    // @ts-ignore
    setAdditionalNotes(auth.user.additionalNotes || "");
  }, [auth.user, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate password fields if changing password
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        toast.error(
          t("current_password_required") || "Current password is required"
        );
        setErrorMsg("current_password_required");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error(t("passwords_not_match") || "Passwords do not match");
        setErrorMsg("passwords_not_match");
        return;
      }
      if (newPassword.length < 6) {
        toast.error(
          t("password_too_short") || "Password must be at least 6 characters"
        );
        setErrorMsg("password_too_short");
        return;
      }
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Updating your profile...");

    try {
      const updateData: any = {
        fullname,
        phone,
        shippingAddress,
        chest,
        waist,
        hips,
        shoulderWidth,
        sleeveLength,
        inseam,
        outseam,
        neckSize,
        height,
        weight,
        additionalNotes,
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

        toast.success(t("profile_updated") || "Profile updated successfully!", {
          id: loadingToast,
        });
        setSuccessMsg("profile_updated");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Redirect to profile page after 2 seconds
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else {
        toast.error(
          res.data.error?.message ||
            t("update_failed") ||
            "Failed to update profile",
          {
            id: loadingToast,
          }
        );
        setErrorMsg(res.data.error?.message || "update_failed");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.error?.message ||
          t("update_failed") ||
          "Failed to update profile",
        {
          id: loadingToast,
        }
      );
      setErrorMsg(error.response?.data?.error?.message || "update_failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (!auth.user) {
    return null;
  }

  return (
    <div>
      <Header title="Edit Profile - Shunapee Fashion House Fashion" />

      <main id="main-content">
        {/* Breadcrumb Section */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/" className="text-gray400">
                {tNav("home")}
              </Link>{" "}
              /{" "}
              <Link href="/profile" className="text-gray400">
                {t("my_profile")}
              </Link>{" "}
              / <span>Edit Profile</span>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="app-x-padding app-max-width my-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">✏️ Edit Profile</h1>
                <p className="text-gray400">Update your personal information</p>
              </div>
              <Link
                href="/profile"
                className="px-5 py-2.5 border-2 border-gray300 text-gray600 hover:bg-gray100 transition-colors rounded font-medium"
              >
                ← Back to Profile
              </Link>
            </div>

            {/* Success Message */}
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-start">
                <span className="text-xl mr-3">✓</span>
                <div>
                  <p className="font-medium">{t(successMsg)}</p>
                  <p className="text-sm mt-1">Redirecting to profile...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start">
                <span className="text-xl mr-3">⚠</span>
                <span>{t(errorMsg)}</span>
              </div>
            )}

            {/* Edit Form */}
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
                      required
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
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
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
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
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    placeholder={t("address_placeholder")}
                  />
                </div>
              </div>

              {/* Measurements Section */}
              <div className="p-8 border-b border-gray200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">📏</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Body Measurements
                    </h2>
                    <p className="text-sm text-gray400">
                      Add your measurements for custom-fitted orders (Optional)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Chest (inches/cm)
                    </label>
                    <input
                      type="text"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      placeholder="e.g., 38 inches"
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Waist (inches/cm)
                    </label>
                    <input
                      type="text"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      placeholder="e.g., 32 inches"
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Hips (inches/cm)
                    </label>
                    <input
                      type="text"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                      placeholder="e.g., 40 inches"
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Shoulder Width
                    </label>
                    <input
                      type="text"
                      value={shoulderWidth}
                      onChange={(e) => setShoulderWidth(e.target.value)}
                      placeholder="e.g., 17 inches"
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Sleeve Length
                    </label>
                    <input
                      type="text"
                      value={sleeveLength}
                      onChange={(e) => setSleeveLength(e.target.value)}
                      placeholder="e.g., 24 inches"
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Neck Size
                    </label>
                    <input
                      type="text"
                      value={neckSize}
                      onChange={(e) => setNeckSize(e.target.value)}
                      placeholder="e.g., 15.5 inches"
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Inseam (pants)
                    </label>
                    <input
                      type="text"
                      value={inseam}
                      onChange={(e) => setInseam(e.target.value)}
                      placeholder="e.g., 30 inches"
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Outseam (pants)
                    </label>
                    <input
                      type="text"
                      value={outseam}
                      onChange={(e) => setOutseam(e.target.value)}
                      placeholder="e.g., 42 inches"
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Height
                    </label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g., 5'10 or 178cm"
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g., 150 lbs or 68kg"
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={3}
                      placeholder="Any specific fitting preferences, body shape notes, or special requirements..."
                      className="w-full px-4 py-3 border-2 border-gray300 rounded focus:outline-none focus:border-gray500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
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
                      {t("password_change_note")} - Leave blank to keep current
                      password
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

              {/* Action Buttons */}
              <div className="p-8 bg-gray-50 rounded-b-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    value={isSaving ? t("saving") : `💾 ${t("save_changes")}`}
                    disabled={isSaving}
                    extraClass="sm:w-auto"
                  />
                  <Link
                    href="/profile"
                    className="px-8 py-3 border-2 border-gray300 text-gray600 hover:bg-gray100 transition-colors rounded font-medium text-center"
                  >
                    ✕ {t("cancel")}
                  </Link>
                </div>
              </div>
            </form>
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
      messages: (await import(`../../messages/common/${locale}.json`)).default,
      locale: locale || "en",
    },
  };
};

export default EditProfile;
