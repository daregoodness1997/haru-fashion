import { NextComponentType, NextPageContext } from "next";
import Router from "next/router";
import NProgress from "nprogress";
import { NextIntlClientProvider } from "next-intl";

import { ProvideCart } from "../context/cart/CartProvider";
import { ProvideWishlist } from "../context/wishlist/WishlistProvider";
import { ProvideAuth } from "../context/AuthContext";

import "../styles/globals.css";
import "animate.css";
import "nprogress/nprogress.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

type AppCustomProps = {
  Component: NextComponentType<NextPageContext, any, {}>;
  pageProps: any;
  cartState: string;
  wishlistState: string;
};

const MyApp = ({ Component, pageProps }: AppCustomProps) => {
  return (
    <NextIntlClientProvider
      messages={pageProps?.messages}
      locale={pageProps?.locale || "en"}
      timeZone="UTC"
    >
      <ProvideAuth>
        <ProvideWishlist>
          <ProvideCart>
            <Component {...pageProps} />
          </ProvideCart>
        </ProvideWishlist>
      </ProvideAuth>
    </NextIntlClientProvider>
  );
};

export default MyApp;
