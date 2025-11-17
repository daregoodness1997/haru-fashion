import Link from "next/link";
import { useTranslations } from "next-intl";

import FacebookLogo from "../../public/icons/FacebookLogo";
import InstagramLogo from "../../public/icons/InstagramLogo";
import WhatsAppLogo from "../../public/icons/WhatsAppLogo";
import Button from "../Buttons/Button";
import Input from "../Input/Input";
import styles from "./Footer.module.css";

export default function Footer() {
  const t = useTranslations("Navigation");

  return (
    <>
      <div className={styles.footerContainer}>
        <div className={`app-max-width app-x-padding ${styles.footerContents}`}>
          <div>
            <h3 className={styles.footerHead}>{t("company")}</h3>
            <div className={styles.column}>
              <Link href="/">{t("about_us")}</Link>
              <Link href="/">{t("contact_us")}</Link>
              <Link href="/">{t("store_location")}</Link>
              <Link href="/">{t("careers")}</Link>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>{t("help")}</h3>
            <div className={styles.column}>
              <Link href="/orders">{t("order_tracking")}</Link>
              <Link href="/">{t("faqs")}</Link>
              <Link href="/">{t("privacy_policy")}</Link>
              <Link href="/">{t("terms_conditions")}</Link>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>{t("store")}</h3>
            <div className={styles.column}>
              <Link href="/product-category/women">{t("women")}</Link>
              <Link href="/product-category/men">{t("men")}</Link>
              <Link href="/product-category/accessories">{t("bags")}</Link>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>{t("keep_in_touch")}</h3>
            <div className={styles.column}>
              <span>
                {t("address.detail")}
                <br />
                {t("address.road")}
                <br />
                {t("address.city")}
              </span>
              <span>{t("phone_number")}</span>
              <span>
                {t("open_all_days")} <br />- {t("opening_hours")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center pb-16">
        <h4 className="text-3xl mb-4">{t("newsletter")}</h4>
        <span className="px-6 text-center">{t("newsletter_desc")}</span>
        <div className="mt-5 px-6 flex w-full sm:w-auto flex-col sm:flex-row">
          <Input
            label="Newsletter Input Box"
            name="email"
            type="email"
            extraClass=" w-full sm:w-auto"
          />{" "}
          <Button
            size="lg"
            value={t("send")}
            extraClass="ml-0 mt-4 sm:mt-0 tracking-widest sm:tracking-normal sm:mt-0 sm:ml-4 w-auto w-full sm:w-auto"
          />
        </div>
      </div>
      <div className={styles.bottomFooter}>
        <div className="app-max-width app-x-padding w-full flex justify-between">
          <span className="">
            @2025 Shunapee Fashion House. {t("all_rights_reserved")}
          </span>
          <span className="flex items-center">
            <span className="hidden sm:block">
              {t("follow_us_on_social_media")}:
            </span>{" "}
            <a
              href="https://wa.me/2348066061271"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp - Shunapee Fashion House"
            >
              <WhatsAppLogo />
            </a>
            <a
              href="https://www.facebook.com/shunapeefashionhouse"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Page - Shunapee Fashion House"
            >
              <FacebookLogo />
            </a>
            <a
              href="https://www.instagram.com/shunapeefashionhouse"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Account - Shunapee Fashion House"
            >
              <InstagramLogo />
            </a>
          </span>
        </div>
      </div>
    </>
  );
}
