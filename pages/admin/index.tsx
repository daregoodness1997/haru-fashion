import { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Price from "../../components/Price/Price";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const t = useTranslations("Admin");
  const router = useRouter();
  const auth = useAuth();

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch orders
      const ordersRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/orders?userId=${auth.user?.id}&limit=5`
      );

      // Fetch products count
      const productsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/count`
      );

      const orders = ordersRes.data.data || [];
      const pendingOrders = orders.filter((o: any) => o.status === "pending");

      let totalProducts = 0;
      if (productsRes.data.data) {
        totalProducts = Object.values(productsRes.data.data).reduce(
          (sum: number, count: any) => sum + count,
          0
        );
      }

      setStats({
        totalOrders: ordersRes.data.pagination?.total || 0,
        pendingOrders: pendingOrders.length,
        totalProducts,
        recentOrders: orders.slice(0, 5),
      });
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 403) {
        alert(t("admin_access_required"));
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is admin
    if (!auth.user) {
      router.push("/");
      return;
    }

    // Note: In a real app, you'd check auth.user.isAdmin
    // For now, we'll fetch data and let the API handle auth

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, router]);

  if (!auth.user || loading) {
    return (
      <div>
        <Header title="Admin Dashboard - Shunapee Fashion House Fashion" />
        <main id="main-content">
          <div className="app-x-padding app-max-width my-8 text-center">
            <p>{t("loading")}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header title="Admin Dashboard - Shunapee Fashion House Fashion" />

      <main id="main-content">
        {/* Breadcrumb */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/" className="text-gray400">
                {t("home")}
              </Link>{" "}
              / <span>{t("admin_dashboard")}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="app-x-padding app-max-width my-12">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">🛡️ Admin Dashboard</h1>
              <p className="text-gray400">
                Manage your store, orders, and products
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-blue-600 text-sm font-semibold uppercase">
                    {t("total_orders")}
                  </h3>
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-xl">📦</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-blue-900">
                  {stats.totalOrders}
                </p>
                <p className="text-sm text-blue-600 mt-2">All time orders</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-yellow-600 text-sm font-semibold uppercase">
                    {t("pending_orders")}
                  </h3>
                  <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                    <span className="text-xl">⏳</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-yellow-900">
                  {stats.pendingOrders}
                </p>
                <p className="text-sm text-yellow-600 mt-2">Needs attention</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-green-600 text-sm font-semibold uppercase">
                    {t("total_products")}
                  </h3>
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-xl">🛍️</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-green-900">
                  {stats.totalProducts}
                </p>
                <p className="text-sm text-green-600 mt-2">In inventory</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">⚡ Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                  href="/admin/orders"
                  className="block bg-white border-2 border-gray200 hover:border-gray500 rounded-lg p-6 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("manage_orders")}
                  </h3>
                  <p className="text-sm text-gray400">
                    {t("view_and_update_orders")}
                  </p>
                </Link>

                <Link
                  href="/admin/products"
                  className="block bg-white border-2 border-gray200 hover:border-gray500 rounded-lg p-6 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                      <span className="text-2xl">🏷️</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("manage_products")}
                  </h3>
                  <p className="text-sm text-gray400">
                    {t("add_edit_delete_products")}
                  </p>
                </Link>

                <Link
                  href="/admin/service-requests"
                  className="block bg-white border-2 border-gray200 hover:border-gray500 rounded-lg p-6 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <span className="text-2xl">💼</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Service Requests
                  </h3>
                  <p className="text-sm text-gray400">
                    View customer service requests
                  </p>
                </Link>

                <Link
                  href="/profile"
                  className="block bg-white border-2 border-gray200 hover:border-gray500 rounded-lg p-6 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <span className="text-2xl">👤</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">My Profile</h3>
                  <p className="text-sm text-gray400">
                    View personal dashboard
                  </p>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray200">
                <h2 className="text-2xl font-bold">📊 {t("recent_orders")}</h2>
              </div>
              {stats.recentOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray400 mb-3">{t("no_orders")}</p>
                  <Link href="/" className="text-blue-600 hover:underline">
                    Browse products →
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-semibold">
                          {t("order_number")}
                        </th>
                        <th className="text-left p-4 font-semibold">
                          {t("customer")}
                        </th>
                        <th className="text-left p-4 font-semibold">
                          {t("total")}
                        </th>
                        <th className="text-left p-4 font-semibold">
                          {t("status")}
                        </th>
                        <th className="text-left p-4 font-semibold">
                          {t("date")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order: any) => (
                        <tr
                          key={order.id}
                          className="border-t border-gray200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              #{order.orderNumber}
                            </Link>
                          </td>
                          <td className="p-4">
                            {order.customer?.fullname ||
                              order.customerName ||
                              "Guest"}
                          </td>
                          <td className="p-4 font-semibold">
                            <Price amount={order.totalPrice} />
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 text-sm rounded-full font-medium ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "paid"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray400">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="p-4 border-t border-gray200 text-center">
                <Link
                  href="/admin/orders"
                  className="text-blue-600 hover:underline font-medium"
                >
                  View all orders →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/common/${locale}.json`)).default,
      locale: locale || "en",
    },
  };
};
