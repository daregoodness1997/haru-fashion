import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  const { auth } = useAuth();
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
  }, [auth]);

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
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getServiceName = (type: string) => {
    const names: Record<string, string> = {
      event_styling: "Event Styling",
      consultation: "Consultation",
      custom_attire: "Custom Attire",
    };
    return names[type] || type;
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
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Service Requests - Admin" />

      <main className="app-max-width app-x-padding my-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Service Requests</h1>
          <p className="text-gray-600">Manage all customer service requests</p>
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
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Pending ({requests.filter((r) => r.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={`px-4 py-2 rounded ${
              filter === "in_progress"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            In Progress (
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
            Completed ({requests.filter((r) => r.status === "completed").length}
            )
          </button>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getServiceName(request.serviceType)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{request.name}</div>
                    <div className="text-gray-500 text-xs">{request.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-purple-600 hover:text-purple-900 mr-3"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No service requests found
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">
                  {getServiceName(selectedRequest.serviceType)}
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p>
                  <strong>Name:</strong> {selectedRequest.name}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${selectedRequest.email}`}
                    className="text-purple-600"
                  >
                    {selectedRequest.email}
                  </a>
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  <a
                    href={`tel:${selectedRequest.phone}`}
                    className="text-purple-600"
                  >
                    {selectedRequest.phone}
                  </a>
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Message */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Message</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedRequest.message}
                </p>
              </div>

              {/* Images */}
              {selectedRequest.images.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Reference Images</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedRequest.images.map((img, index) => (
                      <a
                        key={index}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Reference ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
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
                    <h3 className="font-semibold mb-2">Measurements</h3>
                    <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-2">
                      {Object.entries(selectedRequest.measurements)
                        .filter(([_, value]) => value)
                        .map(([key, value]) => (
                          <p key={key}>
                            <strong>
                              {key.charAt(0).toUpperCase() +
                                key.replace(/([A-Z])/g, " $1").slice(1)}
                              :
                            </strong>{" "}
                            {value as string}
                          </p>
                        ))}
                    </div>
                  </div>
                )}

              {/* Status Update */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Update Status</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateStatus(selectedRequest.id, "in_progress")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(selectedRequest.id, "completed")
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(selectedRequest.id, "cancelled")
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
