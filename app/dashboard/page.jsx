"use client";

import { useRouter } from "next/navigation";

export default function dashboardPage() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                router.push("/login");
            } else {
                const data = await res.json().catch(() => null);
                alert(data?.error || "Logout failed");
            }
        } catch (err) {
            console.error("Logout error:", err);
            alert("Logout failed");
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                >
                    Logout
                </button>
            </div>

            <div>Dashboard Page</div>
        </div>
    );
}