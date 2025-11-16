import { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Price from "../../../components/Price/Price";
import { useAuth } from "../../../context/AuthContext";

export default function AdminOrders() {
  const t = useTranslations("Admin");
  const router = useRouter();
  const auth = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const statusQuery =
        filterStatus !== "all" ? `&status=${filterStatus}` : "";
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/orders?userId=${auth.user?.id}&page=${currentPage}${statusQuery}`
      );

      setOrders(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 403) {
        alert(t("admin_access_required"));
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.user) {
      router.push("/");
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, currentPage, filterStatus]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/orders`,
        {
          userId: auth.user?.id,
          orderId,
          status: newStatus,
        }
      );

      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(t("update_failed"));
    }
  };

  if (!auth.user || loading) {
    return (
      <div>
        <Header title="Manage Orders - Admin - Shunapee Fashion House Fashion" />
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
      <Header title="Manage Orders - Admin - Shunapee Fashion House Fashion" />

      <main id="main-content">
        {/* Breadcrumb */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/" className="text-gray400">
                {t("home")}
              </Link>{" "}
              /{" "}
              <Link href="/admin" className="text-gray400">
                {t("admin")}
              </Link>{" "}
              / <span>{t("manage_orders")}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="app-x-padding app-max-width my-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl">{t("manage_orders")}</h1>
            <Link
              href="/admin"
              className="px-6 py-3 border border-gray500 text-gray500 hover:bg-gray500 hover:text-white transition-colors"
            >
              {t("back_to_dashboard")}
            </Link>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <label className="mr-4">{t("filter_by_status")}:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray300 px-4 py-2"
            >
              <option value="all">{t("all_statuses")}</option>
              <option value="pending">{t("pending")}</option>
              <option value="processing">{t("processing")}</option>
              <option value="shipped">{t("shipped")}</option>
              <option value="delivered">{t("delivered")}</option>
              <option value="cancelled">{t("cancelled")}</option>
            </select>
          </div>

          {/* Orders Table */}
          {orders.length === 0 ? (
            <p className="text-gray400 text-center py-8">{t("no_orders")}</p>
          ) : (
            <>
              <div className="border border-gray200 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray100">
                    <tr>
                      <th className="text-left p-4">{t("order_number")}</th>
                      <th className="text-left p-4">{t("customer")}</th>
                      <th className="text-left p-4">{t("items")}</th>
                      <th className="text-left p-4">{t("total")}</th>
                      <th className="text-left p-4">{t("status")}</th>
                      <th className="text-left p-4">{t("date")}</th>
                      <th className="text-left p-4">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-gray200">
                        <td className="p-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            #{order.orderNumber}
                          </Link>
                        </td>
                        <td className="p-4">
                          <div>{order.customer.fullname}</div>
                          <div className="text-sm text-gray400">
                            {order.customer.email}
                          </div>
                        </td>
                        <td className="p-4">{order.orderItems.length}</td>
                        <td className="p-4">
                          <Price amount={order.totalPrice} />
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className={`px-3 py-1 text-sm border ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-800 border-red-300"
                                : "bg-gray100 text-gray500 border-gray300"
                            }`}
                          >
                            <option value="pending">{t("pending")}</option>
                            <option value="processing">
                              {t("processing")}
                            </option>
                            <option value="shipped">{t("shipped")}</option>
                            <option value="delivered">{t("delivered")}</option>
                            <option value="cancelled">{t("cancelled")}</option>
                          </select>
                        </td>
                        <td className="p-4">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {t("view_details")}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray300 disabled:opacity-50"
                  >
                    {t("previous")}
                  </button>
                  <span className="px-4 py-2">
                    {t("page")} {currentPage} {t("of")} {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray300 disabled:opacity-50"
                  >
                    {t("next")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../messages/common/${locale}.json`))
        .default,
      locale: locale || "en",
    },
  };
};
