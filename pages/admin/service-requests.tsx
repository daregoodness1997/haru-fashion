import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import Header from "../../components/Header/Header";
import { useAuth } from "../../context/AuthContext";

type ServiceRequest = {
  id: number;
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  images: string[];
  measurements: any;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const ServiceRequests = () => {
  const t = useTranslations("Admin");
  const tServices = useTranslations("Services");
  const auth = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );

  useEffect(() => {
    if (!auth.user?.isAdmin) {
      router.push("/");
      return;
    }
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/v1/admin/service-requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching service requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    const loadingToast = toast.loading(t("updating"));
    try {
      const response = await fetch(`/api/v1/admin/service-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRequests(
          requests.map((req) =>
            req.id === id ? { ...req, status: newStatus } : req
          )
        );
        if (selectedRequest?.id === id) {
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
        toast.success(`${t("status")} ${t("update_order_status")}`, {
          id: loadingToast,
        });
      } else {
        toast.error(t("update_failed"), { id: loadingToast });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(t("update_failed"), {
        id: loadingToast,
      });
    }
  };

  const getServiceName = (type: string) => {
    return tServices(type) || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter);

  if (loading) {
    return (
      <div>
        <Header title="Service Requests - Admin" />
        <div className="app-max-width app-x-padding my-10 text-center">
          {t("loading")}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Service Requests - Admin" />

      <main className="app-max-width app-x-padding my-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("service_requests")}</h1>
          <p className="text-gray-600">{t("manage_service_requests")}</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t("all")} ({requests.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t("pending")} (
            {requests.filter((r) => r.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={`px-4 py-2 rounded ${
              filter === "in_progress"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t("in_progress")} (
            {requests.filter((r) => r.status === "in_progress").length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded ${
              filter === "completed"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t("completed")} (
            {requests.filter((r) => r.status === "completed").length})
          </button>
        </div>

        {/* Requests Table */}
        <div className="bg-white border-2 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("service_type")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("customer")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("date")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      #{request.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getServiceName(request.serviceType)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{request.name}</div>
                      <div className="text-gray-500 text-xs">
                        {request.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="bg-purple-600 hover:bg-purple-700 text-gray-500 px-4 py-2 transition-colors font-medium"
                      >
                        {t("view_details")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {t("no_service_requests")}
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      <Transition show={!!selectedRequest} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          style={{ zIndex: 99999 }}
          static
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
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
              <div className="relative inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                <button
                  type="button"
                  className="absolute right-5 top-2 outline-none focus:outline-none text-2xl text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedRequest(null)}
                >
                  &#10005;
                </button>

                <Dialog.Title
                  as="h3"
                  className="text-4xl text-center my-8 font-medium leading-6 text-gray-900"
                >
                  {selectedRequest &&
                    getServiceName(selectedRequest.serviceType)}
                </Dialog.Title>

                {selectedRequest && (
                  <div>
                    {/* Customer Info */}
                    <div className="border-2 border-gray300 p-4 mb-4">
                      <h3 className="font-semibold mb-3 text-lg">
                        {t("customer_information")}
                      </h3>
                      <div className="space-y-2">
                        <p>
                          <strong className="text-gray-700">
                            {t("name")}:
                          </strong>{" "}
                          {selectedRequest.name}
                        </p>
                        <p>
                          <strong className="text-gray-700">
                            {t("email")}:
                          </strong>{" "}
                          <a
                            href={`mailto:${selectedRequest.email}`}
                            className="text-purple-600 hover:underline"
                          >
                            {selectedRequest.email}
                          </a>
                        </p>
                        <p>
                          <strong className="text-gray-700">
                            {t("phone")}:
                          </strong>{" "}
                          <a
                            href={`tel:${selectedRequest.phone}`}
                            className="text-purple-600 hover:underline"
                          >
                            {selectedRequest.phone}
                          </a>
                        </p>
                        <p>
                          <strong className="text-gray-700">
                            {t("date")}:
                          </strong>{" "}
                          {new Date(selectedRequest.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-3 text-lg">
                        {tServices("message")}
                      </h3>
                      <div className="border-2 border-gray300 p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedRequest.message}
                        </p>
                      </div>
                    </div>

                    {/* Images */}
                    {selectedRequest.images.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-semibold mb-3 text-lg">
                          📷 {t("reference_images")}
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {selectedRequest.images.map((img, index) => (
                            <a
                              key={index}
                              href={img}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-2 border-gray300 overflow-hidden hover:border-purple-400 transition-colors"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img}
                                alt={`Reference ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Measurements */}
                    {selectedRequest.measurements &&
                      Object.keys(selectedRequest.measurements).some(
                        (key) => selectedRequest.measurements[key]
                      ) && (
                        <div className="mb-4">
                          <h3 className="font-semibold mb-3 text-lg">
                            📏 {t("measurements")}
                          </h3>
                          <div className="border-2 border-gray300 p-4 grid grid-cols-2 gap-3">
                            {Object.entries(selectedRequest.measurements)
                              .filter(([_, value]) => value)
                              .map(([key, value]) => (
                                <p key={key} className="text-sm">
                                  <strong className="text-gray-700">
                                    {key.charAt(0).toUpperCase() +
                                      key.replace(/([A-Z])/g, " $1").slice(1)}
                                    :
                                  </strong>{" "}
                                  <span className="text-gray-900">
                                    {value as string}
                                  </span>
                                </p>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Status Update */}
                    <div className="border-t-2 border-gray300 pt-4 mt-4">
                      <h3 className="font-semibold mb-3 text-lg">
                        {t("update_order_status")}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            updateStatus(selectedRequest.id, "in_progress")
                          }
                          className="px-4 py-3 bg-blue-600 text-gray-500 hover:bg-blue-700 transition-colors font-medium"
                        >
                          {t("mark_in_progress")}
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(selectedRequest.id, "completed")
                          }
                          className="px-4 py-3 bg-green-600 text-gray-500 hover:bg-green-700 transition-colors font-medium"
                        >
                          {t("mark_completed")}
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(selectedRequest.id, "cancelled")
                          }
                          className="px-4 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../messages/common/${locale}.json`)).default,
      locale,
    },
  };
};

export default ServiceRequests;
