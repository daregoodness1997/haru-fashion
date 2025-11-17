import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { useTranslations } from "next-intl";

import prisma from "../../lib/prisma";
import Price from "../../components/Price/Price";
import Heart from "../../public/icons/Heart";
import DownArrow from "../../public/icons/DownArrow";
import FacebookLogo from "../../public/icons/FacebookLogo";
import InstagramLogo from "../../public/icons/InstagramLogo";
import WhatsAppLogo from "../../public/icons/WhatsAppLogo";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import GhostButton from "../../components/Buttons/GhostButton";
import Button from "../../components/Buttons/Button";
import Card from "../../components/Card/Card";

// swiperjs
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import { apiProductsType, itemType } from "../../context/cart/cart-types";
import { useWishlist } from "../../context/wishlist/WishlistProvider";
import { useCart } from "../../context/cart/CartProvider";
import HeartSolid from "../../public/icons/HeartSolid";

type Props = {
  product: itemType;
  products: itemType[];
};

const Product: React.FC<Props> = ({ product, products }) => {
  const img1 = product.img1;
  const img2 = product.img2;

  const { addItem } = useCart();
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const [size, setSize] = useState("M");
  const [mainImg, setMainImg] = useState(img1);
  const [currentQty, setCurrentQty] = useState(1);
  const t = useTranslations("Category");

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === product.id).length > 0;

  useEffect(() => {
    setMainImg(product.img1);
  }, [product]);

  const handleSize = (value: string) => {
    setSize(value);
  };

  const currentItem = {
    ...product,
    qty: currentQty,
    size: size,
  };

  const handleWishlist = () => {
    alreadyWishlisted
      ? deleteWishlistItem!(currentItem)
      : addToWishlist!(currentItem);
  };

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`${product.name} - Shunapee Fashion House Fashion`} />

      <main id="main-content">
        {/* ===== Breadcrumb Section ===== */}
        <div className="bg-lightgreen h-16 w-full flex items-center border-t-2 border-gray200">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/" className="text-gray400">
                {t("home")}
              </Link>{" "}
              /{" "}
              <Link
                href={`/product-category/${product.categoryName}`}
                className="text-gray400 capitalize"
              >
                {t(product.categoryName as string)}
              </Link>{" "}
              / <span>{product.name}</span>
            </div>
          </div>
        </div>
        {/* ===== Main Content Section ===== */}
        <div className="itemSection app-max-width app-x-padding flex flex-col md:flex-row">
          <div className="imgSection w-full md:w-1/2 h-full flex">
            <div className="hidden sm:block w-full sm:w-1/4 h-full space-y-4 my-4">
              <Image
                className={`cursor-pointer ${
                  mainImg === img1
                    ? "opacity-100 border border-gray300"
                    : "opacity-50"
                }`}
                onClick={() => setMainImg(img1)}
                src={img1 as string}
                alt={product.name}
                width={1000}
                height={1282}
              />
              <Image
                className={`cursor-pointer ${
                  mainImg === img2
                    ? "opacity-100 border border-gray300"
                    : "opacity-50"
                }`}
                onClick={() => setMainImg(img2)}
                src={img2 as string}
                alt={product.name}
                width={1000}
                height={1282}
              />
            </div>
            <div className="w-full sm:w-3/4 h-full m-0 sm:m-4 ">
              <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                pagination={{
                  clickable: true,
                }}
                className="mySwiper sm:hidden"
              >
                <SwiperSlide>
                  <Image
                    className="each-slide w-7/8"
                    src={img1 as string}
                    width={1000}
                    height={1282}
                    alt={product.name}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Image
                    className="each-slide w-7/8"
                    src={img2 as string}
                    width={1000}
                    height={1282}
                    alt={product.name}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
          <div className="infoSection w-full md:w-1/2 h-auto py-8 sm:pl-4 flex flex-col px-4">
            <h1 className="text-3xl mb-4">{product.name}</h1>
            <span className="text-2xl text-gray400 mb-2">
              <Price amount={product.price} />
            </span>
            <span className="mb-2 text-justify">{product.description}</span>
            <span className="mb-2">
              {t("availability")}: {t("in_stock")}
            </span>
            <span className="mb-2">
              {t("size")}: {size}
            </span>
            <div className="sizeContainer flex space-x-4 text-sm mb-4">
              <div
                onClick={() => handleSize("S")}
                className={`w-8 h-8 flex items-center justify-center border ${
                  size === "S"
                    ? "border-gray500"
                    : "border-gray300 text-gray400"
                } cursor-pointer hover:bg-gray500 hover:text-gray100`}
              >
                S
              </div>
              <div
                onClick={() => handleSize("M")}
                className={`w-8 h-8 flex items-center justify-center border ${
                  size === "M"
                    ? "border-gray500"
                    : "border-gray300 text-gray400"
                } cursor-pointer hover:bg-gray500 hover:text-gray100`}
              >
                M
              </div>
              <div
                onClick={() => handleSize("L")}
                className={`w-8 h-8 flex items-center justify-center border ${
                  size === "L"
                    ? "border-gray500"
                    : "border-gray300 text-gray400"
                } cursor-pointer hover:bg-gray500 hover:text-gray100`}
              >
                L
              </div>
            </div>
            <div className="addToCart flex flex-col sm:flex-row md:flex-col lg:flex-row space-y-4 sm:space-y-0 mb-4">
              <div className="plusOrMinus h-12 flex border justify-center border-gray300 divide-x-2 divide-gray300 mb-4 mr-0 sm:mr-4 md:mr-0 lg:mr-4">
                <div
                  onClick={() => setCurrentQty((prevState) => prevState - 1)}
                  className={`${
                    currentQty === 1 && "pointer-events-none"
                  } h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100`}
                >
                  -
                </div>
                <div className="h-full w-28 sm:w-12 flex justify-center items-center pointer-events-none">
                  {currentQty}
                </div>
                <div
                  onClick={() => setCurrentQty((prevState) => prevState + 1)}
                  className="h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100"
                >
                  +
                </div>
              </div>
              <div className="flex h-12 space-x-4 w-full">
                <Button
                  value={t("add_to_cart")}
                  size="lg"
                  extraClass={`flex-grow text-center whitespace-nowrap`}
                  onClick={() => addItem!(currentItem)}
                />
                <GhostButton onClick={handleWishlist}>
                  {alreadyWishlisted ? (
                    <HeartSolid extraClass="inline" />
                  ) : (
                    <Heart extraClass="inline" />
                  )}
                </GhostButton>
              </div>
            </div>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="py-2 focus:outline-none text-left mb-4 border-b-2 border-gray200 flex items-center justify-between">
                    <span>{t("details")}</span>
                    <DownArrow
                      extraClass={`${
                        open ? "" : "transform rotate-180"
                      } w-5 h-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel
                    className={`text-gray400 animate__animated animate__bounceIn`}
                  >
                    {product.detail}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            {/* ===== Policy Section ===== */}
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="py-2 focus:outline-none text-left mb-4 border-b-2 border-gray200 flex items-center justify-between">
                    <span className="font-semibold">
                      Shunapee Fashion House – Policy
                    </span>
                    <DownArrow
                      extraClass={`${
                        open ? "" : "transform rotate-180"
                      } w-5 h-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel
                    className={`text-gray400 text-sm animate__animated animate__bounceIn mb-4`}
                  >
                    <ul className="space-y-2 list-disc pl-5">
                      <li>
                        80% booking fee is required to confirm all orders.
                      </li>
                      <li>2–3 fittings required for luxury orders.</li>
                      <li>
                        Delivery available worldwide – delivery fee applies.
                      </li>
                      <li>
                        Production timeline: 7–21 working days depending on the
                        design.
                      </li>
                      <li>Urgent orders attract 20%–40% extra fee.</li>
                      <li>No refunds once payment is made.</li>
                      <li>
                        We are not liable for wrong self-submitted measurements.
                      </li>
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <div className="flex items-center space-x-4 mt-4">
              <span>{t("share")}</span>
              <a
                href="https://wa.me/2348066061271"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
              >
                <WhatsAppLogo extraClass="h-4 cursor-pointer text-gray400 hover:text-gray500" />
              </a>
              <a
                href="https://www.facebook.com/shunapeefashionhouse"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
              >
                <FacebookLogo extraClass="h-4 cursor-pointer text-gray400 hover:text-gray500" />
              </a>
              <a
                href="https://www.instagram.com/shunapeefashionhouse"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Instagram"
              >
                <InstagramLogo extraClass="h-4 cursor-pointer text-gray400 hover:text-gray500" />
              </a>
            </div>
          </div>
        </div>
        {/* ===== Horizontal Divider ===== */}
        <div className="border-b-2 border-gray200"></div>

        {/* ===== You May Also Like Section ===== */}
        <div className="recSection my-8 app-max-width app-x-padding">
          <h2 className="text-3xl mb-6">{t("you_may_also_like")}</h2>
          <Swiper
            slidesPerView={2}
            // centeredSlides={true}
            spaceBetween={10}
            loop={true}
            grabCursor={true}
            pagination={{
              clickable: true,
              type: "bullets",
            }}
            className="mySwiper card-swiper sm:hidden"
          >
            {products.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="mb-6">
                  <Card key={item.id} item={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
            {products.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const paramId = params!.id as string;

  // Fetch product directly from database
  const fetchedProduct = await prisma.product.findUnique({
    where: { id: parseInt(paramId) },
  });

  if (!fetchedProduct) {
    return { notFound: true };
  }

  let product: itemType = {
    id: fetchedProduct.id,
    name: fetchedProduct.name,
    price: fetchedProduct.price,
    detail: fetchedProduct.description,
    img1: fetchedProduct.image1,
    img2: fetchedProduct.image2,
    categoryName: fetchedProduct.category,
  };

  // Fetch related products from same category
  const fetchedProducts = await prisma.product.findMany({
    where: {
      category: fetchedProduct.category,
      id: { not: fetchedProduct.id }, // Exclude current product
    },
  });

  // Shuffle array
  const shuffled = fetchedProducts.sort(() => 0.5 - Math.random());

  // Get sub-array of first 5 elements after shuffled
  let randomFetchedProducts = shuffled.slice(0, 5);

  let products: itemType[] = [];
  randomFetchedProducts.forEach((randomProduct) => {
    products.push({
      id: randomProduct.id,
      name: randomProduct.name,
      price: randomProduct.price,
      img1: randomProduct.image1,
      img2: randomProduct.image2,
    });
  });

  // Pass data to the page via props
  return {
    props: {
      product,
      products,
      messages: (await import(`../../messages/common/${locale}.json`)).default,
    },
  };
};

export default Product;
