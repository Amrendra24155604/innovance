"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [approvingRoll, setApprovingRoll] = useState(null); // roll currently being approved

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/users", { method: "GET", credentials: "include" });
      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        // not authorized — redirect to admin login
        console.warn("fetchUsers: unauthorized, redirecting to /admin/login");
        router.push("/admin/login");
        return;
      }

      if (!res.ok) throw new Error(data?.error || "Failed to load users");

      setUsers(data.users || []);
    } catch (err) {
      console.error("fetchUsers error:", err);
      setError(err.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approve = async (roll) => {
    console.log("approve() called for:", roll);
    if (!roll) {
      alert("No roll provided");
      return;
    }
    if (!confirm(`Approve ${roll}?`)) return;

    const url = `/api/admin/users/${encodeURIComponent(roll)}/approve`;
    console.log("Calling approve URL:", url);

    try {
      setApprovingRoll(roll);

      const res = await fetch(url, { method: "PATCH", credentials: "include" });

      let body = null;
      try {
        body = await res.json();
      } catch (e) {
        console.warn("Approve response not JSON", e);
      }

      console.log("Approve response", res.status, body);

      if (res.status === 401) {
        // unauthorized -> redirect to login
        alert("Session expired or unauthorized. Please login again.");
        router.push("/admin/login");
        return;
      }

      if (!res.ok) {
        alert(body?.error || `Approve failed (${res.status})`);
        return;
      }

      // success — refresh the list (or update local state)
      // We'll refresh from server to get latest data
      await fetchUsers();

      alert("Approved");
    } catch (err) {
      console.error("Approve fetch error:", err);
      alert("Network error — see console");
    } finally {
      setApprovingRoll(null);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error)
    return (
      <div className="p-6">
        <div className="mb-4 text-red-600">Error: {error}</div>
        <button onClick={fetchUsers} className="px-3 py-1 bg-blue-600 text-white rounded">
          Retry
        </button>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left">
            <th className="p-2">Roll</th>
            <th className="p-2">Name</th>
            <th className="p-2">Branch/Year</th>
            <th className="p-2">Payment Screenshot</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-600">
                No users found
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.rollNumber} className="border-t">
                <td className="p-2">{u.rollNumber}</td>
                <td className="p-2">
                  {u.firstName} {u.lastName}
                </td>
                <td className="p-2">
                  {u.branch} / {u.year}
                </td>
                <td className="p-2">
                  {u.paymentScreenshot ? (
                    <button onClick={() => setSelectedImage(u.paymentScreenshot)} className="underline text-blue-600">
                      View
                    </button>
                  ) : (
                    "No screenshot"
                  )}
                </td>
                <td className="p-2">{u.isPaymentSuccessful ? "Approved" : "Pending"}</td>
                <td className="p-2">
                  {!u.isPaymentSuccessful && u.paymentScreenshot ? (
                    <button
                      onClick={() => approve(u.rollNumber)}
                      className={`px-3 py-1 rounded text-white ${approvingRoll === u.rollNumber ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                      disabled={approvingRoll === u.rollNumber}
                    >
                      {approvingRoll === u.rollNumber ? "Approving..." : "Approve"}
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Image modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            alt="screenshot"
            className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
