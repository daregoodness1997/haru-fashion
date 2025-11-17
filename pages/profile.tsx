import { useEffect } from "react";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const t = useTranslations("Profile");
  const tNav = useTranslations("Navigation");
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.user) {
      router.push("/");
      return;
    }
  }, [auth.user, router]);

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
      <Header title="My Profile - Shunapee Fashion House Fashion" />

      <main id="main-content">
        {/* Breadcrumb Section */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/" className="text-gray400">
                {t("home")}
              </Link>{" "}
              / <span>{t("my_profile")}</span>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="app-x-padding app-max-width my-12">
          <div className="max-w-6xl mx-auto">
            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {auth.user?.fullname}! 👋
              </h1>
              <p className="text-gray400">{t("manage_your_info")}</p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link
                href="/profile/edit"
                className="bg-white border-2 border-gray200 hover:border-gray500 rounded-lg p-6 transition-all hover:shadow-lg group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl">✏️</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {t("edit_profile")}
                </h3>
                <p className="text-sm text-gray400">
                  Update your personal info
                </p>
              </Link>

              <Link
                href="/orders"
                className="bg-white border-2 border-gray200 hover:border-gray500 rounded-lg p-6 transition-all hover:shadow-lg group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {tNav("my_orders")}
                </h3>
                <p className="text-sm text-gray400">Track your orders</p>
              </Link>

              <Link
                href="/wishlist"
                className="bg-white border-2 border-gray200 hover:border-gray500 rounded-lg p-6 transition-all hover:shadow-lg group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <span className="text-2xl">❤️</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">Wishlist</h3>
                <p className="text-sm text-gray400">View saved items</p>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-white border-2 border-gray200 hover:border-red-500 rounded-lg p-6 transition-all hover:shadow-lg group text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <span className="text-2xl">🚪</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">{t("logout")}</h3>
                <p className="text-sm text-gray400">Sign out of your account</p>
              </button>
            </div>

            {/* Profile Information Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Personal Info Card */}
              <div className="bg-white border border-gray200 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xl">👤</span>
                      </div>
                      <h2 className="text-xl font-semibold">
                        {t("personal_info")}
                      </h2>
                    </div>
                    <Link
                      href="/profile/edit"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit →
                    </Link>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray400 mb-1">Full Name</p>
                    <p className="text-base font-medium">
                      {auth.user?.fullname || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray400 mb-1">Email</p>
                    <p className="text-base font-medium">{auth.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray400 mb-1">Phone</p>
                    <p className="text-base font-medium">
                      {auth.user?.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-white border border-gray200 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xl">📍</span>
                      </div>
                      <h2 className="text-xl font-semibold">
                        {t("shipping_address")}
                      </h2>
                    </div>
                    <Link
                      href="/profile/edit"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit →
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {auth.user?.shippingAddress ? (
                    <p className="text-base">{auth.user.shippingAddress}</p>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray400 mb-3">
                        No shipping address added
                      </p>
                      <Link
                        href="/profile/edit"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Add address →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow-sm p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm">
                  <span className="text-2xl">ℹ️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-3">
                    {t("account_info")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray500 mb-1">
                        Account Status
                      </p>
                      <p className="font-semibold text-green-600">
                        ✓ {auth.user?.isAdmin ? "Admin" : "Active"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray500 mb-1">Member Since</p>
                      <p className="font-semibold">
                        {new Date().getFullYear()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray500 mb-1">Account Type</p>
                      <p className="font-semibold">
                        {auth.user?.isAdmin ? "Administrator" : "Customer"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Quick Access */}
            {auth.user?.isAdmin && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Admin Access
                      </h3>
                      <p className="text-sm text-gray500">
                        Manage products, orders, and customers
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/admin"
                    className="px-6 py-3 bg-green-600 text-gray500 hover:bg-green-700 transition-colors rounded-lg font-medium"
                  >
                    Go to Dashboard →
                  </Link>
                </div>
              </div>
            )}
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
