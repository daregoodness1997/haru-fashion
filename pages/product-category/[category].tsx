import Link from "next/link";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Menu, Dialog, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { useState, Fragment } from "react";

import prisma from "../../lib/prisma";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Card/Card";
import Pagination from "../../components/Util/Pagination";
import { apiProductsType, itemType } from "../../context/cart/cart-types";
import DownArrow from "../../public/icons/DownArrow";

type OrderType = "latest" | "price" | "price-desc";

type Props = {
  items: itemType[];
  page: number;
  numberOfProducts: number;
  orderby: OrderType;
};

const ProductCategory: React.FC<Props> = ({
  items,
  page,
  numberOfProducts,
  orderby,
}) => {
  const t = useTranslations("Category");
  const tServices = useTranslations("Services");

  const router = useRouter();
  const { category } = router.query;
  const lastPage = Math.ceil(numberOfProducts / 10);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const capitalizedCategory =
    category!.toString().charAt(0).toUpperCase() +
    category!.toString().slice(1);

  const firstIndex = page === 1 ? page : page * 10 - 9;
  const lastIndex = page * 10;

  const handleServiceRequest = (service: string) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send service request email
      const response = await fetch("/api/v1/service-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...serviceFormData,
          service: selectedService,
          category: category,
        }),
      });

      if (response.ok) {
        alert(tServices("request_sent_success"));
        setShowServiceModal(false);
        setServiceFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert(tServices("request_failed"));
      }
    } catch (error) {
      console.error("Error sending service request:", error);
      alert(tServices("request_failed"));
    }
  };

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header
        title={`${capitalizedCategory} - Shunapee Fashion House Fashion`}
      />

      <main id="main-content">
        {/* ===== Breadcrumb Section ===== */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/" className="text-gray400">
                {t("home")}
              </Link>{" "}
              / <span className="capitalize">{t(category as string)}</span>
            </div>
          </div>
        </div>

        {/* ===== Heading & Filter Section ===== */}
        <div className="app-x-padding app-max-width w-full mt-8">
          <h3 className="text-4xl mb-2 capitalize">{t(category as string)}</h3>
          <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-0 justify-between mt-4 sm:mt-6">
            <span>
              {t("showing_from_to", {
                from: firstIndex,
                to: numberOfProducts < lastIndex ? numberOfProducts : lastIndex,
                all: numberOfProducts,
              })}
            </span>
            {category !== "new-arrivals" && <SortMenu orderby={orderby} />}
          </div>
        </div>

        {/* ===== Main Content Section ===== */}
        <div className="app-x-padding app-max-width mt-3 mb-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
            {items.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
          {category !== "new-arrivals" && (
            <Pagination
              currentPage={page}
              lastPage={lastPage}
              orderby={orderby}
            />
          )}
        </div>

        {/* ===== Services Section ===== */}
        <div className="app-x-padding app-max-width mt-8 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">
                ✨ {tServices("additional_services")}
              </h2>
              <p className="text-gray-600">
                {tServices("services_description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Event Styling Service */}
              <button
                onClick={() => handleServiceRequest("event_styling")}
                className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-lg p-4 text-left transition-all hover:shadow-lg group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors flex-shrink-0">
                    <span className="text-2xl">👗</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-purple-900">
                      {tServices("event_styling")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tServices("event_styling_desc")}
                    </p>
                  </div>
                </div>
              </button>

              {/* Style Consultation */}
              <button
                onClick={() => handleServiceRequest("consultation")}
                className="bg-white border-2 border-pink-200 hover:border-pink-400 rounded-lg p-4 text-left transition-all hover:shadow-lg group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors flex-shrink-0">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-pink-900">
                      {tServices("consultation")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tServices("consultation_desc")}
                    </p>
                  </div>
                </div>
              </button>

              {/* Custom Attire Request */}
              <button
                onClick={() => handleServiceRequest("custom_attire")}
                className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-lg p-4 text-left transition-all hover:shadow-lg group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                    <span className="text-2xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-blue-900">
                      {tServices("custom_attire")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tServices("custom_attire_desc")}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ===== Service Request Modal ===== */}
      <Transition show={showServiceModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          style={{ zIndex: 99999 }}
          static
          open={showServiceModal}
          onClose={() => setShowServiceModal(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray500 opacity-50" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl">
                <button
                  type="button"
                  className="absolute right-5 top-2 outline-none focus:outline-none text-2xl"
                  onClick={() => setShowServiceModal(false)}
                >
                  &#10005;
                </button>

                <Dialog.Title
                  as="h3"
                  className="text-4xl text-center my-8 font-medium leading-6 text-gray-900"
                >
                  {tServices(selectedService)}
                </Dialog.Title>

                <p className="text-center text-gray400 mb-4">
                  {tServices("fill_form_below")}
                </p>

                <form onSubmit={handleServiceSubmit} className="mt-2">
                  <input
                    type="text"
                    required
                    value={serviceFormData.name}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        name: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray300 px-4 py-2 mb-4 focus:border-gray500 focus:outline-none"
                    placeholder={`${tServices("your_name")} *`}
                  />

                  <input
                    type="email"
                    required
                    value={serviceFormData.email}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray300 px-4 py-2 mb-4 focus:border-gray500 focus:outline-none"
                    placeholder={`${tServices("email")} *`}
                  />

                  <input
                    type="tel"
                    required
                    value={serviceFormData.phone}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray300 px-4 py-2 mb-4 focus:border-gray500 focus:outline-none"
                    placeholder={`${tServices("phone")} *`}
                  />

                  <textarea
                    required
                    value={serviceFormData.message}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full border-2 border-gray300 px-4 py-2 mb-4 focus:border-gray500 focus:outline-none"
                    placeholder={`${tServices("message")} *`}
                  />

                  <button
                    type="submit"
                    className="w-full text-center text-xl mb-4 bg-gray500 text-white py-3 hover:bg-gray400 transition-colors"
                  >
                    {tServices("send_request")}
                  </button>

                  <div className="text-center text-gray400">
                    <button
                      type="button"
                      onClick={() => setShowServiceModal(false)}
                      className="text-gray500 focus:outline-none focus:underline"
                    >
                      {tServices("cancel")}
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
  query: { page = 1, orderby = "latest" },
}) => {
  const paramCategory = params!.category as string;
  const start = +page === 1 ? 0 : (+page - 1) * 10;
  let numberOfProducts = 0;

  // Build the where clause
  let whereClause: any = {};

  if (paramCategory === "new-arrivals") {
    numberOfProducts = 10;
  } else {
    whereClause.category = paramCategory;
    numberOfProducts = await prisma.product.count({ where: whereClause });
  }

  // Build orderBy clause
  let orderByClause: any = { createdAt: "desc" };

  if (orderby === "price") {
    orderByClause = { price: "asc" };
  } else if (orderby === "price-desc") {
    orderByClause = { price: "desc" };
  }

  // Fetch products
  const fetchedProducts = await prisma.product.findMany({
    where: paramCategory === "new-arrivals" ? {} : whereClause,
    orderBy: orderByClause,
    skip: paramCategory === "new-arrivals" ? 0 : start,
    take: 10,
  });

  let items: itemType[] = [];
  fetchedProducts.forEach((product) => {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img1: product.image1,
      img2: product.image2,
    });
  });

  return {
    props: {
      messages: (await import(`../../messages/common/${locale}.json`)).default,
      locale,
      items,
      numberOfProducts,
      page: +page,
      orderby,
    },
  };
};

const SortMenu: React.FC<{ orderby: OrderType }> = ({ orderby }) => {
  const t = useTranslations("Navigation");
  const router = useRouter();
  const { category } = router.query;

  let currentOrder: string;

  if (orderby === "price") {
    currentOrder = "sort_by_price";
  } else if (orderby === "price-desc") {
    currentOrder = "sort_by_price_desc";
  } else {
    currentOrder = "sort_by_latest";
  }
  return (
    <Menu as="div" className="relative">
      <Menu.Button as="a" href="#" className="flex items-center capitalize">
        {t(currentOrder)} <DownArrow />
      </Menu.Button>
      <Menu.Items className="flex flex-col z-10 items-start text-xs sm:text-sm w-auto sm:right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none">
        <Menu.Item>
          {({ active }) => (
            <button
              type="button"
              onClick={() =>
                router.push(`/product-category/${category}?orderby=latest`)
              }
              className={`${
                active ? "bg-gray100 text-gray500" : "bg-white"
              } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                currentOrder === "sort_by_latest" && "bg-gray500 text-gray100"
              }`}
            >
              {t("sort_by_latest")}
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              type="button"
              onClick={() =>
                router.push(`/product-category/${category}?orderby=price`)
              }
              className={`${
                active ? "bg-gray100 text-gray500" : "bg-white"
              } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                currentOrder === "sort_by_price" && "bg-gray500 text-gray100"
              }`}
            >
              {t("sort_by_price")}
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              type="button"
              onClick={() =>
                router.push(`/product-category/${category}?orderby=price-desc`)
              }
              className={`${
                active ? "bg-gray100 text-gray500" : "bg-white"
              } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                currentOrder === "sort_by_price_desc" &&
                "bg-gray500 text-gray100"
              }`}
            >
              {t("sort_by_price_desc")}
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default ProductCategory;
