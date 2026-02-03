"use client";

import { useState } from "react";

interface SignUpModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function SignUpModal({ onClose, onSuccess }: SignUpModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Простая проверка на фронте перед отправкой
    // if (formData.password !== formData.repeatPassword) {
    //   setError("Passwords do not match");
    //   return;
    // }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        onClose();
      } else {
        // Выводим ошибку от NestJS (например, ту самую про Match из DTO)
        setError(data.message || "Error during registration");
      }
    } catch (err) {
      setError("Unable to contact the server");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">✕</button>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First name"
              required
              className="w-1/2 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <input
              type="text"
              placeholder="Last name"
              required
              className="w-1/2 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
          
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          <input
            type="password"
            placeholder="Repeat password"
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, repeatPassword: e.target.value})}
          />

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Sign up
          </button>
        </form>

        {/* Разделитель */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => window.location.href = `http://localhost:3000/api/auth/google?mode=login`} className="flex-1 border-2 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google
          </button>
          <button onClick={() => window.location.href = `http://localhost:3000/api/auth/git?mode=login`} className="flex-1 border-2 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-5 h-5" alt="GitHub" /> GitHub
          </button>
        </div>
      </div>
    </div>
  );
}