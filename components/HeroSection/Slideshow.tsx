import { useTranslations } from "next-intl";
import Image from "next/image";

import TextButton from "../Buttons/TextButton";
import styles from "./Hero.module.css";

// swiperjs
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const sliders = [
  {
    id: 2,
    image: "/bg-img/image1.png",
    imageTablet: "/bg-img/image1.jpg",
    imageMobile: "/bg-img/image1.jpg",
    subtitle: "50% off",
    titleUp: "New Cocktail",
    titleDown: "Dresses",
    rightText: false,
  },
  {
    id: 1,
    image: "/bg-img/image2.png",
    imageTablet: "/bg-img/image2.jpg",
    imageMobile: "/bg-img/image2.jpg",
    subtitle: "Spring Revolution",
    titleUp: "Night Summer",
    titleDown: "Dresses",
    rightText: true,
  },
  {
    id: 3,
    image: "/bg-img/image3.png",
    imageTablet: "/bg-img/image3.jpg",
    imageMobile: "/bg-img/image3.jpg",
    subtitle: "Spring promo",
    titleUp: "The Weekend",
    titleDown: "Promotions",
    rightText: false,
  },
];

const Slideshow = () => {
  const t = useTranslations("Index");

  return (
    <>
      <div className="relative -top-20 slide-container w-full z-20">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={true}
          pagination={{
            clickable: true,
            type: "fraction",
            dynamicBullets: true,
          }}
          className="mySwiper"
          style={{ maxHeight: "90vh" }}
        >
          {sliders.map((slider) => (
            <SwiperSlide key={slider.id}>
              <div
                className="hidden lg:block relative"
                style={{ height: "90vh", maxHeight: "90vh" }}
              >
                <Image
                  src={slider.image}
                  layout="fill"
                  objectFit="cover"
                  alt={"some name"}
                />
              </div>
              <div
                className="hidden sm:block lg:hidden relative"
                style={{ height: "90vh", maxHeight: "90vh" }}
              >
                <Image
                  src={slider.imageTablet}
                  layout="fill"
                  objectFit="cover"
                  alt={"some name"}
                />
              </div>
              <div
                className="sm:hidden relative"
                style={{ height: "90vh", maxHeight: "90vh" }}
              >
                <Image
                  src={slider.imageMobile}
                  layout="fill"
                  objectFit="cover"
                  alt={"some name"}
                />
              </div>
              <div
                className={
                  slider.rightText
                    ? styles.rightTextSection
                    : styles.leftTextSection
                }
              >
                <span className={styles.subtitle}>{slider.subtitle}</span>
                <span
                  className={`${styles.title} text-center ${
                    slider.rightText ? "sm:text-right" : "sm:text-left"
                  }`}
                >
                  {slider.titleUp} <br />
                  {slider.titleDown}
                </span>
                <TextButton value={t("shop_now")} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default Slideshow;
