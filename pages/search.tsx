import { useCallback, useEffect, useState } from "react";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslations } from "next-intl";

import prisma from "../lib/prisma";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Card from "../components/Card/Card";
import Pagination from "../components/Util/Pagination";
import useWindowSize from "../components/Util/useWindowSize";
import { apiProductsType, itemType } from "../context/cart/cart-types";

type Props = {
  items: itemType[];
  searchWord: string;
};

const Search: React.FC<Props> = ({ items, searchWord }) => {
  const t = useTranslations("Search");

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`Shunapee Fashion House Fashion`} />

      <main id="main-content">
        {/* ===== Breadcrumb Section ===== */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/">
                <a className="text-gray400">{t("home")}</a>
              </Link>{" "}
              / <span>{t("search_results")}</span>
            </div>
          </div>
        </div>

        {/* ===== Heading & Filter Section ===== */}
        <div className="app-x-padding app-max-width w-full mt-8">
          <h1 className="text-3xl mb-2">
            {t("search_results")}: &quot;{searchWord}&quot;
          </h1>
          {items.length > 0 && (
            <div className="flex justify-between mt-6">
              <span>
                {t("showing_results", {
                  products: items.length,
                })}
              </span>
            </div>
          )}
        </div>

        {/* ===== Main Content Section ===== */}
        <div className="app-x-padding app-max-width mt-3 mb-14">
          {items.length < 1 ? (
            <div className="flex justify-center items-center h-72">
              {t("no_result")}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
              {items.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query: { q = "" },
}) => {
  const searchQuery = q as string;

  // Search products directly in database
  const fetchedProducts = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ],
    },
    take: 20,
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
      messages: (await import(`../messages/common/${locale}.json`)).default,
      items,
      searchWord: q,
    },
  };
};

export default Search;
