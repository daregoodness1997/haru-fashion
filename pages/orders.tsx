import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import prisma from "../lib/prisma";
import Price from "../components/Price/Price";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image1: string;
  };
};

type Order = {
  id: number;
  orderNumber: number;
  orderDate: string;
  totalPrice: number;
  paymentType: string;
  deliveryType: string;
  deliveryDate: string;
  shippingAddress: string;
  status: string;
  trackingNumber?: string;
  orderItems: OrderItem[];
};

type Props = {
  orders: Order[];
};

const Orders: React.FC<Props> = ({ orders }) => {
  const t = useTranslations("Orders");
  const auth = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "delivered":
        return "text-green-600";
      case "shipped":
        return "text-purple-600";
      case "processing":
        return "text-blue-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-orange-600"; // pending
    }
  };

  const getStatusText = (status: string) => {
    const statusLower = status.toLowerCase();
    // Try to get translation, fallback to capitalized status
    try {
      return t(statusLower);
    } catch {
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  if (!auth.user) {
    return (
      <div>
        <Header title="My Orders - Haru Fashion" />
        <main className="app-max-width app-x-padding my-16 text-center">
          <h1 className="text-3xl mb-4">{t("please_login")}</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            {t("go_to_home")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header title="My Orders - Haru Fashion" />

      <main id="main-content">
        {/* Breadcrumb Section */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/" className="text-gray400">
                {t("home")}
              </Link>{" "}
              / <span>{t("my_orders")}</span>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="app-x-padding app-max-width my-8">
          <h1 className="text-4xl mb-6">{t("my_orders")}</h1>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray400 mb-4">{t("no_orders")}</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-gray500 text-white hover:bg-gray600"
              >
                {t("start_shopping")}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">
                        {t("order")} #{order.orderNumber}
                      </h2>
                      <p className="text-gray400 mb-1">
                        {t("order_date")}: {formatDate(order.orderDate)}
                      </p>
                      <p className="text-gray400 mb-1">
                        {t("delivery_date")}: {formatDate(order.deliveryDate)}
                      </p>
                      <p
                        className={`font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {t("status")}: {getStatusText(order.status)}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-gray400 mt-1">
                          {t("tracking")}: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 md:mt-0 text-left md:text-right">
                      <p className="text-2xl font-bold mb-2">
                        <Price amount={order.totalPrice} />
                      </p>
                      <p className="text-sm text-gray400 mb-1">
                        {t("payment")}: {order.paymentType.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-gray400">
                        {t("delivery")}: {order.deliveryType.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray200 pt-4">
                    <h3 className="font-semibold mb-3">{t("items")}:</h3>
                    <div className="space-y-3">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4"
                        >
                          <Image
                            src={item.product.image1}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                          <div className="flex-grow">
                            <Link
                              href={`/products/${item.productId}`}
                              className="hover:underline"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray400">
                              {t("quantity")}: {item.quantity} ×{" "}
                              <Price amount={item.price} />
                            </p>
                          </div>
                          <p className="font-semibold">
                            <Price amount={item.quantity * item.price} />
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray200 pt-4 mt-4">
                    <p className="text-sm text-gray400">
                      <strong>{t("shipping_address")}:</strong>{" "}
                      {order.shippingAddress}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-block px-6 py-2 border border-gray500 text-gray500 hover:bg-gray500 hover:text-white transition-colors"
                    >
                      {t("view_details")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  // Get user from cookies
  const cookies = req.headers.cookie;
  let orders: Order[] = [];

  if (cookies && cookies.includes("user")) {
    try {
      // Parse user from cookie
      const userCookie = cookies
        .split("; ")
        .find((row) => row.startsWith("user="));

      if (userCookie) {
        const userData = JSON.parse(
          decodeURIComponent(userCookie.split("=")[1])
        );

        // Fetch orders directly from database
        const rawOrders = await prisma.order.findMany({
          where: { customerId: userData.id },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        // Serialize dates to strings
        orders = rawOrders.map((order) => ({
          ...order,
          orderDate: order.orderDate.toISOString(),
          deliveryDate: order.deliveryDate.toISOString(),
          createdAt: order.createdAt.toISOString(),
          updatedAt: order.updatedAt.toISOString(),
          orderItems: order.orderItems.map((item) => ({
            ...item,
            product: {
              ...item.product,
              createdAt: item.product.createdAt.toISOString(),
              updatedAt: item.product.updatedAt.toISOString(),
            },
          })),
        })) as any;
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  return {
    props: {
      messages: (await import(`../messages/common/${locale}.json`)).default,
      locale,
      orders,
    },
  };
};

export default Orders;
