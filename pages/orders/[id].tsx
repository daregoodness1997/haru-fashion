import { GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import prisma from "../../lib/prisma";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image1: string;
    category: string;
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
  township: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  orderItems: OrderItem[];
  customer: {
    id: number;
    fullname: string;
    email: string;
    phone: string;
  };
};

type Props = {
  order: Order | null;
};

const OrderDetail: React.FC<Props> = ({ order }) => {
  const t = useTranslations("Orders");

  if (!order) {
    return (
      <div>
        <Header title="Order Not Found - Haru Fashion" />
        <main className="app-max-width app-x-padding my-16 text-center">
          <h1 className="text-3xl mb-4">{t("order_not_found")}</h1>
          <Link href="/orders" className="text-blue-600 hover:underline">
            {t("back_to_orders")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (deliveryDate: string) => {
    const delivery = new Date(deliveryDate);
    const now = new Date();
    if (delivery < now) {
      return "bg-green-100 text-green-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  const getStatusText = (deliveryDate: string) => {
    const delivery = new Date(deliveryDate);
    const now = new Date();
    if (delivery < now) {
      return t("delivered");
    }
    return t("in_transit");
  };

  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div>
      <Header title={`Order #${order.orderNumber} - Haru Fashion`} />

      <main id="main-content">
        {/* Breadcrumb Section */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/" className="text-gray400">
                {t("home")}
              </Link>{" "}
              /{" "}
              <Link href="/orders" className="text-gray400">
                {t("my_orders")}
              </Link>{" "}
              /{" "}
              <span>
                {t("order")} #{order.orderNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="app-x-padding app-max-width my-8">
          {/* Order Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8">
            <div>
              <h1 className="text-4xl mb-4">
                {t("order")} #{order.orderNumber}
              </h1>
              <p className="text-gray400 mb-2">
                {t("order_date")}: {formatDate(order.orderDate)}
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  order.deliveryDate
                )}`}
              >
                {getStatusText(order.deliveryDate)}
              </span>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/orders"
                className="inline-block px-6 py-2 border border-gray500 text-gray500 hover:bg-gray500 hover:text-white transition-colors"
              >
                {t("back_to_orders")}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="border border-gray200 p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {t("order_items")}
                </h2>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 pb-4 border-b border-gray200 last:border-b-0"
                    >
                      <Link href={`/products/${item.productId}`}>
                        <Image
                          src={item.product.image1}
                          alt={item.product.name}
                          width={100}
                          height={100}
                          className="object-cover cursor-pointer hover:opacity-80"
                        />
                      </Link>
                      <div className="flex-grow">
                        <Link
                          href={`/products/${item.productId}`}
                          className="text-lg font-semibold hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-gray400 text-sm capitalize">
                          {t("category")}: {item.product.category}
                        </p>
                        <p className="text-gray400 mt-1">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray200">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray400">{t("subtotal")}:</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray400">{t("shipping")}:</span>
                    <span className="font-semibold">{t("free")}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray200">
                    <span>{t("total")}:</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Info Sidebar */}
            <div className="space-y-6">
              {/* Delivery Information */}
              <div className="border border-gray200 p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t("delivery_info")}
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>{t("expected_delivery")}:</strong>
                  </p>
                  <p className="text-gray400">
                    {formatDate(order.deliveryDate)}
                  </p>
                  <p className="mt-4">
                    <strong>{t("delivery_method")}:</strong>
                  </p>
                  <p className="text-gray400 capitalize">
                    {order.deliveryType.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border border-gray200 p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t("shipping_address")}
                </h3>
                <p className="text-sm text-gray400">{order.shippingAddress}</p>
                {order.township && (
                  <p className="text-sm text-gray400 mt-1">{order.township}</p>
                )}
                {order.city && (
                  <p className="text-sm text-gray400">{order.city}</p>
                )}
                {order.state && order.zipCode && (
                  <p className="text-sm text-gray400">
                    {order.state} {order.zipCode}
                  </p>
                )}
              </div>

              {/* Payment Information */}
              <div className="border border-gray200 p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t("payment_info")}
                </h3>
                <p className="text-sm">
                  <strong>{t("payment_method")}:</strong>
                </p>
                <p className="text-sm text-gray400 capitalize">
                  {order.paymentType.replace(/_/g, " ")}
                </p>
              </div>

              {/* Customer Information */}
              <div className="border border-gray200 p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t("customer_info")}
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>{t("name")}:</strong>
                  </p>
                  <p className="text-gray400">{order.customer.fullname}</p>
                  <p className="mt-2">
                    <strong>{t("email")}:</strong>
                  </p>
                  <p className="text-gray400">{order.customer.email}</p>
                  <p className="mt-2">
                    <strong>{t("phone")}:</strong>
                  </p>
                  <p className="text-gray400">{order.customer.phone}</p>
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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const orderId = params!.id as string;
  let order: Order | null = null;

  try {
    // Fetch order directly from database
    const fetchedOrder = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (fetchedOrder) {
      // Map category from product to match Order type
      order = {
        ...fetchedOrder,
        orderItems: fetchedOrder.orderItems.map((item) => ({
          ...item,
          product: {
            ...item.product,
            category: item.product.category, // Already a string
          },
        })),
      } as any;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
  }

  return {
    props: {
      messages: (await import(`../../messages/common/${locale}.json`)).default,
      locale,
      order,
    },
  };
};

export default OrderDetail;
