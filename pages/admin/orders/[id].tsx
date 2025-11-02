import { useState, useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Price from "../../../components/Price/Price";
import { useAuth } from "../../../context/AuthContext";

export default function AdminOrderDetail() {
  const t = useTranslations("Admin");
  const tOrders = useTranslations("Orders");
  const router = useRouter();
  const { id } = router.query;
  const auth = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    if (!auth.user) {
      router.push("/");
      return;
    }

    if (id) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, auth.user]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${id}`
      );

      setOrder(res.data.data);
      setNewStatus(res.data.data.status || "pending");
      setTrackingNumber(res.data.data.trackingNumber || "");
    } catch (error: any) {
      console.error("Error fetching order:", error);
      if (error.response?.status === 404) {
        router.push("/admin/orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/orders`,
        {
          userId: auth.user?.id,
          orderId: order.id,
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
        }
      );

      alert(t("order_updated_successfully"));
      fetchOrderDetails();
    } catch (error) {
      console.error("Error updating order:", error);
      alert(t("update_failed"));
    } finally {
      setUpdating(false);
    }
  };

  if (!auth.user || loading || !order) {
    return (
      <div>
        <Header title="Order Details - Admin - Haru Fashion" />
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
      <Header title={`Order #${order.orderNumber} - Admin - Haru Fashion`} />

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
              /{" "}
              <Link href="/admin/orders" className="text-gray400">
                {t("orders")}
              </Link>{" "}
              / <span>#{order.orderNumber}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="app-x-padding app-max-width my-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl">
              {t("order")} #{order.orderNumber}
            </h1>
            <Link
              href="/admin/orders"
              className="px-6 py-3 border border-gray500 text-gray500 hover:bg-gray500 hover:text-white transition-colors"
            >
              {t("back_to_orders")}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2">
              <div className="border border-gray200 p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {tOrders("order_items")}
                </h2>
                {order.orderItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 border-b border-gray200 last:border-0"
                  >
                    <div className="w-24 h-24 relative flex-shrink-0">
                      <Image
                        src={item.product.image1}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-gray400">
                        {tOrders("quantity")}: {item.quantity}
                      </p>
                      <p className="text-gray400">
                        <Price amount={item.price} /> {tOrders("each")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        <Price amount={item.price * item.quantity} />
                      </p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-gray200">
                  <div className="flex justify-between text-xl font-semibold">
                    <span>{tOrders("total")}</span>
                    <span>
                      <Price amount={order.totalPrice} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border border-gray200 p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {tOrders("customer_info")}
                </h2>
                <div className="space-y-2">
                  <p>
                    <strong>{tOrders("name")}:</strong>{" "}
                    {order.customer.fullname}
                  </p>
                  <p>
                    <strong>{tOrders("email")}:</strong> {order.customer.email}
                  </p>
                  <p>
                    <strong>{tOrders("phone")}:</strong>{" "}
                    {order.customer.phone || "N/A"}
                  </p>
                  <p>
                    <strong>{tOrders("shipping_address")}:</strong>{" "}
                    {order.shippingAddress}
                  </p>
                  {order.township && (
                    <p>
                      <strong>{tOrders("township")}:</strong> {order.township}
                    </p>
                  )}
                  {order.city && (
                    <p>
                      <strong>{tOrders("city")}:</strong> {order.city}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Management */}
            <div className="lg:col-span-1">
              {/* Order Status Update */}
              <div className="border border-gray200 p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {t("update_order_status")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">{t("status")}</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full border border-gray300 px-4 py-2"
                    >
                      <option value="pending">{t("pending")}</option>
                      <option value="processing">{t("processing")}</option>
                      <option value="shipped">{t("shipped")}</option>
                      <option value="delivered">{t("delivered")}</option>
                      <option value="cancelled">{t("cancelled")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">{t("tracking_number")}</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder={t("enter_tracking_number")}
                      className="w-full border border-gray300 px-4 py-2"
                    />
                  </div>

                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="w-full bg-gray500 text-white px-6 py-3 hover:bg-gray400 transition-colors disabled:opacity-50"
                  >
                    {updating ? t("updating") : t("update_order")}
                  </button>
                </div>
              </div>

              {/* Order Details */}
              <div className="border border-gray200 p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {tOrders("order_details")}
                </h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>{tOrders("order_date")}:</strong>{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>{tOrders("payment_method")}:</strong>{" "}
                    {tOrders(order.paymentType.toLowerCase())}
                  </p>
                  <p>
                    <strong>{tOrders("delivery_method")}:</strong>{" "}
                    {tOrders(order.deliveryType.toLowerCase())}
                  </p>
                  {order.deliveryDate && (
                    <p>
                      <strong>{tOrders("expected_delivery")}:</strong>{" "}
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                  )}
                  {order.trackingNumber && (
                    <p>
                      <strong>{t("tracking_number")}:</strong>{" "}
                      {order.trackingNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../messages/common/${locale}.json`))
        .default,
      locale: locale || "en",
    },
  };
};
