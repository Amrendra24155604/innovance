"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function dashboardPage() {
    const router = useRouter();
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;
        async function fetchUser() {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const data = await res.json();
                    if (mounted) setUser(data.user);
                } else {
                    // not logged in or other error
                    const err = await res.json().catch(() => null);
                    console.warn('Fetch /api/user failed', err);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchUser();
        return () => (mounted = false);
    }, []);

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

    function Avatar({ firstName, lastName }) {
        const initials = `${(firstName || "").charAt(0)}${(lastName || "").charAt(0)}`.toUpperCase();
        return (
            <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                {initials || "U"}
            </div>
        );
    }

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

            <div>
                {loading ? (
                    <div>Loading...</div>
                ) : user ? (
                    <div className="flex items-center space-x-4">
                        <button onClick={() => router.push('/profile')} className="p-0 bg-transparent border-0 cursor-pointer">
                            <Avatar firstName={user.firstName} lastName={user.lastName} />
                        </button>
                        <div>
                            <div onClick={() => router.push('/profile')} className="font-medium cursor-pointer">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-600">Roll: {user.rollNumber}</div>
                            <div className="text-sm text-gray-600">Email: {user.kiitEmail}</div>
                        </div>
                    </div>
                ) : (
                    <div>You are not logged in. <a href="/login" className="text-blue-600">Login</a></div>
                )}
            </div>
        </div>
    );
}