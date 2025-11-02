import { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/Buttons/Button";

export default function AdminProducts() {
  const t = useTranslations("Admin");
  const router = useRouter();
  const auth = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "men",
    image1: "",
    image2: "",
    description: "",
  });
  const [image1File, setImage1File] = useState<File | null>(null);
  const [image2File, setImage2File] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [image1Preview, setImage1Preview] = useState<string>("");
  const [image2Preview, setImage2Preview] = useState<string>("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?limit=100`
      );
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.user) {
      router.push("/");
      return;
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload-image?userId=${auth.user?.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUploading(true);

      // Upload images if new files are selected
      let image1Url = formData.image1;
      let image2Url = formData.image2;

      if (image1File) {
        image1Url = await uploadImage(image1File);
      }

      if (image2File) {
        image2Url = await uploadImage(image2File);
      }

      const productData = {
        ...formData,
        image1: image1Url,
        image2: image2Url,
      };

      if (editingProduct) {
        // Update product
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products`,
          {
            userId: auth.user?.id,
            id: editingProduct.id,
            ...productData,
          }
        );
        alert(t("product_updated_successfully"));
      } else {
        // Create product
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products`,
          {
            userId: auth.user?.id,
            ...productData,
          }
        );
        alert(t("product_added_successfully"));
      }

      // Reset form
      setFormData({
        name: "",
        price: "",
        category: "men",
        image1: "",
        image2: "",
        description: "",
      });
      setImage1File(null);
      setImage2File(null);
      setImage1Preview("");
      setImage2Preview("");
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      if (error.response?.status === 403) {
        alert(t("admin_access_required"));
      } else {
        alert(t("operation_failed"));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image1: product.image1,
      image2: product.image2,
      description: product.description,
    });
    setImage1Preview(product.image1);
    setImage2Preview(product.image2);
    setImage1File(null);
    setImage2File(null);
    setShowForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm(t("confirm_delete_product"))) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/products?userId=${auth.user?.id}&id=${productId}`
      );
      alert(t("product_deleted_successfully"));
      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      if (error.response?.status === 403) {
        alert(t("admin_access_required"));
      } else {
        alert(t("operation_failed"));
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      price: "",
      category: "men",
      image1: "",
      image2: "",
      description: "",
    });
    setImage1File(null);
    setImage2File(null);
    setImage1Preview("");
    setImage2Preview("");
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleImage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage1File(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage1Preview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage2File(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage2Preview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!auth.user || loading) {
    return (
      <div>
        <Header title="Manage Products - Admin - Haru Fashion" />
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
      <Header title="Manage Products - Admin - Haru Fashion" />

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
              / <span>{t("manage_products")}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="app-x-padding app-max-width my-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl">{t("manage_products")}</h1>
            <div className="flex gap-4">
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gray500 text-white hover:bg-gray400 transition-colors"
                >
                  {t("add_new_product")}
                </button>
              )}
              <Link
                href="/admin"
                className="px-6 py-3 border border-gray500 text-gray500 hover:bg-gray500 hover:text-white transition-colors"
              >
                {t("back_to_dashboard")}
              </Link>
            </div>
          </div>

          {/* Add/Edit Product Form */}
          {showForm && (
            <div className="border border-gray200 p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {editingProduct ? t("edit_product") : t("add_new_product")}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">{t("product_name")}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full border border-gray300 px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">{t("price")}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      className="w-full border border-gray300 px-4 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">{t("category")}</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border border-gray300 px-4 py-2"
                  >
                    <option value="men">{t("men")}</option>
                    <option value="women">{t("women")}</option>
                    <option value="bags">{t("bags")}</option>
                    <option value="material">{t("material")}</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">{t("image_1")}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage1Change}
                      className="w-full border border-gray300 px-4 py-2"
                    />
                    {image1Preview && (
                      <div className="mt-2 relative w-full h-48">
                        <Image
                          src={image1Preview}
                          alt="Image 1 Preview"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray400 mt-1">
                      {editingProduct && !image1File
                        ? t("current_image_kept")
                        : t("upload_new_image")}
                    </p>
                  </div>
                  <div>
                    <label className="block mb-2">{t("image_2")}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage2Change}
                      className="w-full border border-gray300 px-4 py-2"
                    />
                    {image2Preview && (
                      <div className="mt-2 relative w-full h-48">
                        <Image
                          src={image2Preview}
                          alt="Image 2 Preview"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray400 mt-1">
                      {editingProduct && !image2File
                        ? t("current_image_kept")
                        : t("upload_new_image")}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">{t("description")}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows={4}
                    className="w-full border border-gray300 px-4 py-2"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    value={
                      uploading
                        ? t("uploading")
                        : editingProduct
                        ? t("update_product")
                        : t("add_product")
                    }
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray300 text-gray500 hover:bg-gray100 transition-colors disabled:opacity-50"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <p className="text-gray400 text-center py-8">{t("no_products")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border border-gray200 p-4">
                  <div className="relative w-full h-64 mb-4">
                    <Image
                      src={product.image1}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray400 mb-2">{product.category}</p>
                  <p className="text-xl font-semibold mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      {t("delete")}
                    </button>
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
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../../messages/common/${locale}.json`))
        .default,
      locale: locale || "en",
    },
  };
};
