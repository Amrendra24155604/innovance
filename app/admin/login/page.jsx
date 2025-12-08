"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include" // safe to include; ensures cookie acceptance in some contexts
      });

      const body = await res.json().catch(()=>null);
      console.log("login response", res.status, body);

      if (!res.ok) {
        setErr(body?.error || `Login failed (${res.status})`);
        return;
      }

      // success — dashboard is protected and will accept cookie
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("login error", err);
      setErr("Network error");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <button className="w-full bg-blue-600 text-white p-2 rounded">Sign in</button>
      </form>
    </div>
  );
}
