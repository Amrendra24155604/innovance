"use client";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-8">
      {/* Hero Section */}
      <header className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-wide">
          INNOVANCE 4.0
        </h1>
        <h2 className="text-2xl font-semibold">
          By IoT Labs
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-200">
          Join us for the ultimate innovation fest — where technology, creativity, and collaboration meet.
        </p>
      </header>

      {/* Call to Action */}
      <div className="mt-10 flex space-x-6">
        <a
          href="/register"
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          Register Now
        </a>
        <a
          href="/about"
          className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Learn More
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} IoT Labs. All rights reserved.
      </footer>
    </div>
  );
}