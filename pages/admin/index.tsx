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
        <div className="app-x-padding app-max-width my-8">
          <h1 className="text-4xl mb-8">{t("admin_dashboard")}</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border border-gray200 p-6">
              <h3 className="text-gray400 text-sm uppercase mb-2">
                {t("total_orders")}
              </h3>
              <p className="text-4xl font-semibold">{stats.totalOrders}</p>
            </div>
            <div className="border border-gray200 p-6">
              <h3 className="text-gray400 text-sm uppercase mb-2">
                {t("pending_orders")}
              </h3>
              <p className="text-4xl font-semibold">{stats.pendingOrders}</p>
            </div>
            <div className="border border-gray200 p-6">
              <h3 className="text-gray400 text-sm uppercase mb-2">
                {t("total_products")}
              </h3>
              <p className="text-4xl font-semibold">{stats.totalProducts}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              href="/admin/orders"
              className="border-2 border-gray500 p-6 hover:bg-gray500 hover:text-white transition-colors text-center"
            >
              <h3 className="text-2xl font-semibold">{t("manage_orders")}</h3>
              <p className="mt-2">{t("view_and_update_orders")}</p>
            </Link>
            <Link
              href="/admin/products"
              className="border-2 border-gray500 p-6 hover:bg-gray500 hover:text-white transition-colors text-center"
            >
              <h3 className="text-2xl font-semibold">{t("manage_products")}</h3>
              <p className="mt-2">{t("add_edit_delete_products")}</p>
            </Link>
          </div>

          {/* Recent Orders */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {t("recent_orders")}
            </h2>
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray400">{t("no_orders")}</p>
            ) : (
              <div className="border border-gray200">
                <table className="w-full">
                  <thead className="bg-gray100">
                    <tr>
                      <th className="text-left p-4">{t("order_number")}</th>
                      <th className="text-left p-4">{t("customer")}</th>
                      <th className="text-left p-4">{t("total")}</th>
                      <th className="text-left p-4">{t("status")}</th>
                      <th className="text-left p-4">{t("date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order: any) => (
                      <tr key={order.id} className="border-t border-gray200">
                        <td className="p-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            #{order.orderNumber}
                          </Link>
                        </td>
                        <td className="p-4">{order.customer.fullname}</td>
                        <td className="p-4">
                          <Price amount={order.totalPrice} />
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-sm ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray100 text-gray500"
                            }`}
                          >
                            {t(order.status)}
                          </span>
                        </td>
                        <td className="p-4">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
