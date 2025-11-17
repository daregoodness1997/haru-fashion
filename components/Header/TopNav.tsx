import { Menu } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import Link from "next/link";

import { useCurrency } from "../../context/CurrencyContext";
import InstagramLogo from "../../public/icons/InstagramLogo";
import FacebookLogo from "../../public/icons/FacebookLogo";
import WhatsAppLogo from "../../public/icons/WhatsAppLogo";
import DownArrow from "../../public/icons/DownArrow";
import styles from "./Header.module.css";

type LinkProps = {
  href: string;
  locale: "en" | "fr" | "es";
  active: boolean;
};

const MyLink: React.FC<LinkProps> = ({
  href,
  locale,
  children,
  active,
  ...rest
}) => {
  return (
    <Link
      href={href}
      locale={locale}
      className={`py-2 px-4 text-center ${
        active ? "bg-gray200 text-gray500" : "bg-white text-gray500"
      }`}
      {...rest}
    >
      {children}
    </Link>
  );
};

const TopNav = () => {
  const router = useRouter();
  const { asPath, locale } = router;
  const t = useTranslations("Navigation");
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="bg-gray500 text-gray100 hidden lg:block">
      <div className="flex justify-between app-max-width">
        <ul className={`flex ${styles.topLeftMenu}`}>
          <li>
            <a
              href="https://wa.me/2348066061271"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp - Shunapee Fashion House"
            >
              <WhatsAppLogo />
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/shunapeefashionhouse"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Page - Shunapee Fashion House"
            >
              <FacebookLogo />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/shunapeefashionhouse"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Account - Shunapee Fashion House"
            >
              <InstagramLogo />
            </a>
          </li>
          <li>
            <a href="#">{t("about_us")}</a>
          </li>
          <li>
            <a href="#">{t("our_policy")}</a>
          </li>
        </ul>
        <ul className={`flex ${styles.topRightMenu}`}>
          <li>
            <Menu as="div" className="relative">
              <Menu.Button as="a" href="#" className="flex">
                {locale === "en" ? "EN" : locale === "fr" ? "FR" : "ES"}{" "}
                <DownArrow />
              </Menu.Button>
              <Menu.Items
                className="flex flex-col w-20 right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none"
                style={{ zIndex: 9999 }}
              >
                <Menu.Item>
                  {({ active }) => (
                    <MyLink active={active} href={asPath} locale="en">
                      EN
                    </MyLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MyLink active={active} href={asPath} locale="fr">
                      FR
                    </MyLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MyLink active={active} href={asPath} locale="es">
                      ES
                    </MyLink>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </li>
          <li>
            <Menu as="div" className="relative">
              <Menu.Button as="a" href="#" className="flex">
                {currency === "USD" ? "USD" : "NGN"} <DownArrow />
              </Menu.Button>
              <Menu.Items
                className="flex flex-col w-20 right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none"
                style={{ zIndex: 9999 }}
              >
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setCurrency("USD")}
                      className={`${
                        active
                          ? "bg-gray100 text-gray500"
                          : "bg-white text-gray500"
                      } ${
                        currency === "USD" ? "font-bold" : ""
                      } py-2 px-4 text-center focus:outline-none`}
                    >
                      USD
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setCurrency("NGN")}
                      className={`${
                        active
                          ? "bg-gray100 text-gray500"
                          : "bg-white text-gray500"
                      } ${
                        currency === "NGN" ? "font-bold" : ""
                      } py-2 px-4 text-center focus:outline-none`}
                    >
                      NGN
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopNav;
